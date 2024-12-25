import React, { useState } from "react";
import axios from "axios";

const Register = ({ openLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/chat/user/register",
        formData
      );
      console.log(response);
      if (response.data.message === "success") {
        openLogin();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-w-96  w-screen h-screen flex justify-center flex-col items-center ">
      <div className="w-1/4  h-[1/2 + 50px]   p-6  rounded-2xl shadow-md bg-blue-600 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-gray-100 ">
        <h2 className="flex text-2xl justify-center items-center text-gray-200">
          Sign Up
        </h2>

        <form
          onSubmit={handleSubmit}
          className=" justify-center flex flex-col  "
        >
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
              Your Password
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
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-blue-400">
              Upload Image
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:hover:cursor-pointer file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          <div className="flex justify-center w-full mb-3">
            <button
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className=" justify-center flex items-center mb-4">
          <div className="border-b-2 w-1/4 p-2"></div>
        </div>
        <div className="flex justify-center">
          <span className=" text-gray-200">Already have an account? </span>{" "}
          &nbsp;
          <button
            onClick={openLogin}
            className="text-gray-100 hover:underline hover:text-blue-400"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
