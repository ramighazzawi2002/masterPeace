const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const { upload } = require("../middleware/multer");

// Public admin routes (no auth required)
router.post("/login", authController.adminLogin);

// Protected admin routes (require auth)
router.use(auth, adminAuth); // Apply auth middleware to all routes below

router.get("/dashboard", adminController.getAdminDashboardData);
router.get("/articles", adminController.getAdminArticles);
router.get("/workshops", adminController.getAdminWorkshops);
router.get("/products", adminController.getAdminProducts);
router.get("/users", adminController.getAdminUsers);
router.get("/unapproved-articles", adminController.getUnapprovedArticles);
router.get("/unapproved-workshops", adminController.getUnapprovedWorkshops);
router.get("/contact-messages", adminController.getContactMessages);

// Admin management routes
router.post("/create", authController.createAdmin);
router.post(
  "/articles",
  upload.single("image"),
  adminController.addAdminArticle
);
router.post(
  "/workshops",
  upload.single("image"),
  adminController.addAdminWorkshop
);
router.post(
  "/products",
  upload.single("image"),
  adminController.addAdminProduct
);
router.put(
  "/articles/:id",
  upload.single("image"),
  adminController.editAdminArticle
);
router.put(
  "/products/:id",
  upload.single("image"),
  adminController.editAdminProduct
);
router.put("/approve-article/:id", adminController.approveArticle);
router.put("/approve-workshop/:id", adminController.approveWorkshop);
router.put("/users/:id/toggle-status", adminController.toggleUserStatus);
router.delete("/:type/:id", adminController.deleteAdminItem);
router.put(
  "/workshops/:id",
  upload.single("image"),
  adminController.editAdminWorkshop
);
router.post("/reply-contact-message", adminController.replyContactMessage);
module.exports = router;
