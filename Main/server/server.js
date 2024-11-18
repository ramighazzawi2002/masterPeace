const article = require("./routes/articleRouter");
const message = require("./routes/messageRouter");
const workShop = require("./routes/workshopRouter");
const workshopregistration = require("./routes/workshopregistrationRouter");
const user = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const orderItemRouter = require("./routes/orderItemRouter");
const homeRoutes = require("./routes/homeRoutes");
const chatRouter = require("./routes/chatRouter");

const cors = require("cors");
const express = require("express");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const cookieParser = require("cookie-parser");
const helmet = require("helmet");

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

// Add security headers
app.use(helmet());

// Configure specific security headers
app.use(
  helmet({
    // تكوين سياسة أمان المحتوى (Content Security Policy)
    // هذا يحدد من أين يمكن تحميل الموارد المختلفة مثل الصور والنصوص البرمجية وغيرها
    contentSecurityPolicy: {
      directives: {
        // defaultSrc: يحدد السياسة الافتراضية لجميع أنواع الموارد
        // 'self' يعني فقط من نفس المصدر (نفس الدومين)
        defaultSrc: ["'self'"],

        // connectSrc: يحدد المواقع التي يمكن الاتصال بها عبر Ajax أو WebSocket
        // هنا نسمح بالاتصال مع الخادم المحلي على المنفذ 5000
        connectSrc: ["'self'", "http://localhost:5000"],

        // imgSrc: يحدد من أين يمكن تحميل الصور
        // data: للصور المشفرة base64
        // https: يسمح بتحميل الصور من أي موقع آمن
        imgSrc: ["'self'", "data:", "http://localhost:5000", "https:"],

        // scriptSrc: يحدد من أين يمكن تحميل وتنفيذ JavaScript
        // unsafe-inline: يسمح بكتابة JavaScript مباشرة في HTML
        // unsafe-eval: يسمح باستخدام eval() وما شابه
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],

        // styleSrc: يحدد من أين يمكن تحميل ملفات CSS
        // unsafe-inline: يسمح بكتابة CSS مباشرة في HTML
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },

    // تعطيل سياسة تضمين الموارد عبر النطاقات المختلفة
    // هذا مفيد عندما تحتاج لتضمين محتوى من مواقع خارجية
    crossOriginEmbedderPolicy: false,

    // السماح بالوصول للموارد من نطاقات مختلفة
    // cross-origin يسمح لأي موقع خارجي بالوصول إلى موارد الخادم
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/home", homeRoutes);

// Chat Router
app.use("/api", chatRouter);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
