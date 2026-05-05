const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies); // 👈 ADD HERE

    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    console.log("Token:", token); // 👈 also helpful

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (err) {
    console.log("Auth error:", err.message); // 👈 debug
    return res.status(401).json({ message: "Invalid token" });
  }
};
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};