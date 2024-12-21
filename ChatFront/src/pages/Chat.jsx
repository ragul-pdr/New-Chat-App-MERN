import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Form from "../components/Form";

const Chat = ({ socket }) => {
  const [chatInitiated, setChatInitiated] = useState(false);
  const [chats, setChats] = useState([]);
  const [receiverId, setReceiverId] = useState();
  const userId = window.localStorage.getItem("userId");
  const navigate = useNavigate();

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

  return (
    <div className="flex  items-center justify-center h-screen ">
      <div
        style={{ backgroundImage: "url('./bgmain.png')" }}
        className="bg-cover w-full h-full flex "
      >
        <Sidebar
          setChatInitiated={setChatInitiated}
          setChats={setChats}
          setReceiverId={setReceiverId}
        />
        <div className="w-full bg-white flex flex-col bg-opacity-20 relative">
          {chatInitiated ? (
            <>
              <div className="overflow-y-auto mb-20">
                {chats &&
                  chats.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex px-4 ${
                        chat.sender === userId ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-2 my-2 rounded ${
                          chat.sender === userId
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {chat.content}
                      </div>
                    </div>
                  ))}
              </div>
              <Form receiverId={receiverId} chats={chats} setChats={setChats} />
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <h2 className="text-3xl py-3  bg-indigo-300 bg-opacity-80 font-bold text-gray-900 rounded-2xl p-5 font-Anek">
                Welcome
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
