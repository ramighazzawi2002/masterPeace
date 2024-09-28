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
} = require("../controllers/userController");
const router = require("express").Router();
const auth = require("../middleware/auth");
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/google", loginOrSignupWithGoogle);
router.post("/forgot-password", forgetPassword);
router.post("/verify-otp-forget-password", verifyOtpForForgetPssword);
router.post("/reset-password", resetPassword);
router.get("/is-logged-in", auth, checkIsLoggedIn);
router.get("/logout", logout);
module.exports = router;
