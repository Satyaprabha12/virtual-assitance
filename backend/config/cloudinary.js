import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = (fileBuffer, folder = "your_app_name") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
            console.error("Cloudinary Stream Upload Error:", error);
          reject(error);
        } else {
             resolve(result);
        }
      }
    );
 streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default uploadOnCloudinary;
