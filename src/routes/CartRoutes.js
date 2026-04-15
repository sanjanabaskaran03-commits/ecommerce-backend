const express = require("express");
const router = express.Router();

// TEMP CART DATA
let cart = [];

router.get("/", (req, res) => {
  res.json(cart);
});

router.post("/", (req, res) => {
  cart.push(req.body);
  res.json(cart);
});

module.exports = router;