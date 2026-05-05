const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// ==========================
// GET ADDRESS
// ==========================
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.json(user.address || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

// ==========================
// UPDATE ADDRESS
// ==========================
router.put("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.address = req.body;

    await user.save();

    res.json({ success: true, address: user.address });
  } catch (err) {
    res.status(500).json({ error: "Failed to update address" });
  }
});

module.exports = router;