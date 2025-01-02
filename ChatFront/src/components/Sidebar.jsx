import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

const Sidebar = ({
  setChatInitiated,
  setChats,
  setReceiverId,
  setSelectedUser,
  onlineUsers,
  setGroupInitiated,
  groupInitiated,
  message,
  setMessage,
  setSelectedGroup,
  setGroupChatInitiated,
  setGroupChats
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [groups, setGroups] = useState([]); // Initialize groups as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState("");

  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // search functionality for users
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // fetch all users and groups
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
      } catch (err) {
        console.error("Error fetching users:", err);
        navigate("/");
      }
    };
    fetchUsers();

    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/group", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        });
        // console.log(response.data)
        setGroups(response.data.groups ); 
    //  console.log(response.data.groups);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setGroups([]); // Set groups to empty array if an error occurs
      }
    };
    fetchGroups();
  }, [navigate]);

  // Start a chat with a user
  const startChat = async (receiverId, username, image) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/chat/message/read/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        }
      );
      setChats(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("no messages yet...");
        setChats([]); // No messages found
      } else {
        console.error("Error starting chat:", error);
      }
    }
    setChatInitiated(true);
    setReceiverId(receiverId);
    setSelectedUserId(receiverId);
    setSelectedUser({ username, image, _id: receiverId });
  };

  const startGroupChat = async (groupId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/group/${groupId}`
      );
      const groupname=response.data.group.name
      // console.log(response.data)
      setGroupChats(response.data)
      setSelectedGroup({groupname,_id: groupId})

    } catch (error) {
      if (error.response?.status === 404) {
        console.log("no messages yet...");
        setGroupChats([]); // No messages found
      } else {
        console.error("Error starting chat:", error);
      }
    }
    // console.log(groupname,groupId)
    // setGroupInitiated(true);
    setSelectedGroupId(groupId);
    setGroupChatInitiated(true);
  };
  // Handle group creation
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/group/create",
        { name: groupName },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        }
      );
      setGroups((prevGroups) => [...prevGroups, response.data.group]);
      setGroupName(""); // clear the input after creation
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const sendMessage = async (groupId) => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/group/${groupId}/send`,
        { message, senderId: userId }, // Pass the sender's ID
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        }
      );
      console.log("Message sent:", response.data);
      fetchGroupMessages(groupId); // Reload group messages after sending
      setMessage(""); // Clear input field
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const fetchGroupMessages = async (groupId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/group/${groupId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        }
      );
      setChats(response.data.messages); // Update the state with the messages
    } catch (err) {
      console.error("Error fetching group messages:", err);
    }
  };

  return (
    <div className="h-full  rounded-lg flex flex-col  p-2 m-2 ml-1 bg-slate-500  border-gray-800 bg-opacity-20 overflow-y-auto scrollbar-thin scrollbar-border scrollbar-thumb-blue-600 scrollbar-track-transparent justify-between">
      <div>
        <div className="input input-bordered flex  justify-between items-center rounded-3xl p-0">
          <input
            type="text"
            placeholder={`Search`}
            className="ml-2 p-1 rounded-3xl w-3/4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-icon px-4">
            <IoSearch />
          </div>
        </div>

        <div className="bg-slate-500 gap-2 bg-opacity-20 p-2 mt-3 rounded-lg flex justify-evenly text-white">
          <div
            onClick={() => setGroupInitiated(false)}
            className={`hover:bg-slate-300 p-2 ${
              groupInitiated ? "" : "bg-opacity-20 bg-slate-300 rounded-3xl"
            } hover:rounded-3xl hover:cursor-pointer w-10/12 justify-center flex hover:bg-opacity-20`}
          >
            All
          </div>

          <div
            onClick={() => setGroupInitiated(true)}
            className={`hover:bg-slate-300 p-2 ${
              groupInitiated ? "bg-opacity-20 bg-slate-300 rounded-3xl" : ""
            } hover:rounded-3xl hover:cursor-pointer w-10/12 justify-center flex hover:bg-opacity-20`}
          >
            Groups
          </div>
        </div>

        {groupInitiated ? (
          <div>
            <div className="p-2 mt-4">
              <input
                type="text"
                placeholder="Enter Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="p-2 w-full rounded-lg bg-opacity-20 bg-slate-500 text-white border border-gray-700"
              />
              <button
                onClick={handleCreateGroup}
                className="bg-blue-500 text-white p-2 rounded-lg mt-2 w-full"
              >
                Create Group
              </button>
            </div>

            <div className="mt-4">
              {groups && groups.length > 0 ? (
                groups.map((group) => (
                  <div
                    key={group._id}
                    className="bg-slate-300 bg-opacity-20 flex justify-between text-white p-2 items-center rounded-lg mt-2"
                    onClick={() => {
                      startGroupChat(group._id, group.groupName);
                      setReceiverId(group._id);
                      setChats([]); // load group chat messages
                    }}
                  >
                    <div className="font-bold">{group.name}</div>
                    {/* <div className="bg-slate-300 bg-opacity-30 p-2 rounded-full">Add Users</div> */}
                  </div>
                ))
              ) : (
                <div>No groups available</div>
              )}
            </div>
          </div>
        ) : (
          <div className="user-list mt-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`flex text-white items-center justify-between p-2 hover:bg-slate-500 bg-opacity-60 hover:rounded-lg cursor-pointer ${
                  selectedUserId === user._id
                    ? "bg-blue-500 rounded-l text- border-b-0 border-r-4 border-white"
                    : ""
                }`}
                onClick={() => startChat(user._id, user.username, user.image)}
              >
                <div className="flex items-center">
                  <img
                    src={`http://localhost:5000/images/${user.image}`}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-2">
                    <div className="text-l">{user.username}</div>
                    {onlineUsers.includes(user._id) ? (
                      <span className="text-green-500 text-sm">Online</span>
                    ) : (
                      <span className="text-gray-500 text-sm"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
