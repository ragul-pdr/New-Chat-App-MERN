import UserModel from "../models/User.js";

const users = async (req, res) => {
  try {
    const loginUser = req.user._id;
    const allUsers = await UserModel.find({ _id: { $ne: loginUser } }).select(
      "-password"
    );
    return res.status(200).json({ message: "success", users: allUsers });
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(500).json({ message: error });
  }
};

export default users;
