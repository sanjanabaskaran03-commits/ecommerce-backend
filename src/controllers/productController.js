const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
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