const {
  createWorkshopRegistration,
  checkIfUserRegistered,
} = require("../controllers/workshopregistrationController");
const router = require("express").Router();

const auth = require("../middleware/auth");

router.post("/create", auth, createWorkshopRegistration);

router.post("/check", auth, checkIfUserRegistered);

module.exports = router;
