import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  profilePic: {
    type: String,
    default: "Profile Pic url...",
  },
});

// module.exports = mongoose.model("Group", groupSchema);
const Group = mongoose.model("Group", groupSchema);
export default Group;
