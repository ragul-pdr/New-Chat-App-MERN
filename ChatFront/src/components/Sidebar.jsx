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
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle logout
  const handleLogout = () => {
    window.localStorage.removeItem("chat-token");
    window.localStorage.removeItem("userId");
    navigate("/");
  };

  // Fetch all users
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
        // setChats({message:"No Messages yet, Start Your Conversation!"});
      } else {
        console.error("Error starting chat:", error);
      }
    }
    setChatInitiated(true);
    setReceiverId(receiverId);
    setActiveUser(receiverId);
    setSelectedUser({ username, image });
  };

  return (
    <>
      <div className="w-1/4  mt-3 flex flex-col  border-r p-1 border-gray-800 bg-opacity-70  overflow-y-auto  scrollbar-thin scrollbar-border  scrollbar-thumb-blue-600 scrollbar-track-transparent">
        <div>
          <div className="input flex justify-between items-center rounded-3xl">
            <input
              type="text"
              placeholder="Search"
              className=" p-2   w-auto rounded-3xl bg-transparent"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearch className="text-4xl items-center justify-center  rounded-full  flex" />
          </div>{" "}
          <div className="divider"></div>
        </div>

        <div>
          {filteredUsers.length > 0 ? (
            <div>
              {filteredUsers.map((user) => (
                <div>
                  <div
                    key={user._id}
                    onClick={() =>
                      startChat(user._id, user.username, user.image)
                    }
                    className={`flex items-center space-x-4 p-2 hover:bg-blue-500 cursor-pointer rounded-md ${
                      activeUser === user._id ? "bg-gray-500 bg-opacity-10 border-l-4 " : ""
                    }`}
                  >
                    <img
                      src={`http://localhost:5000/images/${user.image}`}
                      className="w-12 h-12 rounded-full border-3"
                      alt={user.username}
                    />
                    <span className="text-white text-sm font-bold">
                      {user.username}
                    </span>
                  </div>
                  <div className="divider p-0 m-0 px-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white font-bold">No Users Found</p>
          )}
        </div>

        <LogoutBTN handleLogout={handleLogout} />
      </div>
    </>
  );
};

export default Sidebar;
