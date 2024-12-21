import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Form from "../components/Form";

const Chat = ({socket}) => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const verifyUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:5000/chat/user/verify"
  //       );
  //       if (response.data.message == "success") {
  //       } else {
  //         navigate("/");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  // }, []);

  const [chatInitiated, setChatInitiated] = useState(false);
  const [chats, setChats] = useState([]);
  const [receiverId,setReceiverId]=useState()
  return (
    <div className="flex  items-center justify-center h-screen ">
      <div
        style={{ backgroundImage: "url('./bgmain.png')" }}
        className="bg-cover w-full h-full flex "
      >
        <Sidebar setChatInitiated={setChatInitiated} setChats={setChats} socket={socket} setReceiverId={setReceiverId}/>
        <div className="w-full bg-white flex flex-col bg-opacity-20 relative">
          {chatInitiated ? (
            <div>
              <p>Chat initiated</p>

              <Form receiverId={receiverId} chats={chats} setChats={setChats}/>
            </div>
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
