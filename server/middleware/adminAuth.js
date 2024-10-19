const { User } = require("../models");

const adminAuth = async (req, res, next) => {
  // try {
  const user = await User.findByPk(req.user);
  console.log(user);
  if (user && user.is_admin === true) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin rights required." });
  }
  // } catch (error) {
  //   res.status(401).json({ message: "Please authenticate." });
  // }
};

module.exports = adminAuth;
