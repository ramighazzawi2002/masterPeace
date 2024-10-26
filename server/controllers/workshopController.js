const { Workshop } = require("../models");
const Op = require("sequelize").Op;

const getWorkShops = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  try {
    const { count, rows: workshops } = await Workshop.findAndCountAll({
      where: {
        is_approved: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      },
      limit,
      offset,
      order: [["start_time", "DESC"]],
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
    const image = req.file ? req.file.filename : null;
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
      duration,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      cost,
      location,
      benefits: Array.isArray(benefits) ? benefits.join("،") : benefits,
      max_participants,
      start_date,
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
