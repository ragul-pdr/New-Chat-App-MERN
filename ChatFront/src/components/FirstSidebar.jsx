import React, { useEffect } from "react";
import LogoutBTN from "./LogoutBTN";
import { GoHome } from "react-icons/go";
import { BsChat } from "react-icons/bs";
import { CiDroplet } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


const userId = window.localStorage.getItem("userId");

const FirstSidebar = ({socket,setOnlineUsers}) => {
  const navigate = useNavigate();

  // handle logout
  const handleLogout = () => {
    window.localStorage.removeItem("chat-token");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("Loginusername");
    navigate("/");
   useEffect(()=>{
    return () => {
      socket.off("updateUserList");
    };
   },[socket,userId])
  };
  return (
    <div className="flex flex-col   bg-transparent ml-3 rounded-lg bg-opacity-20 m-2 justify-between">
      <div className="">
        <img
          src="../public/chat.png"
          className="mt-5  h-14 w-14 bg-opacity-20"
          alt="Logo"
        />
      </div>
      <div className=" bg-slate-500 rounded-lg h-1/2 justify-evenly text-2xl items-center bg-opacity-20 flex flex-col">
        <GoHome className="hover:bg-slate-500 hover:bg-opacity-30 h-10 py-2 hover:cursor-pointer w-10  rounded-full" />
        <BsChat className="hover:bg-slate-500 hover:bg-opacity-30 h-10 py-2 hover:cursor-pointer w-10  rounded-full" />
        <CiDroplet className="hover:bg-slate-500 hover:bg-opacity-30 h-10 py-2 hover:cursor-pointer w-10  rounded-full" />
        <IoIosSearch className="hover:bg-slate-500 hover:bg-opacity-30 h-10 py-2 hover:cursor-pointer w-10  rounded-full" />
        <FaPlus className="hover:bg-slate-500 hover:bg-opacity-30 h-10 py-2 hover:cursor-pointer w-10  rounded-full" />
      </div>
      <div className="m-1 p-1">
        <LogoutBTN
          className=" bg-blue-500 text-white items-center hover:cursor-pointer hover:bg-red-500 rounded-full  flex justify-center"
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default FirstSidebar;
