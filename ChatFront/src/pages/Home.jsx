import React, { useEffect, useState } from "react";
import Model from "../components/Model";
import Register from "../components/Register";
import Login from "../components/Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const [isModelOpen, setIsModelOpen] = useState(true);
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
          "http://localhost:5000/chat/user/verify",
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(
                "chat-token"
              )}`,
            },
          }
        );
        if (response.data.message === "success") {
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    };
    verifyUser();
  }, [navigate]);

  return (
    <div className="flex rounded-lg items-center justify-center h-screen w-screen">
      <motion.div
        style={{ backgroundImage: "url('../public/bgmain.png')" }}
        className="bg-cover w-full h-full  flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
      >
      </motion.div>

      <div className="flex justify-center">
        <Model isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen}>
          {isLogin ? (
            <Login openSignup={openSignup} />
          ) : (
            <Register openLogin={openLogin} />
          )}
        </Model>
      </div>
    </div>
  );
};

export default Home;
