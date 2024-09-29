const { where } = require("sequelize");
const { Article, Comment, User } = require("../models");
const jwt = require("jsonwebtoken");
const getArticles = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const articlesCount = await Article.count({ where: { is_approved: true } });
    const articles = await Article.findAll({
      where: { is_approved: true },
      limit,
      offset: skip,
    });
    res.json({
      data: articles,
      totalArticles: articlesCount,
      page: page,
      limit: limit,
      totalPages: Math.ceil(articlesCount / limit),
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles" });
  }
};

const getArticleWithComments = async (req, res) => {
  try {
    const token = req.cookies?.token;
    let user_id = null;
    if (token) {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      user_id = verified.userId;
    }
    const articles = await Article.findOne({
      where: { id: req.params.id },
      attributes: ["id", "title", "content", "author_id"],
      include: {
        model: Comment,
        where: {
          commentable_type: "ARTICLE",
          commentable_id: req.params.id,
          isDeleted: false,
        },
        attributes: ["id", "content", "rating"],
        required: false,
        include: {
          model: User,
          attributes: ["id", "username", "image"],
        },
      },
    });
    const users = await User.findOne({ where: { id: articles.author_id } });
    articles.dataValues.author = users.username;
    articles.dataValues.user_id = user_id;
    articles.dataValues.image = users.image;
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles" });
  }
};

const addComment = async (req, res) => {
  try {
    const user_id = req.user;
    const { content, rating, commentable_id, commentable_type } = req.body;
    const comment = await Comment.create({
      content,
      rating,
      user_id,
      commentable_id,
      commentable_type,
    });
    res.json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
};

const editComment = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const comment = await Comment.update(
      { content, rating },
      { where: { id: req.params.id } }
    );
    res.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.update(
      { isDeleted: true },
      { where: { id: req.params.id } }
    );
    res.json(comment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

const addArticle = async (req, res) => {
  try {
    const author_id = req.user;
    const { title, content, breif } = req.body;
    const image = req.file.filename;
    const article = await Article.create({
      title,
      content,
      breif,
      image,
      author_id,
    });
    res.json(article);
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).json({ message: "Error adding article" });
  }
};

const getArticleByUserID = async (req, res) => {
  try {
    const author_id = req.user;
    const articles = await Article.findAll({
      where: { author_id },
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles" });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id, title, content, breif } = req.body;

    const article = await Article.update(
      { title, content, breif, is_approved: false },
      { where: { id } }
    );
    res.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Error updating article" });
  }
};

module.exports = {
  getArticles,
  getArticleWithComments,
  addComment,
  editComment,
  deleteComment,
  addArticle,
  getArticleByUserID,
  updateArticle,
};
