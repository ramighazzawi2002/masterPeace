const {
  createWorkshopRegistration,
  checkIfUserRegistered,
  getWorkShopPregeristration,
} = require("../controllers/workshopregistrationController");
const router = require("express").Router();

const auth = require("../middleware/auth");

router.post("/create", auth, createWorkshopRegistration);

router.post("/check", auth, checkIfUserRegistered);

router.get("/get", auth, getWorkShopPregeristration);

module.exports = router;
