const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const Wishlist = require("../models/Wishlist");

// GET wishlist for current user
router.get("/", protect, async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.userId }).populate(
      "productId"
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TOGGLE wishlist item for current user
router.post("/", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const exists = await Wishlist.findOne({
      user: req.userId,
      productId,
    });

    if (exists) {
      await Wishlist.deleteOne({ _id: exists._id });
      return res.json({ removed: true });
    }

    const item = await Wishlist.create({
      user: req.userId,
      productId,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
