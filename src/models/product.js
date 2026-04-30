const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String,

    image: String,
    img: String,
    sectionTags: [String],
    discountPercent: Number,

    specifications: {
      type: Map,
      of: String,
    },

    stock: {
      type: Number,
      default: 0,
    },

    dealStart: Date,
    dealEnd: Date,

    // ⭐ NEW: REVIEWS SYSTEM
    reviews: [
      {
        user: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);