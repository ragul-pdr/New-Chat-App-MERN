import express from "express";

import verifyUser from "../middleware/verifyUser.js";

import Conversation from "../models/Conversation.js";

import Message from "../models/Messages.js";
import { GetReceiverSocketId,io } from "../socket/socket.js";


const  router = express.Router();


router.get("/read/:id", verifyUser, async (req, res) => {
  try {
    const {id  } = req.params;
    const senderId  = req.user._id;

    console.log(req.params)
    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, id],
      },
    });
    if (!conversation) {
      return res.status(404).json({ message: "Not Found" });
    }

    const messages = await Message.find({
      ConversationId: conversation._id,
    }).sort({
      createdAt: 1,
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

router.post("/send/:receiverId", verifyUser, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId  = req.user._id;
    const { content } = req.body;
    console.log(receiverId,senderId,req.params)
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }

    const newMessage = new Message({
      
      ConversationId: conversation._id,
      sender: senderId,
      content: content,
      createdAt: new Date(),
    });

    await newMessage.save();

    const receiverSocketId= GetReceiverSocketId(receiverId);

    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage',newMessage)
    }

    return res.json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
    
  }
});

export default router;
