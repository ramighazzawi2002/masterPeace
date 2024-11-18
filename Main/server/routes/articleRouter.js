const {
  getArticles,
  getArticleWithComments,
  addComment,
  editComment,
  deleteComment,
  addArticle,
  getArticleByUserID,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");

router.get("/get", getArticles);
router.get("/get-with-comments/:id", getArticleWithComments);
router.post("/add-comment", auth, addComment);
router.put("/edit-comment/:id", editComment);
router.put("/delete-comment/:id", deleteComment);
router.post("/add-article", auth, upload.single("image"), addArticle);
router.get("/get-by-user", auth, getArticleByUserID);
router.put("/update", updateArticle);
router.delete("/delete/:id", auth, deleteArticle);

module.exports = router;
