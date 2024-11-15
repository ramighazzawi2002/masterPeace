const {
  Article,
  Workshop,
  Product,
  User,
  Comment,
  sequelize,
  Messages,
  OrderItem,
  WorkshopRegistration,
} = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Create transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const getAdminDashboardData = async (req, res) => {
  try {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(
      currentDate.setMonth(currentDate.getMonth() - 6)
    );

    // Get total users and calculate growth
    const totalUsers = await User.count();
    const lastMonthUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });

    // Get activities counts and calculate growth
    const totalActivities = await Promise.all([
      Article.count(),
      Workshop.count(),
      Product.count(),
    ]);
    const totalActivitiesCount = totalActivities.reduce((a, b) => a + b, 0);

    const lastMonthActivities = await Promise.all([
      Article.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),
      Workshop.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),
      Product.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),
    ]);
    const lastMonthActivitiesCount = lastMonthActivities.reduce(
      (a, b) => a + b,
      0
    );

    // Calculate growth percentages
    const userGrowth = ((lastMonthUsers / totalUsers) * 100).toFixed(1);
    const activitiesGrowth = (
      (lastMonthActivitiesCount / totalActivitiesCount) *
      100
    ).toFixed(1);

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

    const [articlesCount, workshopsCount, productsCount, commentsCount] =
      await Promise.all([
        Article.count(),
        Workshop.count(),
        Product.count(),
        Comment.count(),
      ]);

    const activitySummaryData = [
      { name: "مقالات", count: articlesCount },
      { name: "ورشات", count: workshopsCount },
      { name: "منتجات", count: productsCount },
      { name: "تعليقات", count: commentsCount },
    ];

    // Get total orders amount and workshop registrations amount
    const totalOrdersAmount = (await OrderItem.sum("amount_paid")) || 0;
    const totalWorkshopRegistrationsAmount =
      (await WorkshopRegistration.sum("amount_paid")) || 0;

    // Calculate last month's amounts for growth calculation
    const lastMonthOrdersAmount =
      (await OrderItem.sum("amount_paid", {
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      })) || 0;

    const lastMonthWorkshopAmount =
      (await WorkshopRegistration.sum("amount_paid", {
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      })) || 0;

    // Calculate growth percentages for amounts
    const totalAmount = totalOrdersAmount + totalWorkshopRegistrationsAmount;
    const lastMonthTotal = lastMonthOrdersAmount + lastMonthWorkshopAmount;
    const amountGrowth =
      totalAmount > 0 ? ((lastMonthTotal / totalAmount) * 100).toFixed(1) : "0";

    // Update stats object
    const stats = {
      totalUsers,
      pageViews: commentsCount * 3,
      newActivities: totalActivitiesCount,
      totalAmount: totalAmount.toFixed(2),
      userGrowth: `+${userGrowth}%`,
      pageViewsGrowth: "+2.7%",
      activitiesGrowth: `+${activitiesGrowth}%`,
      amountGrowth: `+${amountGrowth}%`,
    };

    res.json({
      websiteStatsData: websiteStatsData.map(stat => ({
        name: new Date(stat.month).toLocaleDateString("ar-EG", {
          month: "long",
        }),
        visitors: parseInt(stat.visitors),
        pageViews: parseInt(stat.visitors) * 3,
      })),
      activitySummaryData,
      stats,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ message: "Error fetching admin dashboard data" });
  }
};

const getAdminArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      attributes: [
        "id",
        "title",
        "author_id",
        "createdAt",
        "image",
        "content",
        "breif",
      ],
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
      attributes: ["id", "name", "price", "stock", "image", "description"],
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
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { title, content, breif } = req.body;
    const author_id = req.user.id; // Make sure this is coming from your auth middleware
    let image = null;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    image = req.file.filename;

    // Validate required fields
    if (!title || !content || !breif) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const article = await Article.create({
      title,
      content,
      breif,
      author_id,
      image,
      is_approved: true, // Since it's added by admin, we can auto-approve it
    });

    // Include author information in the response
    const articleWithAuthor = await Article.findOne({
      where: { id: article.id },
      include: [{ model: User, as: "author", attributes: ["username"] }],
    });

    res.status(201).json(articleWithAuthor);
  } catch (error) {
    console.error("Error adding admin article:", error);
    res.status(500).json({
      message: "Error adding admin article",
      error: error.message,
    });
  }
};

const addAdminWorkshop = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const {
      title,
      description,
      start_time,
      end_time,
      date,
      max_participants,
      cost,
      location,
      topics_covered,
      requirements,
      benefits,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !start_time ||
      !end_time ||
      !date ||
      !max_participants
    ) {
      console.log("Missing required fields:", {
        title,
        description,
        start_time,
        end_time,
        date,
        max_participants,
      });
      return res.status(400).json({
        message: "All required fields must be provided",
        missing: {
          title: !title,
          description: !description,
          start_time: !start_time,
          end_time: !end_time,
          date: !date,
          max_participants: !max_participants,
        },
      });
    }

    // Create workshop with the admin user as author
    const workshop = await Workshop.create({
      title,
      description,
      start_time,
      end_time,
      date,
      max_participants: parseInt(max_participants),
      cost: parseFloat(cost) || 0,
      location: location || "",
      topics_covered: topics_covered || "",
      requirements: requirements || "",
      benefits: benefits || "",
      owner_id: req.user.id,
      is_approved: true,
      image: req.file ? req.file.filename : null,
    });

    // Get the created workshop with author information
    const workshopWithAuthor = await Workshop.findByPk(workshop.id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(201).json(workshopWithAuthor);
  } catch (error) {
    console.error("Error adding admin workshop:", error);
    res.status(500).json({
      message: "Error adding admin workshop",
      error: error.message,
    });
  }
};

const addAdminProduct = async (req, res) => {
  try {
    // Get the data from the form
    const { name, description, price, stock } = req.body;
    console.log("req.body: ", req.body);

    // Ensure the user is authenticated and has an ID
    const author_id = req.user ? req.user.id : null;

    // Create the product with the form data
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price), // Convert price to float
      stock: parseInt(stock), // Convert stock to integer
      image: req.file ? req.file.filename : null, // Handle the uploaded image
      author_id, // Set the author_id
      is_approved: true, // Automatically approve products added by admin
    });

    // Return the created product
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding admin product:", error);
    res.status(500).json({
      message: "Error adding admin product",
      error: error.message,
    });
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
      attributes: [
        "id",
        "username",
        "email",
        "createdAt",
        "is_admin",
        "is_active",
      ],
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

    const article = await Article.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (is_approved === false) {
      // Delete the article - fixed the destroy call
      await article.destroy();
    } else {
      article.is_approved = is_approved;
      await article.save();
    }

    // Send email notification to article author
    const mailOptions = {
      from: process.env.EMAIL,
      to: article.author.email,
      subject: is_approved ? "تم اعتماد مقالتك" : "تم رفض مقالتك",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>مرحباً ${article.author.username}،</h2>
          <p>${
            is_approved
              ? `نود إعلامك بأنه تم اعتماد مقالتك "${article.title}". يمكن الآن للمستخدمين رؤية مقالتك وقراءتها.`
              : `نود إعلامك بأنه تم رفض مقالتك "${article.title}". يرجى التواصل مع إدارة الموقع لمزيد من المعلومات.`
          }</p>
          <p>مع تحيات،<br>فريق التراث الأردني</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Article approval status updated successfully",
      article,
    });
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
        "date",
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

    const workshop = await Workshop.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (is_approved === false) {
      await workshop.destroy();
    } else {
      workshop.is_approved = is_approved;
      await workshop.save();
    }

    // Send email notification to workshop owner
    const mailOptions = {
      from: process.env.EMAIL,
      to: workshop.owner.email,
      subject: is_approved ? "تم اعتماد ورشتك" : "تم رفض ورشتك",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>مرحباً ${workshop.owner.username}،</h2>
          <p>${
            is_approved
              ? `نود إعلامك بأنه تم اعتماد ورشتك "${workshop.title}". يمكن الآن للمستخدمين رؤية ورشتك والتسجيل فيها.`
              : `نود إعلامك بأنه تم رفض ورشتك "${workshop.title}". يرجى التواصل مع إدارة الموقع لمزيد من المعلومات.`
          }</p>
          <p>مع تحيات،<br>فريق التراث الأردني</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Workshop approval status updated successfully",
      workshop,
    });
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
      where: { replied: false },
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

    user.is_active = is_active;
    await user.save();

    // Send email notification to user
    console.log(user.email, process.env.EMAIL);
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: is_active ? "تم تفعيل حسابك" : "تم تعطيل حسابك",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>مرحباً ${user.username}،</h2>
          <p>${
            is_active
              ? "نود إعلامك بأنه تم تفعيل حسابك في موقع التراث الأردني. يمكنك الآن تسجيل الدخول واستخدام جميع ميزات الموقع."
              : "نود إعلامك بأنه تم تعطيل حسابك في موقع التراث الأردني. يرجى التواصل مع إدارة الموقع لمزيد من المعلومات."
          }</p>
          <p>مع تحيات،<br>فريق التراث الأردني</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

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

const editAdminWorkshop = async (req, res) => {
  console.log("Edit Admin Workshop: ", req.body);
  try {
    const { id } = req.params;
    const {
      title,
      description,
      start_time,
      end_time,
      date,
      max_participants,
      cost,
      location,
      topics_covered,
      requirements,
      benefits,
    } = req.body;

    const workshop = await Workshop.findByPk(id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Handle image update if new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (workshop.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads",
          workshop.image
        );
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      workshop.image = req.file.filename;
    }

    // Update workshop fields
    workshop.title = title;
    workshop.description = description;
    workshop.start_time = start_time;
    workshop.end_time = end_time;
    workshop.date = date;
    workshop.max_participants = max_participants;
    workshop.cost = cost || 0;
    workshop.location = location;
    workshop.topics_covered = topics_covered;
    workshop.requirements = requirements;
    workshop.benefits = benefits;

    await workshop.save();

    // Get the updated workshop with author information
    const workshopWithAuthor = await Workshop.findByPk(workshop.id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.json(workshopWithAuthor);
  } catch (error) {
    console.error("Error editing admin workshop:", error);
    res.status(500).json({
      message: "Error editing admin workshop",
      error: error.message,
    });
  }
};

const editAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      // Delete old image if it exists
      if (product.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          product.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.image = req.file.filename;
    }

    product.name = name;
    product.description = description;
    product.price = parseFloat(price);
    product.stock = parseInt(stock);

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error editing admin product:", error);
    res.status(500).json({ message: "Error editing admin product" });
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
  editAdminWorkshop,
  editAdminProduct,
};
