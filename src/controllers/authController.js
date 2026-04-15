const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
 const { name, email, password } = req.body;
  console.log("Signup data:", email, password);

  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      return bcrypt.hash(password, 10)
        .then(hash => {
          return User.create({
            name,
            email,
            password: hash,
            role: "user"
          });
        });
    })
    .then(() => {
      res.status(201).json({ message: "Signup successful" });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};


exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email, password); 

  User.findOne({ email })
    .then(user => {
      console.log("User from DB:", user); 

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          console.log("Password match:", isMatch); // 🔥

          if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
          }
const token = jwt.sign(
  { 
    id: user._id,
    name: user.name,   // ✅ ADD THIS
    role: user.role,
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
          });

          res.json({
            message: "Login success",
            role: user.role
          });
        });
    })
    .catch(err => {
      console.error("Login error:", err);
      res.status(500).json({ message: err.message });
    });
};


// 🔹 LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};