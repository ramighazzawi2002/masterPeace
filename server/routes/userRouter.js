const {
  sendOtp,
  verifyOtp,
  login,
  loginOrSignupWithGoogle,
  forgetPassword,
  verifyOtpForForgetPssword,
  resetPassword,
  checkIsLoggedIn,
  logout,
  getProfile,
  uploadProfileImage,
  updateProfileData,
} = require("../controllers/userController");
const router = require("express").Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/google", loginOrSignupWithGoogle);
router.post("/forgot-password", forgetPassword);
router.post("/verify-otp-forget-password", verifyOtpForForgetPssword);
router.post("/reset-password", resetPassword);
router.get("/is-logged-in", auth, checkIsLoggedIn);
router.get("/logout", logout);
router.get("/profile", auth, getProfile);
router.post(
  "/upload-profile-image",
  auth,
  upload.single("image"),
  uploadProfileImage
);
router.put("/update-profile-data", auth, updateProfileData);
module.exports = router;
