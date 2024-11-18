const {
  getWorkShops,
  getWorkShopById,
  addWorkShop,
  getWorkShopByUserID,
  updateWorkShop,
  deleteWorkShop,
  getWorkshopRegistrations,
} = require("../controllers/workshopController");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");

const router = require("express").Router();

router.get("/get", getWorkShops);

router.get("/get/:id", getWorkShopById);

router.post("/add", auth, upload.single("image"), addWorkShop);

router.get("/get-by-user", auth, getWorkShopByUserID);

router.put("/update/:id", auth, updateWorkShop);

router.delete("/delete/:id", auth, deleteWorkShop);

router.get("/registrations/:id", auth, getWorkshopRegistrations);

module.exports = router;
