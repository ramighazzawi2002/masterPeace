const { Workshop } = require("../models");
const Op = require("sequelize").Op;
const { WorkshopRegistration } = require("../models");
const { User } = require("../models");

const getWorkShops = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;
  const currentDate = new Date().toISOString().split("T")[0];

  try {
    const { count, rows: workshops } = await Workshop.findAndCountAll({
      where: {
        is_approved: true,
        date: {
          [Op.gte]: currentDate,
        },
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      },
      limit,
      offset,
      order: [
        ["date", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    res.json({
      data: workshops,
      totalWorkshops: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching workshops:", error);
    res.status(500).json({ message: "Error fetching workshops" });
  }
};

const getWorkShopById = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const workShop = await Workshop.findOne({
      where: {
        id: req.params.id,
        date: {
          [Op.gte]: currentDate,
        },
      },
    });

    if (!workShop) {
      return res
        .status(404)
        .json({ message: "Workshop not found or has ended" });
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
    const image = req.file ? req.file.filename : null;
    console.log("req.body", req.body);
    const {
      title,
      description,
      topics_covered,
      requirements,
      start_time,
      end_time,
      cost,
      location,
      benefits,
      max_participants,
      start_date,
    } = req.body;
    console.log("req.body", req.body);
    // Validate and format time inputs
    const formatTime = time => {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
    };

    const formattedStartTime = formatTime(start_time);
    const formattedEndTime = formatTime(end_time);
    console.log("formattedStartTime", formattedStartTime);
    console.log("formattedEndTime", formattedEndTime);
    console.log("Received workshop data:", req.body);
    console.log("File:", req.file);

    const workShop = await Workshop.create({
      owner_id,
      image,
      title,
      description,
      topics_covered: Array.isArray(topics_covered)
        ? topics_covered.join("،")
        : topics_covered,
      requirements: Array.isArray(requirements)
        ? requirements.join(",")
        : requirements,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      date: start_date,
      cost,
      location,
      benefits: Array.isArray(benefits) ? benefits.join("،") : benefits,
      max_participants,
    });

    console.log("Created workshop:", workShop);
    res.json(workShop);
  } catch (error) {
    console.error("Error adding Workshop:", error);
    res
      .status(500)
      .json({ message: "Error adding Workshop", error: error.message });
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
      start_time,
      end_time,
      cost,
      location,
      benefits,
      max_participants,
      date,
    } = req.body;
    console.log(typeof topics_covered);
    const workShop = await Workshop.update(
      {
        title,
        description,
        topics_covered: topics_covered,
        requirements: requirements,
        start_time,
        end_time,
        date,
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

const deleteWorkShop = async (req, res) => {
  try {
    await Workshop.destroy({ where: { id: req.params.id } });
    res.json({ message: "Workshop deleted successfully" });
  } catch (error) {
    console.error("Error deleting Workshop:", error);
    res.status(500).json({ message: "Error deleting Workshop" });
  }
};

const getWorkshopRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    const registrations = await WorkshopRegistration.findAll({
      where: { workshop_id: id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching workshop registrations:", error);
    res.status(500).json({
      message: "Error fetching workshop registrations",
      error: error.message,
    });
  }
};

module.exports = {
  getWorkShops,
  getWorkShopById,
  addWorkShop,
  getWorkShopByUserID,
  updateWorkShop,
  deleteWorkShop,
  getWorkshopRegistrations,
};
