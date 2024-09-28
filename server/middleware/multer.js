const multer = require("multer");
const path = require("path");

// Configuration
const MAX_FILE_SIZE = 5000000; // 1MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const UPLOAD_DIR = "uploads/";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    const error = new Error(
      "Invalid file type. Allowed types are: " + ALLOWED_FILE_TYPES.join(", ")
    );
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }
  cb(null, true);
};

// Multer middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

module.exports = { upload };
