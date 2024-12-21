import React, { useEffect, useState } from "react";
import Model from "../components/Model";
import Register from "../components/Register";
import Login from "../components/Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const openSignup = () => {
    setIsModelOpen(true);
    setIsLogin(false);
  };
  const openLogin = () => {
    setIsModelOpen(true);
    setIsLogin(true);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/chat/user/verify",{
            headers:{
              'Authorization':`Bearer ${window.localStorage.getItem('chat-token')}`,
            }
          }
        );
        console.log(response)
        if (response.data.message === "success") {
          navigate('/chat')
        } 
      } catch (error) {
        console.log(error);
      }
    };
    verifyUser()
  }, []);

  return (
    <div className="flex rounded-lg items-center justify-center h-screen ">
      <div
        style={{ backgroundImage: "url('./bgmain.png')" }}
        className="bg-cover w-full h-full rounded-lg flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-6xl py-3  bg-indigo-300 bg-opacity-80 font-bold text-gray-900 rounded-2xl p-5 font-Anek">
            Welcome
          </h2>
          <button
            className="p-3 hover:bg-indigo-600 rounded-lg mt-2 bg-indigo-400 text-white text-3xl"
            onClick={() => setIsModelOpen(true)}
          >
            Login / Register
          </button>
        </div>
      </div>
      <Model isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen}>
        {isLogin ? (
          <Login openSignup={openSignup} />
        ) : (
          <Register openLogin={openLogin} />
        )}
      </Model>
    </div>
  );
};

export default Home;
