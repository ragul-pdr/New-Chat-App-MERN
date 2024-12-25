import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Form from "../components/Form";

import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { extractTime } from "../components/extractTime.js";

const Chat = ({ socket }) => {
  const [chatInitiated, setChatInitiated] = useState(false);
  const [chats, setChats] = useState([]);
  const [receiverId, setReceiverId] = useState();
  const [selectedUser, setSelectedUser] = useState({ username: "", image: "" });

  const userId = window.localStorage.getItem("userId");

  const navigate = useNavigate();
  const chatContainerRef = useRef(null); // Ref for the chat container

  useEffect(() => {
    socket.emit("join", userId);
  }, []);

  useEffect(() => {
    const handleNewMessages = (message) => {
      if (receiverId === message.sender) {
        setChats((state) => [
          ...state,
          { sender: message.sender, content: message.content },
        ]);
      }
    };
    socket.on("newMessage", handleNewMessages);

    return () => {
      socket.off("newMessage", handleNewMessages);
    };
  }, [socket, receiverId]);

  // Scroll to the bottom whenever chats change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div
        style={{ backgroundImage: "url('./bgmain.png')" }}
        className="bg-cover w-full h-full flex"
      >
        <Sidebar
          setChatInitiated={setChatInitiated}
          setChats={setChats}
          setReceiverId={setReceiverId}
          setSelectedUser={setSelectedUser}
        />
        <div className="w-full flex flex-col bg-opacity-20 relative">
          {chatInitiated ? (
            <>
              <div className="h-11 bg-transparent mt-5 flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={`http://localhost:5000/images/${selectedUser.image}`}
                    alt={selectedUser.username}
                    className="w-14 h-14 rounded-full"
                  />
                  <span className="font-bold text-lg text-white">
                    {selectedUser.username}
                  </span>
                </div>
                <div className="flex items-center text-white hover:cursor-pointer">
                  <FaPhoneAlt className="mr-10 text-xl rounded-full  hover:text-gray-400   " />
                  <FaVideo className="mr-10 text-xl   rounded-full hover:text-gray-400   " />
                  <BsThreeDotsVertical className="mr-1 rounded-full text-xl  hover:text-gray-400   " />
                </div>
              </div>
              <div className="divider px-1"></div>
              <div
                className="overflow-y-auto mb-20 scrollbar-thin scrollbar-border  scrollbar-thumb-blue-600 scrollbar-track-transparent"
                ref={chatContainerRef} // Ref applied here
              >
                {chats &&
                  chats.map((chat, index) => {
                    const date = extractTime(chat.createdAt);

                    return (
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
                        <div className="chat-footer  text-xs text-gray-500">
                          <time className="ml-2">{date}</time>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <Form receiverId={receiverId} chats={chats} setChats={setChats} />
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <h2 className="text-4xl py-3 bg-opacity-80 font-bold text-gray-200 rounded-2xl p-5 font-Anek">
                Welcome to Chat App 👋
              </h2>
              <br />
              <h3 className="text-3xl py-3 bg-opacity-80 font-bold text-gray-300 rounded-2xl p-5 font-Anek">
                Select User! Start Your Conversation...
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
