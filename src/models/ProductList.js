const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  description: { type: String, required: true },
  img: { type: String, required: true },
  category: { type: String, required: true },
  sectionTags: { type: [String], default: [] } 
}, { timestamps: true });

module.exports = mongoose.models.ProductList || mongoose.model('ProductList', productSchema);