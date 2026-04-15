const Product = require('../models/product');

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
exports.createProduct = (req, res) => {
  const data = req.body;

  if (Array.isArray(data)) {
    Product.insertMany(data)
      .then((products) => {
        res.status(201).json(products);
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } else {
    Product.create(data)
      .then((product) => {
        res.status(201).json(product);
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  }
};