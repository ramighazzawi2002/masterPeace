const {
  getArticles,
  getArticleWithComments,
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/articleController");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/get", getArticles);
router.get("/get-with-comments/:id", getArticleWithComments);
router.post("/add-comment", auth, addComment);
router.put("/edit-comment/:id", editComment);
router.put("/delete-comment/:id", deleteComment);

module.exports = router;
