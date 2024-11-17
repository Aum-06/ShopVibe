import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB=async()=>{
    try {
       const conn= await mongoose.connect(process.env.MONGO_URI);
       console.log("DB connected");
       
    } catch (error) {
        console.log("DB not connected",error.message);
        process.exit(1);
    }
}