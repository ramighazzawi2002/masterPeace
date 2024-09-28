const { addOrderItem } = require("../controllers/orderItemController");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, addOrderItem);

module.exports = router;
