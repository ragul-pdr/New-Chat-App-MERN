import axios from "axios";
import React, { useState } from "react";
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
      console.log(response);
      if (response.data.message === "success") {
        window.localStorage.setItem("chat-token", response.data.token);
        window.localStorage.setItem("userId", response.data.user._id);
        navigate("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-w-96  w-screen h-screen flex justify-center flex-col items-center ">
      <div  className="w-1/4  h-[1/2 + 50px]   p-6  rounded-2xl shadow-md bg-blue-600 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-gray-100 ">
        <h2 className="flex text-2xl justify-center items-center text-gray-200">Login</h2>

        <form onSubmit={handleSubmit}
        className=" justify-center flex flex-col  ">
          <div class="mb-5">
            <label
              for="name"
              className="block mb-2 text-sm font-medium text-blue-400"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter you Name"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="password"
              className="block mb-2 text-sm font-medium text-blue-400"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              placeholder="*********"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="flex justify-end text-gray-600 mb-3">
            <a className=" text-white text-sm hover:underline mr-1" href="#">Forgot Password?</a>
          </div>
          <div className="flex justify-center w-full mb-3">
            <button
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </form>

        
        <div className=" justify-center flex items-center mb-4">
        <div className="border-b-2 w-1/4 p-2"></div>
        </div>
        <div className="flex justify-center">
          <span className=" text-gray-200">Don't have an account? </span> &nbsp; 
          <button onClick={openSignup} className="text-gray-100 hover:underline hover:text-blue-400">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
