import React from "react";

const ProfileBar = () => {
  const userImage = window.localStorage.getItem("Loginuserimage");
  const username = window.localStorage.getItem("Loginusername");

  return (
    <div className="flex bg-slate-500 h-15 bg-opacity-20 m-2 ml-1 rounded-lg p-4">
      <div>
        <img
          src={`http://localhost:5000/images/${userImage}`} 
          alt={username || "User Image"} 
          className="w-14 h-14 rounded-full hover:cursor-pointer hover:bg-blue-500 hover:p-1 hover:bg-opcaity-50 "
        />
      </div>
      <div className="flex flex-col ml-2">
        <p>{`${username} (Me)` || "loading..."}</p>
        <p className="text-lime-500 font-semibold">Available </p>
      </div>
    </div>
  );
};

export default ProfileBar;
