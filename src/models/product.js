const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  isRecommended: Boolean,
  image: { type: String },
  sectionTags: [{ type: String }],
  discountPercent: { type: Number },
  rating: {
    rate: Number,
    count: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);