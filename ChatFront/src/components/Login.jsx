import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = ({ openSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/chat/user/login",
        { username, password }
      );
      if (response.data.message === "success") {
        window.localStorage.setItem("chat-token", response.data.token);
        window.localStorage.setItem("userId", response.data.user._id);
        window.localStorage.setItem(
          "Loginusername",
          response.data.user.username
        );
        window.localStorage.setItem(
          "Loginuserimage",
          response.data.user.userImage
        );
        navigate("/chat");
        setUsername("");
        setPassword("");
      }
    } catch {
      toast.error("Invalid User Credentials!");
    }
  };

  return (
    <div
      className="min-w-96 w-screen bg-fixed h-screen  flex-col  bg-cover flex items-center justify-center"
      style={{ backgroundImage: "url('./bgmain.png')" }}
    >
      <motion.div
        className="w-1/4 p-6 rounded-2xl shadow-md bg-blue-600 bg-opacity-0 border border-gray-500"
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        exit={{ x: "100vw" }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <div className="justify-center items-center flex">
          <img src="./chat.png" alt="Logo" className="h-14 w-14 " />
        </div>
        <h2 className="flex text-2xl justify-center items-center text-blue-500">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-blue-400"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-blue-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="*********"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center w-full mb-3">
            <button
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          <span className="text-gray-200">Don't have an account?</span> &nbsp;
          <button
            onClick={openSignup}
            className="text-gray-100 hover:underline hover:text-blue-400"
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
