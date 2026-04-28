// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../services/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "sports-users",
//     allowed_formats: ["jpg", "png", "jpeg"]
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;  

// old code ----------------------------------------

// new code -------------------------------------------------------------

const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;