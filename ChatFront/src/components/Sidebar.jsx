import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import LogoutBTN from "./LogoutBTN";
import { IoSearch } from "react-icons/io5";

const Sidebar = ({
  setChatInitiated,
  setChats,
  setReceiverId,
  setSelectedUser,
  onlineUsers,
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // search functionality
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );


  

  // get all users
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

  return (
    <div className="h-full  rounded-lg flex flex-col  p-2 m-2 ml-1 bg-slate-500  border-gray-800 bg-opacity-20 overflow-y-auto scrollbar-thin scrollbar-border scrollbar-thumb-blue-600 scrollbar-track-transparent justify-between">
      <div>
        <div className=" input input-bordered flex justify-between items-center rounded-3xl p-0">
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

        <div className="bg-slate-500 bg-opacity-20 p-1 mt-3 rounded-lg flex justify-evenly text-white">
        <div className="hover:bg-slate-300 p-1 underline hover:rounded-3xl hover:cursor-pointer w-1/2 justify-center flex hover:bg-opacity-20">
          All
        </div>
        <div className="hover:bg-slate-300 p-1 hover:rounded-3xl hover:cursor-pointer w-1/2 justify-center flex hover:bg-opacity-20">
          Personal
        </div>
        <div className="hover:bg-slate-300 p-1 hover:rounded-3xl hover:cursor-pointer w-1/2 justify-center flex hover:bg-opacity-20">
          Groups
        </div>
      </div>

        <div className="user-list mt-4">
          {filteredUsers.map((user) => (
            <>
            <div
              key={user._id}
              className={` flex text-white items-center justify-between  p-2   hover:bg-slate-500 bg-opacity-60 hover:rounded-lg cursor-pointer ${
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
              <div className="divider m-0 py-0 px-1"></div>
            </>
          ))}
        </div>
      </div>

      

      
    </div>
  );
};

export default Sidebar;
