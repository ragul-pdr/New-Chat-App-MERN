import multer from "multer";
import UserModel from "../models/User.js";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage: storage,
});
async function register(req, res) {
  try {
    const { username, password } = req.body;
    const file = req.file.filename;

    const userExist = await UserModel.findOne({ username });

    if (userExist) {
      return res.status(400).json({ message: "User already existed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      image: file,
    });

    await newUser.save();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" + error });
  }
}

async function login(req, res) {
  console.log(req.body.username);
  try {
    const { username, password } = req.body;

    const userExist = await UserModel.findOne({ username });

    if (!userExist) {
      return res.status(400).json({ message: "User Not existed" });
    }

    const matchPassword = await bcrypt.compare(password, userExist.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Password not match." });
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWTKEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .json({
        message: "success",
        token,
        user: { _id: userExist._id, username: userExist.username },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" + error });
  }
}


const verify=(req,res)=>{
  return res.status(200).json({message:"success"})
}


// export default Register;
export { login, register, verify };

// 1:9
