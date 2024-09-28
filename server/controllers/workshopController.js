const { Workshop } = require("../models");

const getWorkShops = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const workShopCount = await Workshop.count();
    const WorkShop = await Workshop.findAll({ limit, offset: skip });
    console.log(WorkShop);
    res.json({
      data: WorkShop,
      totalArticles: workShopCount,
      page: page,
      limit: limit,
      totalPages: Math.ceil(workShopCount / limit),
    });
  } catch (error) {
    console.error("Error fetching Workshop:", error);
    res.status(500).json({ message: "Error fetching Workshop" });
  }
};

const getWorkShopById = async (req, res) => {
  try {
    const workShop = await Workshop.findByPk(req.params.id);
    if (!workShop) {
      return res.status(404).json({ message: "WorkShop not found" });
    }
    res.json(workShop);
  } catch (error) {
    console.error("Error fetching Workshop:", error);
    res.status(500).json({ message: "Error fetching Workshop" });
  }
};

module.exports = { getWorkShops, getWorkShopById };
