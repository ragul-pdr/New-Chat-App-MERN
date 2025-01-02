import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Form from "../components/Form";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { extractTime } from "../components/extractTime.js";
import FirstSidebar from "../components/FirstSidebar.jsx";
import ProfileBar from "../components/ProfileBar.jsx";
import axios from "axios";

const Chat = ({ socket }) => {
  const [chatInitiated, setChatInitiated] = useState(false);
  const [groupInitiated, setGroupInitiated] = useState(false);
  const [groupChatInitiated, setGroupChatInitiated] = useState(false);
  const [chats, setChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [receiverId, setReceiverId] = useState();
  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    image: "",
    _id: "",
  });
  const [selectedGroup, setSelectedGroup] = useState({
    groupname: "",
    groupimage: "",
    _id: "",
  });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const userId = window.localStorage.getItem("userId");
  const chatContainerRef = useRef(null);

  const fetchGroupMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/group/${selectedGroup._id}/members`,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        }
      );
      console.log(response.data);
      setGroupMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching group members", error);
    }
  };

  const handleAddSelectedUsersToGroup = async (userId) => {
    console.log("selectedGroup._id", selectedGroup._id); // Log for debugging
    if (!selectedGroup._id) {
      console.error('Group ID is not defined');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/group/${selectedGroup._id}/add`,
        { userId }
      );
      console.log('User added to group:', response.data);
    } catch (error) {
      console.error('Error adding user to group:', error.message);
    }
  };

  const handleUserSelection = (e, user) => {
    if (e.target.checked) {
      setSelectedUsers((prev) => [...prev, user]);
    } else {
      setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
    }
  };

  useEffect(() => {
    if (selectedGroup._id) {
      fetchGroupMembers();
    }
  }, [selectedGroup]);

  useEffect(() => {
    socket.emit("join", userId);

    socket.on("updateUserList", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("updateUserList");
    };
  }, [socket, userId]);

  useEffect(() => {
    const handleNewMessages = (message) => {
      if (message.receiver === userId && message.sender === receiverId) {
        setChats((state) => [...state, message]);
      }
    };

    const handleNewGroupMessage = (groupMessage) => {
      if (groupMessage.groupId === selectedGroup._id) {
        setGroupChats((state) => [...state, groupMessage]);
      }
    };

    socket.on("newMessage", handleNewMessages);
    socket.on("newGroupMessage", handleNewGroupMessage);

    return () => {
      socket.off("newMessage", handleNewMessages);
      socket.off("newGroupMessage", handleNewGroupMessage);
    };
  }, [socket, receiverId, selectedGroup._id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats, groupChats]);

  const addUserToGroup = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/group/${selectedGroup._id}/add`,
        { userId: selectedUser },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error adding user to group", error);
    }
  };

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/chat/users", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        });
        setUsers(response.data.users);
        console.log(response.data.users);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen ">
      <div
        style={{ backgroundImage: "url('./bgmain.png')" }}
        className="bg-cover w-full h-full flex"
      >
        <FirstSidebar socket={socket} setOnlineUsers={setOnlineUsers} />

        <div className="flex flex-col w-1/4">
          <ProfileBar />
          <Sidebar
            setChatInitiated={setChatInitiated}
            setChats={setChats}
            setGroupChats={setGroupChats}
            setReceiverId={setReceiverId}
            setSelectedUser={setSelectedUser}
            onlineUsers={onlineUsers}
            setGroupInitiated={setGroupInitiated}
            groupInitiated={groupInitiated}
            message={message}
            setMessage={setMessage}
            setSelectedGroup={setSelectedGroup}
            setGroupChatInitiated={setGroupChatInitiated}
          />
        </div>

        <div className="w-full flex flex-col bg-opacity-20 relative">
          {groupInitiated ? (
            groupChatInitiated ? (
              <div>
                <div className="h-15 bg-slate-500 m-2 ml-1 rounded-lg bg-opacity-20 flex justify-between items-center p-4">
                  <div className="flex items-center justify-between space-x-4">
                    <img
                      src="./"
                      alt="GImg"
                      className="border rounded-full w-12 h-12"
                    />
                    <span className=" text-sm text-white">
                      Gname: {selectedGroup.groupname}
                      <br />
                      GId: {selectedGroup._id}
                      <br />
                      Members:{groupMembers.length}
                      {/* <p>
                        {" "}
                        {Array.isArray(groupMembers) &&
                          groupMembers.map((member) => (
                            <li key={member._id}>{member.name}</li>
                          ))}
                      </p> */}
                    </span>
                  </div>
                  <div className="flex items-center text-white hover:cursor-pointer">
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="bg-blue-500 text-white p-1 mr-2 rounded-md"
                      >
                        Add Member
                      </button>

                      {dropdownOpen && (
                        <div className="absolute bg-blue-500 border rounded-md shadow-md mt-2 w-48 z-10">
                          <ul className="max-h-48 overflow-y-auto">
                            {users.length > 0 ? (
                              users.map((user) => (
                                <li
                                  key={user._id}
                                  className="items-center px-4 py-2 hover:bg-slate-300 flex justify-between"
                                >
                                  <div className="flex items-center">
                                    <img
                                      src={`http://localhost:5000/images/${user.image}`}
                                      alt="userImg"
                                      className="h-12 w-12 rounded-full"
                                    />
                                    <label className="text-gray-700 px-2">
                                      {user.username}
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    value={user._id}
                                    onChange={(e) =>
                                      handleUserSelection(e, user)
                                    }
                                    className="mr-2"
                                  />
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-2 text-gray-500">
                                No users found.
                              </li>
                            )}
                          </ul>
                          <button
                            onClick={() => {
                              selectedUsers.forEach((user) =>
                                handleAddSelectedUsersToGroup(user._id)
                              );
                              setDropdownOpen(false);
                            }}
                            className="bg-green-500 text-white px-4 py-2 w-full"
                          >
                            Confirm
                          </button>
                        </div>
                      )}
                    </div>

                    <FaPhoneAlt className="mr-10 text-xl rounded-full hover:text-gray-400" />
                    <FaVideo className="mr-10 text-xl rounded-full hover:text-gray-400" />
                    <BsThreeDotsVertical className="mr-1 rounded-full text-xl hover:text-gray-400" />
                  </div>
                </div>
                <div
                  className="overflow-y-auto h-3/4 mb-20 scrollbar-thin scrollbar-border scrollbar-thumb-blue-600 scrollbar-track-transparent"
                  ref={chatContainerRef}
                >
                  {groupChats?.group?.messages?.map((chat, index) => (
                    <div
                      key={index}
                      className={`chat ${
                        chat.sender === userId ? "chat-end" : "chat-start"
                      }`}
                    >
                      <div
                        className={`chat-bubble  ${
                          chat.sender === userId
                            ? "bg-blue-500 mr-2 text-white"
                            : "bg-gray-200 ml-2 text-black"
                        }`}
                      >
                        {chat.content}
                      </div>
                      <div className="chat-footer text-xs text-gray-500">
                        <time className="ml-2">
                          {extractTime(chat.createdAt)}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
                <Form
                  selectedGroupId={selectedGroup._id}
                  isGroup={true}
                  groupChats={groupChats}
                  setGroupChats={setGroupChats}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <h3 className="text-lg text-gray-300">
                  Select a Group to Start Your Conversation...
                </h3>
              </div>
            )
          ) : chatInitiated ? (
            <>
              <div className="h-15 bg-slate-500 m-2 ml-1 rounded-lg bg-opacity-20 flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={`http://localhost:5000/images/${selectedUser.image}`}
                    alt="userImg"
                    className="border rounded-full w-12 h-12"
                  />
                  <span className=" text-sm text-white">
                    {selectedUser.username}
                  </span>
                </div>
                <div className="flex items-center text-white hover:cursor-pointer">
                  <FaPhoneAlt className="mr-10 text-xl rounded-full hover:text-gray-400" />
                  <FaVideo className="mr-10 text-xl rounded-full hover:text-gray-400" />
                  <BsThreeDotsVertical className="mr-1 rounded-full text-xl hover:text-gray-400" />
                </div>
              </div>
              <div
                className="overflow-y-auto h-3/4 mb-20 scrollbar-thin scrollbar-border scrollbar-thumb-blue-600 scrollbar-track-transparent"
                ref={chatContainerRef}
              >
                {chats?.map((chat, index) => (
                  <div
                    key={index}
                    className={`chat ${
                      chat.sender === userId ? "chat-end" : "chat-start"
                    }`}
                  >
                    <div
                      className={`chat-bubble ${
                        chat.sender === userId
                          ? "bg-blue-500 mr-2 text-white"
                          : "bg-gray-200 ml-2 text-black"
                      }`}
                    >
                      {chat.content}
                    </div>
                    <div className="chat-footer text-xs text-gray-500">
                      <time className="ml-2">
                        {extractTime(chat.createdAt)}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
              <Form
                receiverId={receiverId}
                isGroup={false}
                chats={chats}
                setChats={setChats}
              />
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <h3 className="text-lg text-gray-300">
                Select a User to Start Your Conversation...
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
