const { WorkshopRegistration } = require("../models");

const createWorkshopRegistration = async (req, res) => {
  try {
    const user_id = req.user;
    const workshopregistration = await WorkshopRegistration.create({
      ...req.body,
      user_id,
    });
    res.status(200).json(workshopregistration);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating workshop registration", error });
  }
};

const checkIfUserRegistered = async (req, res) => {
  try {
    const user_id = req.user;
    const { workshop_id } = req.body;
    const workshopRegistration = await WorkshopRegistration.findOne({
      where: {
        workshop_id,
        user_id,
      },
    });
    if (workshopRegistration) res.status(200).json({ userRegistered: true });
    else res.status(200).json({ userRegistered: false });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error checking if user registered", error });
  }
};

module.exports = {
  createWorkshopRegistration,
  checkIfUserRegistered,
};
