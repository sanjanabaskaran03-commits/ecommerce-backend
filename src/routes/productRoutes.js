const express = require("express");
const router = express.Router();

const controller = require("../controllers/productController");

// GET
router.get("/", controller.getProducts);
router.get("/:id", controller.getProductById);

// POST
router.post("/", controller.createProduct);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;