const {
  getCart,
  updateQuantity,
  addToCart,
  clearCart,
  removeItem,
} = require("../controllers/cartController");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/get", auth, getCart);
router.put("/update/:id", auth, updateQuantity);
router.post("/add", auth, addToCart);
router.delete("/clear", auth, clearCart);
router.delete("/remove/:id", auth, removeItem);
module.exports = router;
