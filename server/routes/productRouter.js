const {
  getAllProducts,
  getProductWithComments,
  uploadProductImage,
} = require("../controllers/productController");
const { upload } = require("../middleware/multer");
const router = require("express").Router();

router.get("/all-products", getAllProducts);
router.get("/get-by-id/:id", getProductWithComments);
router.post("/upload-image/:id", upload.single("image"), uploadProductImage);
module.exports = router;
