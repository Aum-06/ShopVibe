import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Cloudinary configuration missing. Check your .env file.");
  process.exit(1); // Exit process to prevent the app from starting
}

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    debug: true,
  });
  console.log("Cloudinary configured successfully:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? "********" : "MISSING",
  });
} catch (error) {
  console.error("Error configuring Cloudinary:", error.message);
  process.exit(1); // Exit process if configuration fails
}
console.log("Cloudinary Configuration:", cloudinary.config());


export default cloudinary;
