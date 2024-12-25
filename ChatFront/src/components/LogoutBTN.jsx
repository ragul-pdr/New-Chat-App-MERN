import React from "react";
import { BiLogOut } from "react-icons/bi";

const LogoutBTN = ({ handleLogout }) => {
  return (
    <div onClick={handleLogout}
           className="h-10 bg-blue-500 text-white items-center hover:text-white hover:cursor-pointer hover:bg-red-500 rounded-lg flex justify-center"
    
    >
   Logout&nbsp;<BiLogOut className=" bottom-3   text-3xl  " />
    </div>
  );
};

export default LogoutBTN;
