const { Messages } = require("../models");

const addMessage = async (req, res) => {
  try {
    const message = await Messages.create(req.body);
    res.json(message);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Error adding message" });
  }
};

module.exports = { addMessage };
