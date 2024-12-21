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
     const response= await axios.post("http://localhost:5000/chat/user/register",formData);
     console.log(response)
     if(response.data.message === "success"){
      openLogin()
     }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h2 className="flex justify-center">Sign Up</h2>

      <form onSubmit={handleSubmit} class="max-w-sm mx-auto">
        <div class="mb-5">
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Username
          </label>
          <input
            type="text"
            id="name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter you Name"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 "
          >
            Your Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="*********"
            onChange={(e) => setPassword(e.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900 ">
            Upload Image
          </label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className="flex justify-center w-full mb-3">
          <button
            type="submit"
            class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign Up
          </button>
        </div>
      </form>
      <div className="flex justify-center">
        <span>Already have an account? </span>
        <button onClick={openLogin}> &nbsp;Login</button>
      </div>
    </div>
  );
};

export default Register;
