const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: String,
        title: String,
        price: Number,
        qty: Number,
        discountPercent: Number,
        img: String,
      },
    ],

    address: {
      name: String,
      phone: String,
      house: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
    },

    subtotal: Number,
    discount: Number,
    total: Number,

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);