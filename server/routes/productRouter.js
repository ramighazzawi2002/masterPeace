const {
  getAllProducts,
  getProductWithComments,
} = require("../controllers/productController");
const router = require("express").Router();

router.get("/all-products", getAllProducts);
router.get("/get-by-id/:id", getProductWithComments);
module.exports = router;
