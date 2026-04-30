const Cart = require("../models/Cart");

// ADD / REMOVE (toggle)
exports.toggleCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index > -1) {
      cart.items.splice(index, 1); // remove
    } else {
      cart.items.push({ productId, quantity: 1 }); // add
    }

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET CART
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    const cart = await Cart.findOne({ userId })
      .populate("items.productId");

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};