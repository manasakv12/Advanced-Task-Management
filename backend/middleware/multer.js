const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "task-files", // Cloudinary folder name
    format: async (req, file) => "pdf", // Supports images, pdf, etc.
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage });

module.exports = upload;
