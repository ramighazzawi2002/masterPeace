const { Product, User, Comment } = require("../models");
const jwt = require("jsonwebtoken");

const getAllProducts = async (req, res) => {
  console.log("Get all products");
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const productsCount = await Product.count();
  const products = await Product.findAll({ limit, offset: skip });
  console.log(products);
  res.json({
    data: products,
    totalArticles: productsCount,
    page: page,
    limit: limit,
    totalPages: Math.ceil(productsCount / limit),
  });
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
        attributes: ["id", "username"],
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
