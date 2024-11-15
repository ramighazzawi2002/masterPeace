const {
  addOrderItem,
  getOrderItems,
} = require("../controllers/orderItemController");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, addOrderItem);
router.get("/get", auth, getOrderItems);

module.exports = router;
