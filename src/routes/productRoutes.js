const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct
} = require('../controllers/productController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);

// 🔥 Protect this route
router.post('/', protect, isAdmin, createProduct);

module.exports = router;