const Product = require('../models/product');

// GET ALL PRODUCTS
exports.getProducts = (req, res) => {
  const { category } = req.query;
  let filter = {};

  if (category) {
    filter.category = new RegExp(`^${category.replace(/-/g, ' ')}`, 'i');
  }

  Product.find(filter)
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error fetching products",
        error: error.message
      });
    });
};


// GET PRODUCT BY ID
exports.getProductById = (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};


// 🔥 CREATE PRODUCT (UPDATED FOR IMAGE UPLOAD)
exports.createProduct = (req, res) => {
  const {
    title,
    price,
    category,
    description,
    isRecommended,
    discountPercent,
    rating,
    sectionTags
  } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  Product.create({
    title,
    price,
    category,
    description,
    isRecommended,
    discountPercent,

    // convert JSON strings (from FormData)
    rating: rating ? JSON.parse(rating) : undefined,
    sectionTags: sectionTags ? JSON.parse(sectionTags) : [],

    // 🔥 image from multer upload
    image: req.file ? `/uploads/${req.file.filename}` : "",
  })
    .then((product) => {
      res.status(201).json(product);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};