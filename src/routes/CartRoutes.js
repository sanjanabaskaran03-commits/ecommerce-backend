const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");

// GET CART (current user)
router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.productId"
  );
  if (!cart) return res.json({ items: [], savedItems: [] });

  await cart.populate("savedItems.productId");
  res.json(cart);
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
        savedItems: [],
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
    await populated.populate("savedItems.productId");
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
    if (!cart) return res.json({ items: [], savedItems: [] });

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === String(productId)
    );

    if (index === -1) return res.json(cart);

    cart.items[index].quantity = qty;
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    await populated.populate("savedItems.productId");
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
    if (!cart) return res.json({ items: [], savedItems: [] });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== String(productId)
    );

    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    await populated.populate("savedItems.productId");
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
        savedItems: [],
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
    await populated.populate("savedItems.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SAVE FOR LATER (toggle/move between items and savedItems)
router.post("/save-later", protect, async (req, res) => {
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
        savedItems: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === String(productId)
    );
    const savedIndex = (cart.savedItems || []).findIndex(
      (item) => item.productId.toString() === String(productId)
    );

    // If in cart -> move to saved
    if (itemIndex > -1) {
      const [moved] = cart.items.splice(itemIndex, 1);
      cart.savedItems = cart.savedItems || [];

      if (savedIndex > -1) {
        cart.savedItems[savedIndex].quantity = Math.max(
          1,
          Number(cart.savedItems[savedIndex].quantity || 1) +
            Number(moved.quantity || 1)
        );
      } else {
        cart.savedItems.push({
          productId: moved.productId,
          quantity: Math.max(1, Number(moved.quantity || 1)),
        });
      }
    } else if (savedIndex > -1) {
      // If in saved -> move back to cart
      const [moved] = cart.savedItems.splice(savedIndex, 1);
      const targetIndex = cart.items.findIndex(
        (item) => item.productId.toString() === String(productId)
      );

      if (targetIndex > -1) {
        cart.items[targetIndex].quantity = Math.max(
          1,
          Number(cart.items[targetIndex].quantity || 1) +
            Number(moved.quantity || 1)
        );
      } else {
        cart.items.push({
          productId: moved.productId,
          quantity: Math.max(1, Number(moved.quantity || 1)),
        });
      }
    }

    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    await populated.populate("savedItems.productId");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
