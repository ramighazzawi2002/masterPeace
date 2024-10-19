const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get(
  "/dashboard",
  auth,
  adminAuth,
  adminController.getAdminDashboardData
);
router.get("/articles", auth, adminAuth, adminController.getAdminArticles);
router.get("/workshops", auth, adminAuth, adminController.getAdminWorkshops);
router.get("/products", auth, adminAuth, adminController.getAdminProducts);
router.get("/users", auth, adminAuth, adminController.getAdminUsers);

// New routes
router.post(
  "/articles",
  auth,
  adminAuth,
  upload.single("image"),
  adminController.addAdminArticle
);
router.post("/workshops", auth, adminAuth, adminController.addAdminWorkshop);
router.post("/products", auth, adminAuth, adminController.addAdminProduct);
router.delete("/:type/:id", auth, adminAuth, adminController.deleteAdminItem);
router.put(
  "/articles/:id",
  auth,
  adminAuth,
  upload.single("image"),
  adminController.editAdminArticle
);

module.exports = router;
