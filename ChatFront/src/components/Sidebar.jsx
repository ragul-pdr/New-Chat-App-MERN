import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutBTN from "./LogoutBTN";
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
  const [activeUser, setActiveUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // search functionality
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handle logout
  const handleLogout = () => {
    window.localStorage.removeItem("chat-token");
    window.localStorage.removeItem("userId");
    navigate("/");
  };

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
    setActiveUser(receiverId);
    setSelectedUser({ username, image, _id: receiverId });
  };

  return (
    <div className="w-1/4 mt-3 flex flex-col border-r p-1 border-gray-800 bg-opacity-70 overflow-y-auto scrollbar-thin scrollbar-border scrollbar-thumb-blue-600 scrollbar-track-transparent">
      <div>
        <div className="input flex justify-between items-center rounded-3xl">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered bg-gray-100 rounded-3xl w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-icon px-4">
            <IoSearch />
          </div>
        </div>
        <div className="users-list mt-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between py-2 px-3 border-b hover:bg-gray-200 cursor-pointer"
              onClick={() =>
                startChat(user._id, user.username, user.image)
              }
            >
              <div className="flex items-center">
                <img
                  src={`http://localhost:5000/images/${user.image}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-2">
                  <div>{user.username}</div>
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
      </div>
      <LogoutBTN handleLogout={handleLogout} />
    </div>
  );
};

export default Sidebar;
