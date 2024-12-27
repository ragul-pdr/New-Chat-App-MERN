import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const Register = ({ openLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);

  const validateForm = () => {
    if (!username || !password || !file) {
      toast.error("All fields are required!");
      return false;
    }
    if (username.length < 5) {
      toast.error("Username must be at least 5 characters.");
      return false;
    }
    if (password.length < 5) {
      toast.error("Password must be at least 5 characters.");
      return false;
    }
    if (!file.type.startsWith("image")) {
      toast.error("Please upload a valid image file.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/chat/user/register",
        formData
      );
      if (response.data.message === "success") {
        setUsername("");
        setPassword("");
        setFile(null);
        toast.success("Account created successfully! Login Here!");
        openLogin();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div
    className="min-w-96 w-screen bg-fixed h-screen  flex-col  bg-cover flex items-center justify-center"
        style={{ backgroundImage: "url('./bgmain.png')" }}
     
    >
      <motion.div className="w-1/4 p-6 rounded-2xl shadow-md bg-blue-600 bg-opacity-0 border border-gray-500"
       initial={{ x: "100vw" }}
       animate={{ x: 0 }}
       exit={{ x: "-100vw" }}
       transition={{ type: "spring", stiffness: 80 }}
      >
         <div className="justify-center items-center flex">
          <img src="./chat.png" alt="Logo" className="h-14 w-14 " />
        </div>
        <h2 className="flex text-2xl justify-center items-center text-gray-200">
          Sign Up
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
              value={username}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-blue-400">
              Upload Image
            </label>
            <input
              type="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:hover:cursor-pointer file:text-blue-700 hover:file:bg-blue-200"
              // className="file-input bg-white file-input- block w-full text-sm text-gray-500"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="flex justify-center w-full mb-3">
            <button
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          <span className="text-gray-200">Already have an account?</span> &nbsp;
          <button
            onClick={openLogin}
            className="text-gray-100 hover:underline hover:text-blue-400"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
