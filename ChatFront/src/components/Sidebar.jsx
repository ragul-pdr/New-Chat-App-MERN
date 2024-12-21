import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setChatInitiated, setChats, setReceiverId }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const handleLogout=()=>{
    window.localStorage.removeItem("chat-token")
    window.localStorage.removeItem("userId")
    navigate('/')
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await axios.get("http://localhost:5000/chat/users", {
          headers: {
            "Authorization": `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        });
        setUsers(users.data.users);
      } catch (err) {
        navigate("/");
        console.log(err);
      }
    };
    fetchUsers();
  }, []);


  const startChat = async (id) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/chat/message/read/",+id,  // Correct URL format
        {   
          headers: {
            "Authorization": `Bearer ${window.localStorage.getItem(
              "chat-token"
            )}`,
          },
        }
      );
      setChats(response.data);
    } catch (error) {
      if (error.response.data.message === "Not Found") {
        setChats([]);
      }
      console.log(error);
    }
    setChatInitiated(true);
    setReceiverId(id);
  };
  
  return (
    <div className="w-1/6 bg-blue-900 p-4 bg-opacity-70 relative">
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 mb-4 border rounded"
      />
      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => startChat(user._id)}
              className="flex items-center space-x-4 p-2  hover:bg-gray-300 cursor-pointer"
            >
              <img src={`http://localhost:5000/images/${user.image}`} className="w-10 h-10 rounded-full border" alt="" />
              <span className="text-white text-sm font-bold">
                {user.username}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-white font-bold">No Users</p>
        </div>
      )}
      <button 
      onClick={handleLogout}
      className="fixed bottom-1 right-1 left-1 rounded hover:bg-blue-700 bg-blue-500 text-white p-2 absolute">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
