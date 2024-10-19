const { Product, User, Comment } = require("../models");
const jwt = require("jsonwebtoken");
const Op = require("sequelize").Op;

const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  try {
    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: products,
      totalProducts: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

const getProductWithComments = async (req, res) => {
  const token = req.cookies?.token;
  let user_id = null;
  if (token) {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    user_id = verified.userId;
  }
  const products = await Product.findOne({
    where: { id: req.params.id },
    include: {
      model: Comment,
      where: {
        commentable_type: "PRODUCT",
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
  const users = await User.findOne({ where: { id: products.author_id } });
  products.dataValues.author = users.username;
  products.dataValues.user_id = user_id;
  res.json(products);
};

const uploadProductImage = async (req, res) => {
  const product = await Product.findOne({ where: { id: req.params.id } });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Please upload a file" });
  }
  product.image = file.filename;
  await product.save();
  res.json(product);
};

module.exports = { getAllProducts, getProductWithComments, uploadProductImage };
