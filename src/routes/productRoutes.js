const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct
} = require('../controllers/productController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// NEW: upload middleware
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:id', getProductById);

// 🔥 UPDATED ROUTE (NOW WITH IMAGE UPLOAD)
// router.post(
//   '/',
//   protect,
//   isAdmin,
//   upload.single("image"),
//   createProduct
// );
router.post('/', upload.single("image"), createProduct);

module.exports = router;