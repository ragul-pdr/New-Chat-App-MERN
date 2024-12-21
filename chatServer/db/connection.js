import mongoose from "mongoose";

const Connect = async () => {
  try {
    const uri = process.env.MONGODB_URL; 
   
    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default Connect;
