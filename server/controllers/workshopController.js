const { Workshop } = require("../models");

const getWorkShops = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const workShopCount = await Workshop.count({
      where: { is_approved: true },
    });
    const WorkShop = await Workshop.findAll({
      where: { is_approved: true },
      limit,
      offset: skip,
    });
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

const addWorkShop = async (req, res) => {
  try {
    const owner_id = req.user;
    const image = req.file.filename;
    const {
      title,
      description,
      topics_covered,
      requirements,
      duration,
      start_time,
      end_time,
      cost,
      location,
      benefits,
      max_participants,
    } = req.body;
    const workShop = await Workshop.create({
      owner_id,
      image,
      title,
      description,
      topics_covered: topics_covered.join("،"),
      requirements: requirements.join(","),
      duration,
      start_time,
      end_time,
      cost,
      location,
      benefits: benefits.join("،"),
      max_participants,
    });
    res.json(workShop);
  } catch (error) {
    console.error("Error adding Workshop:", error);
    res.status(500).json({ message: "Error adding Workshop" });
  }
};

const getWorkShopByUserID = async (req, res) => {
  try {
    const owner_id = req.user;
    const WorkShop = await Workshop.findAll({
      where: { owner_id },
    });
    res.json(WorkShop);
  } catch (error) {
    console.error("Error fetching Workshop:", error);
    res.status(500).json({ message: "Error fetching Workshop" });
  }
};

const updateWorkShop = async (req, res) => {
  try {
    const {
      title,
      description,
      topics_covered,
      requirements,
      duration,
      start_time,
      end_time,
      cost,
      location,
      benefits,
      max_participants,
    } = req.body;
    console.log(typeof topics_covered);
    const workShop = await Workshop.update(
      {
        title,
        description,
        topics_covered: topics_covered,
        requirements: requirements,
        duration,
        start_time,
        end_time,
        cost,
        location,
        benefits: benefits,
        max_participants,
        is_approved: false,
      },
      { where: { id: req.params.id } }
    );
    res.json(workShop);
  } catch (error) {
    console.error("Error updating Workshop:", error);
    res.status(500).json({ message: "Error updating Workshop" });
  }
};

module.exports = {
  getWorkShops,
  getWorkShopById,
  addWorkShop,
  getWorkShopByUserID,
  updateWorkShop,
};
