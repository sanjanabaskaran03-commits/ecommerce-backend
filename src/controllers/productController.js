const Product = require("../models/Product");

// GET PRODUCTS (category / section / limit)
exports.getProducts = async (req, res) => {
  try {
    const { category, page, limit } = req.query;

    let filter = {};

    if (category) {
      filter.category = {
        $regex: new RegExp(category.trim(), "i"),
      };
    }

    // ✅ If NO pagination → return ALL (homepage)
    if (!page && !limit) {
      const products = await Product.find(filter);

      return res.json({
        success: true,
        data: products,
      });
    }

    // ✅ Pagination only for shop page
    const currentPage = Number(page) || 1;
    const perPage = Number(limit) || 5;

    const skip = (currentPage - 1) * perPage;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(perPage);

    res.json({
      success: true,
      data: products,
      totalPages: Math.ceil(total / perPage),
      currentPage,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
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