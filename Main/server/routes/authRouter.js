const { google, googleCallback } = require("../controllers/authController");
const router = require("express").Router();

router.get("/auth/google", google);
router.get("/auth/google/callback", googleCallback);

module.exports = router;
