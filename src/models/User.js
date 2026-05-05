  const mongoose = require("mongoose");

  const addressSchema = new mongoose.Schema({
    name: String,
    phone: String,
    house: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
  });

  const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },

      // ✅ NEW FIELD
      address: addressSchema,
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("User", userSchema);