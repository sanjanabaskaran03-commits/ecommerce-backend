const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, async (req, res) => {
  try {
    const { items } = req.body;
    const user = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ================= CALCULATE =================
    const subtotal = items.reduce((acc, item) => {
      return acc + (item.price || 0) * (item.qty || 1);
    }, 0);

    const discount = items.reduce((acc, item) => {
      const percent = item.discountPercent || 0;
      return acc + ((item.price * percent) / 100) * (item.qty || 1);
    }, 0);
    router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

    const total = Math.max(0, subtotal - discount);

    // ================= CREATE ORDER =================
    const order = await Order.create({
      userId: user._id,
      items,
      address: user.address, // ✅ from DB
      subtotal,
      discount,
      total,
    });

    res.json({
      orderId: order._id,
      amount: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;