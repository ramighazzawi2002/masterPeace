const {
  getWorkShops,
  getWorkShopById,
} = require("../controllers/workshopController");

const router = require("express").Router();

router.get("/get", getWorkShops);

router.get("/get/:id", getWorkShopById);

module.exports = router;
