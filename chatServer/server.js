import express from "express";
import cors from "cors";
import Connect from "./db/connection.js";
import AuthRouter from './routes/auth.js';
import UserRouter from './routes/user.js';
import MessageRouter from './routes/message.js';
import groupRoutes from './routes/group.js'

import { app, server } from './socket/socket.js';

app.use(cors());
app.use(express.json());

app.use('/images', express.static('public/images')); 

app.use('/chat/users', UserRouter);
app.use('/chat/message', MessageRouter);
app.use("/chat/group", groupRoutes); // Mount the group routes
app.use("/group", groupRoutes); // Mount the group routes

app.use('/chat/user', AuthRouter);

server.listen(process.env.PORT, async () => {
  await Connect();
  console.log("Server is running on port 5000");
});
