// utils/uploadToCloudinary.js

const cloudinary = require("../services/cloudinary.js");
const streamifier = require("streamifier");

const uploadToCloudinary = async (file, folder = "sports-users") => {
  try {
    // file check
    if (!file) {
      throw new Error("Please select an image");
    }

    // phone se mostly ye formats aate hain
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/heic",
      "image/heif",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error("Only JPG, PNG, HEIC images are allowed");
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size should be less than 5MB");
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
          quality: "auto"
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });

return {
  url: result.secure_url,
  publicId: result.public_id
};

  } catch (error) {
    throw new Error(error.message || "Image upload failed");
  }
};

module.exports = uploadToCloudinary;