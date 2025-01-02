import express from "express";
import Group from "../models/Group.js";
import Message from "../models/Messages.js";
import { io } from "../socket/socket.js";
import UserModel from "../models/User.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { name, members } = req.body; 
    // Assuming `members` is an array of user IDs
    const group = new Group({ name, members });
    await group.save();
   return  res.status(201).json({ message: "Group created successfully", group });
  } catch (err) {
    res.status(400).json({ message: "Error creating group", error: err });
  }
});

router.get("/group/:groupId/members", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("members");
    res.json({ members: group.members });
  } catch (error) {
    res.status(500).json({ message: "Error fetching group members" });
  }
});

// Add user to a group
router.post("/:groupId/add", async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);
    console.log(group); // Log the group to ensure it's found
    if (!group) return res.status(404).json({ message: "Group not found" });
    
    group.members.push(userId);
    await group.save();

    io.to(group._id).emit("newGroupMember", { message: "New member added", userId });
    res.status(200).json({ message: "User added to group", group });
  } catch (err) {
    res.status(400).json({ message: "Error adding user", error: err });
  }
});




router.get('/:groupId/members', async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId).populate('members');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ members: group.members }); // This should return populated user data
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Fetch group details
router.get("/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("members");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json({group});
  } catch (err) {
    res.status(400).json({ message: "Error fetching group", error: err });
  }
});

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({success: true, groups});
    console.log(groups)
  } catch (err) {
    res.status(400).json({ message: "Error fetching groups", error: err });
  }
});

// Send message to a group
router.post("/message/:groupId/send", async (req, res) => {
  try {
    const { content, senderId } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Create a new message
    const newMessage = {
      content: content,
      sender: senderId,
      group: group._id,
      createdAt: new Date(),
    };

    // Save the message to the group
    group.messages.push(newMessage);
    await group.save();

    // Emit the message to all members of the group
    io.to(group._id).emit("newGroupMessage", newMessage); // Broadcast message to the group

    res.status(200).json({ message: "Message sent successfully", newMessage });
  } catch (err) {
    res.status(400).json({ message: "Error sending message", error: err?.message });
  }
});



// Get messages from a group
router.get("/:groupId/messages", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const messages = await Message.find({ groupId: group._id })
      .populate("sender", "username") 
      .sort({ timestamp: 1 });  

    res.status(200).json({ messages });
  } catch (err) {
    res.status(400).json({ message: "Error fetching messages", error: err });
  }
});

export default router;
