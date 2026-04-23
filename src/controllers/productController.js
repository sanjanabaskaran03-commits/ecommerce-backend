const Product = require("../models/Product");

// GET PRODUCTS (category / section / limit)
exports.getProducts = async (req, res) => {
  const { category, section, limit } = req.query;

  let filter = {};

  if (category) filter.category = category;
 if (section === "deals") {
    const now = new Date();

    filter = {
      sectionTags: "deals",
      dealStart: { $lte: now },
      dealEnd: { $gte: now },
    };
  } else if (section) {
    filter.sectionTags = section;
  }

  try {
    let query = Product.find(filter);

    if (limit) {
      query = query.limit(Number(limit));
    }

    const products = await query;
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE PRODUCT
exports.createProduct = (req, res) => {
  const {
    title,
    price,
    category,
    description,
    discountPercent,
    sectionTags,
    specifications,
    image,
    stock
  } = req.body;

  console.log("👉 Incoming stock (CREATE):", stock);

  if (image && image.length > 5 * 1024 * 1024) {
    return res.status(400).json({
      message: "Image too large (max 5MB recommended)"
    });
  }

  Product.create({
    title,
    price,
    category,
    description,
    discountPercent,
    sectionTags: sectionTags || [],
    specifications: specifications || {},
    image,
    stock: stock ?? 0
  })
    .then((data) => {
      console.log("👉 Saved stock (CREATE):", data.stock);
      res.status(201).json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.updateProduct = (req, res) => {
  const {
    title,
    price,
    category,
    description,
    discountPercent,
    sectionTags,
    specifications,
    image,
    stock
  } = req.body;

  console.log("👉 Incoming stock (UPDATE):", stock);

  if (image && image.length > 5 * 1024 * 1024) {
    return res.status(400).json({
      message: "Image too large (max 5MB recommended)"
    });
  }

  Product.findByIdAndUpdate(
    req.params.id,
    {
      title,
      price,
      category,
      description,
      discountPercent,
      sectionTags: sectionTags || [],
      specifications: specifications || {},
      stock: stock ?? 0,
      ...(image && { image })
    },
    { new: true }
  )
    .then((data) => {
      console.log("👉 Saved stock (UPDATE):", data.stock);
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};