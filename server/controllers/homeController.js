const { Article, Workshop, Product } = require("../models");

exports.getHomePageData = async (req, res) => {
  // try {
  const featuredWorkshops = await Workshop.findAll({
    limit: 3,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "title", "description", "image"],
  });

  const featuredProducts = await Product.findAll({
    limit: 3,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "description", "image", "price"],
  });

  const featuredArticles = await Article.findAll({
    limit: 3,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "title", "breif", "image"],
  });

  res.json({
    featuredWorkshops,
    featuredProducts,
    featuredArticles,
  });
  // } catch (error) {
  //   console.error("Error fetching home page data:", error);
  //   res.status(500).json({ message: "Error fetching home page data" });
  // }
};
