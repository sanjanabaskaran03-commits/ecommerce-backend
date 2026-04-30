const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");

// GET CART (current user)
router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.productId"
  );
  res.json(cart || { items: [] });
});

// ADD TO CART (increments if exists)
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Math.max(1, Number(quantity || 1));

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === String(productId)
    );

    if (index > -1) {
      cart.items[index].quantity = Math.max(
        1,
        Number(cart.items[index].quantity || 1) + qty
      );
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE QUANTITY
router.patch("/quantity", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Math.max(1, Number(quantity || 1));

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ items: [] });

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === String(productId)
    );

    if (index === -1) return res.json(cart);

    cart.items[index].quantity = qty;
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REMOVE FROM CART
router.post("/remove", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== String(productId)
    );

    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TOGGLE CART (compat with existing frontend)
router.post("/toggle", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === String(productId)
    );

    if (index > -1) {
      cart.items.splice(index, 1);
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

