const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the upload directories exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // ✅ Create directory if it doesn't exist
  }
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    if (file.fieldname === "projectImage") {
      uploadPath = "uploads/projects/images/";
    } else if (file.fieldname === "projectVideo") {
      uploadPath = "uploads/projects/videos/";
    } else {
      return cb(new Error("Invalid file fieldname"), false);
    }

    ensureDirExists(uploadPath); // ✅ Ensure directory exists
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// ✅ File Filter - Only Allow Images & Videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/mov", "video/mkv"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed!"), false);
  }
};

// ✅ File Size Limit (1GB)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB = 1024MB
  },
});

module.exports = upload;
