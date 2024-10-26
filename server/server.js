const article = require("./routes/articleRouter");
const message = require("./routes/messageRouter");
const workShop = require("./routes/workshopRouter");
// const payment = require("./controllers/paymentController");
const workshopregistration = require("./routes/workshopregistrationRouter");
const user = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const orderItemRouter = require("./routes/orderItemRouter");
const cors = require("cors");
const express = require("express");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const cookieParser = require("cookie-parser");

const app = express();
const port = 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Article Router
app.use("/article", article);

// Message Router
app.use("/message", message);

// WorkShop Router
app.use("/workshop", workShop);

// Workshop Registration Router
app.use("/workshopregistration", workshopregistration);

// User Router
app.use("/user", user);

// Auth Router
app.use("/", authRouter);

// Product Router
app.use("/product", productRouter);

// Cart Router
app.use("/cart", cartRouter);

// Order Item Router
app.use("/orderitem", orderItemRouter);

// Payment Router
// app.use("/payment", payment);

const adminRouter = require("./routes/adminRouter");

// Admin Router
app.use("/admin", adminRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/translate", async (req, res) => {
  try {
    const { text, from = "ar", to = "en" } = req.body;

    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `${from}|${to}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Translation error:", error.message);
    res.status(500).json({
      error: "Translation failed",
      details: error.message,
    });
  }
});

const homeRoutes = require("./routes/homeRoutes");

app.use("/api/home", homeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
