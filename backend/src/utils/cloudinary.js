import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Streams Multer's in-memory file directly to Cloudinary without writing it to disk.
export const uploadOnCloudinary = async (fileBuffer) => {
  if (!fileBuffer) return null;

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, response) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          resolve(null);
          return;
        }

        resolve(response);
      }
    );

    uploadStream.end(fileBuffer);
  });
};
