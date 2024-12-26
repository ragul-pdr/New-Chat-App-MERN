import React from "react";
import { BiLogOut } from "react-icons/bi";

const LogoutBTN = ({ handleLogout }) => {
  return (
    <div
      onClick={handleLogout}
      className="p-3 text-white hover:text-white hover:cursor-pointer hover:bg-slate-500 hover:bg-opacity-20  rounded-full"
    >
      <BiLogOut className="text-2xl flex justify-center items-center" />
    </div>
  );
};

export default LogoutBTN;
