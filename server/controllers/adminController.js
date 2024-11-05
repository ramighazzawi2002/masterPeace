const {
  Article,
  Workshop,
  Product,
  User,
  Comment,
  sequelize,
  Messages,
} = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const getAdminDashboardData = async (req, res) => {
  try {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(
      currentDate.setMonth(currentDate.getMonth() - 6)
    );

    const websiteStatsData = await User.findAll({
      attributes: [
        [
          sequelize.fn("date_trunc", "month", sequelize.col("createdAt")),
          "month",
        ],
        [sequelize.fn("count", sequelize.col("id")), "visitors"],
      ],
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      group: [sequelize.fn("date_trunc", "month", sequelize.col("createdAt"))],
      order: [
        [
          sequelize.fn("date_trunc", "month", sequelize.col("createdAt")),
          "ASC",
        ],
      ],
    });

    const articlesCount = await Article.count();
    const workshopsCount = await Workshop.count();
    const productsCount = await Product.count();
    const commentsCount = await Comment.count();

    const activitySummaryData = [
      { name: "مقالات", count: articlesCount },
      { name: "ورشات", count: workshopsCount },
      { name: "منتجات", count: productsCount },
      { name: "تعليقات", count: commentsCount },
    ];

    res.json({
      websiteStatsData,
      activitySummaryData,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ message: "Error fetching admin dashboard data" });
  }
};

const getAdminArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      attributes: ["id", "title", "author_id", "createdAt", "image"],
      include: [{ model: User, as: "author", attributes: ["username"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching admin articles:", error);
    res.status(500).json({ message: "Error fetching admin articles" });
  }
};

const getAdminWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.findAll({
      attributes: ["id", "title", "start_time", "max_participants", "image"],
      include: [{ model: User, as: "owner", attributes: ["username"] }],
      order: [["start_time", "DESC"]],
    });
    res.json(workshops);
  } catch (error) {
    console.error("Error fetching admin workshops:", error);
    res.status(500).json({ message: "Error fetching admin workshops" });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "name", "price", "stock", "image"],
      include: [{ model: User, as: "author", attributes: ["username"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching admin products:", error);
    res.status(500).json({ message: "Error fetching admin products" });
  }
};

const addAdminArticle = async (req, res) => {
  try {
    const { title, content, breif } = req.body;
    const author_id = req.user.id; // Assuming you have user information in the request
    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    const article = await Article.create({
      title,
      content,
      breif,
      author_id,
      image,
    });
    res.status(201).json(article);
  } catch (error) {
    console.error("Error adding admin article:", error);
    res.status(500).json({ message: "Error adding admin article" });
  }
};

const addAdminWorkshop = async (req, res) => {
  try {
    const { title, description, start_time, max_participants, owner_id } =
      req.body;
    const workshop = await Workshop.create({
      title,
      description,
      start_time,
      max_participants,
      owner_id,
    });
    res.status(201).json(workshop);
  } catch (error) {
    console.error("Error adding admin workshop:", error);
    res.status(500).json({ message: "Error adding admin workshop" });
  }
};

const addAdminProduct = async (req, res) => {
  try {
    const { name, description, price, stock, author_id } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      author_id,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding admin product:", error);
    res.status(500).json({ message: "Error adding admin product" });
  }
};

const deleteAdminItem = async (req, res) => {
  try {
    const { type, id } = req.params;
    let model;
    switch (type) {
      case "articles":
        model = Article;
        break;
      case "workshops":
        model = Workshop;
        break;
      case "products":
        model = Product;
        break;
      default:
        return res.status(400).json({ message: "Invalid item type" });
    }
    await model.destroy({ where: { id } });
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin item:", error);
    res.status(500).json({ message: "Error deleting admin item" });
  }
};

const editAdminArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, breif } = req.body;
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (req.file) {
      // Delete old image if it exists
      if (article.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          article.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      article.image = req.file.filename;
    }

    article.title = title;
    article.content = content;
    article.breif = breif;

    await article.save();
    res.json(article);
  } catch (error) {
    console.error("Error editing admin article:", error);
    res.status(500).json({ message: "Error editing admin article" });
  }
};

// Add this new function
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "createdAt", "is_admin"],
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ message: "Error fetching admin users" });
  }
};

// Add this new function to get unapproved articles
const getUnapprovedArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { is_approved: false },
      attributes: ["id", "title", "author_id", "createdAt", "image"],
      include: [{ model: User, as: "author", attributes: ["username"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching unapproved articles:", error);
    res.status(500).json({ message: "Error fetching unapproved articles" });
  }
};

// Add this new function to approve or disapprove an article
const approveArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.is_approved = is_approved;
    await article.save();

    res.json({ message: "Article approval status updated successfully" });
  } catch (error) {
    console.error("Error updating article approval status:", error);
    res.status(500).json({ message: "Error updating article approval status" });
  }
};

// Add these new functions at the end of the file

const getUnapprovedWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.findAll({
      where: { is_approved: false },
      attributes: [
        "id",
        "title",
        "owner_id",
        "createdAt",
        "start_time",
        "max_participants",
      ],
      include: [{ model: User, as: "owner", attributes: ["username"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(workshops);
  } catch (error) {
    console.error("Error fetching unapproved workshops:", error);
    res.status(500).json({ message: "Error fetching unapproved workshops" });
  }
};

const approveWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;
    const workshop = await Workshop.findByPk(id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    workshop.is_approved = is_approved;
    await workshop.save();

    res.json({ message: "Workshop approval status updated successfully" });
  } catch (error) {
    console.error("Error updating workshop approval status:", error);
    res
      .status(500)
      .json({ message: "Error updating workshop approval status" });
  }
};

// Add this new function at the end of the file

const getContactMessages = async (req, res) => {
  try {
    const messages = await Messages.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Error fetching contact messages" });
  }
};

const replyContactMessage = async (req, res) => {
  try {
    const { messageId, replyContent } = req.body;

    // Fetch the original message
    const message = await Messages.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: message.email,
      subject: "رد على رسالتك",
      text: replyContent,
    });

    // Update the message to mark it as replied (optional)
    await message.update({ replied: true });

    res.json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ message: "Error sending reply" });
  }
};
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow deactivating admin users
    // if (user.is_admin) {
    //   return res.status(403).json({
    //     message: "Cannot change status of admin users",
    //   });
    // }

    user.is_active = is_active;
    await user.save();

    res.json({
      message: "User status updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
};

// Add this to the module.exports
module.exports = {
  getAdminDashboardData,
  getAdminArticles,
  getAdminWorkshops,
  getAdminProducts,
  addAdminArticle,
  addAdminWorkshop,
  addAdminProduct,
  deleteAdminItem,
  editAdminArticle,
  getAdminUsers,
  getUnapprovedArticles,
  approveArticle,
  getUnapprovedWorkshops,
  approveWorkshop,
  getContactMessages,
  replyContactMessage,
  toggleUserStatus,
};
