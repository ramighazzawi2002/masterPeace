const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const adminRoutes = require("./routes/adminRoutes");
const authController = require("./controllers/authController");

const app = express();
const port = 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Auth routes
app.post("/login", authController.adminLogin);
app.post("/logout", authController.logout);

// Admin routes
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
