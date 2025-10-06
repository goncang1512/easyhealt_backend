import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // misal: dykunvz4p
  api_key: process.env.CLOUDINARY_API_KEY, // dari dashboard Cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET, // dari dashboard Cloudinary
});

export default cloudinary;
