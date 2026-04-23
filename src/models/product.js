const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String,

    image: String,

    sectionTags: [String],
    discountPercent: Number,

    // ✅ Specifications (for 2nd image UI)
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);