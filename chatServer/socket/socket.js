import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const onlineUsers = {}; // To track online users and their socket IDs

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

export const GetReceiverSocketId = (receiverId) => {
  return onlineUsers[receiverId];
};

const emitOnlineUsers = () => {
  io.emit("updateUserList", Object.keys(onlineUsers));
};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join", (receiverId) => {
    onlineUsers[receiverId] = socket.id;
    console.log(`User ${receiverId} joined with socket ID: ${socket.id}`);

    emitOnlineUsers();
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }

    emitOnlineUsers();
  });
});

export { app, server, io };
