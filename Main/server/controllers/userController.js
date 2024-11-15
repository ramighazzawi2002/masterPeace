const { User } = require("../models");
const nodemailer = require("nodemailer");
const Redis = require("ioredis");
const redis = new Redis(); // Assumes Redis is running on default port locally
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res
        .status(400)
        .json({ message: "البريد الإلكتروني مستخدم بالفعل" });
    }
    const otp = generateOtp();
    // Store OTP in Redis with 1 minutes expiration
    await redis.set(`otp:${email}`, otp, "EX", 60);

    // Generate OTP and send it to the user
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email, // Send to the provided email
      subject: "رمز التحقق",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error", error);
        res.status(500).json({ error });
      } else {
        res.json({ message: "تم إرسال رمز التحقق بنجاح" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;
    // Get OTP from Redis
    console.log("Email:", email);
    const storedOtp = await redis.get(`otp:${email}`);
    console.log("Stored OTP:", storedOtp);
    console.log("Entered OTP:", otp);
    if (!storedOtp || storedOtp !== otp.toString()) {
      return res.status(400).json({ message: "رمز التحقق غير صالح" });
    }

    // OTP is valid, delete it from Redis
    await redis.del(`otp:${email}`);
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Here you would typically create the user or perform the next step in your flow
    const user = await User.create({
      username,
      email,
      password_hash,
    });
    console.log(user);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("Token:", token);
    res.header("Access-Control-Allow-Credentials", "true");
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      samesite: "none",
    });
    console.log("Response Headers:", res.getHeaders());

    res.json({ message: "تم التحقق من الرمز بنجاح" });

    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, auth_type: "local" } });
    if (!user) {
      return res.status(400).json({ message: "البريد الإلكتروني غير مسجل" });
    }
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
    }
    console.log("User ID:", user.id);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.header("Access-Control-Allow-Credentials", "true");
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      samesite: "none",
    });
    res.json({ message: "تم تسجيل الدخول بنجاح" });
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const loginOrSignupWithGoogle = async (profile, res) => {
  console.log(profile);
  try {
    let user = await User.findOne({ where: { email: profile.email } });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await User.create({
        username: profile.name,
        email: profile.email,
        auth_type: "google",
        image: profile.picture,
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("Token:", token);
    console.log("user.id", user.id);
    res.header("Access-Control-Allow-Credentials", "true");
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // Set to `true` in production if using HTTPS
      sameSite: "Lax", // Ensures cookies are sent only with same-site requests
    });
    return { message: "تم تسجيل الدخول بنجاح" };
  } catch (err) {
    console.error(err);
    throw new Error("حدث خطأ أثناء تسجيل الدخول بواسطة Google");
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email, auth_type: "local" } });
    if (!user) {
      return res.status(400).json({ message: "البريد الإلكتروني غير مسجل" });
    }
    const otp = generateOtp();
    await redis.set(`otp:${email}`, otp, "EX", 60);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email, // Send to the provided email
      subject: "رمز التحقق",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.json({ message: "تم إرسال رمز التحقق بنجاح" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const verifyOtpForForgetPssword = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp.toString()) {
      return res.status(400).json({ message: "رمز التحقق غير صالح" });
    }
    await redis.del(`otp:${email}`);
    res.json({ message: "تم التحقق من الرمز بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    await User.update(
      { password_hash },
      { where: { email, auth_type: "local" } }
    );
    res.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const checkIsLoggedIn = async (req, res) => {
  try {
    res.json({ isLoggedIn: true });
  } catch (err) {
    console.log(err);
    res.json({ isLoggedIn: false });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "تم تسجيل الخروج بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user);
    console.log("user: ", user);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findByPk(req.user);
    user.image = req.file.filename;
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

const updateProfileData = async (req, res) => {
  try {
    const { username, currentPassword, newPassword, image } = req.body;
    const user = await User.findByPk(req.user);
    if (username) {
      user.username = username;
    }
    if (image) {
      user.image = image;
    }
    if (currentPassword && newPassword) {
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );
      if (!validPassword) {
        return res.status(400).json({ message: "كلمة المرور غير صحيحة" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(newPassword, salt);
    }
    await user.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "حدث خطأ ما" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  login,
  loginOrSignupWithGoogle,
  forgetPassword,
  verifyOtpForForgetPssword,
  resetPassword,
  checkIsLoggedIn,
  logout,
  getProfile,
  uploadProfileImage,
  updateProfileData,
};
