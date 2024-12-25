import React from "react";
import { BiLogOut } from "react-icons/bi";

const LogoutBTN = ({ handleLogout }) => {
  return (
    <div onClick={handleLogout}>
      <BiLogOut className=" w-7 h-7 fixed bottom-3   text-3xl hover:text-blue-400 " />
    </div>
  );
};

export default LogoutBTN;
