const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        email: "admin@gmail.com",
        password: $2b$10$PA.xLVswKsDXuRE04YeIWe/FJXMLR/PsV0BO8PU4GRvlAEFsrhecS,
        role: "admin",
      });

      console.log("✅ Default Admin Created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("Error creating admin:", err.message);
  }
};

module.exports = createAdmin;