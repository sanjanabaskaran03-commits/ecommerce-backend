const Wishlist = require("../models/Wishlist");

// ADD / REMOVE
exports.toggleWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    const exists = wishlist.products.includes(productId);

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.query;

    const wishlist = await Wishlist.findOne({ userId })
      .populate("products");

    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};