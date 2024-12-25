import axios from "axios";
import React, { useState } from "react";

import { IoSend } from "react-icons/io5";


const Form = ({ receiverId, setChats, chats }) => {
  const [message, setMessage] = useState("");
  const userId = window.localStorage.getItem("userId");


  const sendMessage = async (e) => {

    e.preventDefault();
    if(message.trim() === "") return ;

    try {
      const response = await axios.post(
        "http://localhost:5000/chat/message/send/" + receiverId,{ content: message},  {
            headers: {
              "Authorization": `Bearer ${window.localStorage.getItem(
                "chat-token"
              )}`,
            },
          }
      );
      // console.log(response,"response")
      setChats([...chats, {...response.data, content: message, sender: userId }]);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-1 pl-3 pr-3 absolute bottom-0 right-0 left-0   bg-opacity-50 ">
      <form onSubmit={sendMessage} className="flex justify-center items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type Your message..."
          className=" input w-full p-4 mr-3 rounded-full bg-blue-400 bg-opacity-40 "
        />
        <input type="file" className="hidden" id="dile-upload" />
        <button
          type="submit"
          className="bg-blue-500 p-2 text-white rounded-full flex items-center justify-center"
        >
          <IoSend className="text-3xl p-1" />

        </button>
      </form>
    </div>
  );
};

export default Form;


