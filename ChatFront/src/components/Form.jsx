import axios from "axios";
import React, { useState } from "react";
import { IoSend } from "react-icons/io5";

const Form = ({
  receiverId,
  setChats,
  chats,
  groupChats,
  setGroupChats,
  selectedGroupId,
}) => {
  const [message, setMessage] = useState("");
  const userId = window.localStorage.getItem("userId");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      let response;
      if (selectedGroupId) {
        response = await axios.post(
          `http://localhost:5000/group/message/${selectedGroupId}/send`,
          { content: message, senderId: userId },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(
                "chat-token"
              )}`,
            },
          }
        );
        setGroupChats([...groupChats, response.data.newMessage]);
      } else {
        response = await axios.post(
          `http://localhost:5000/chat/message/send/${receiverId}`,
          { content: message },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(
                "chat-token"
              )}`,
            },
          }
        );
        setChats([
          ...chats,
          { ...response.data, content: message, sender: userId },
        ]);
      }

      setMessage(""); // Clear the message input
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-1 mx-3 my-1 absolute bottom-0 right-0 left-0 bg-opacity-50">
      <form onSubmit={sendMessage} className="flex justify-center items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type Your message..."
          className="input w-full p-4 mr-3 rounded-full bg-blue-400 bg-opacity-20"
        />
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
