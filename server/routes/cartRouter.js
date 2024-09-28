const {
  getCart,
  updateQuantity,
  addToCart,
  clearCart,
} = require("../controllers/cartController");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/get", auth, getCart);
router.put("/update/:id", auth, updateQuantity);
router.post("/add", auth, addToCart);
router.delete("/clear", auth, clearCart);
module.exports = router;
