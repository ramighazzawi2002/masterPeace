const { addMessage } = require("../controllers/messageController");
const express = require("express");
const router = express.Router();

router.post("/add", addMessage);

module.exports = router;
