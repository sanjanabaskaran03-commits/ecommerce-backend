const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/uploads', express.static('uploads'));

// ✅ FIXED CART ROUTE
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));
app.use("/api/order", require("./routes/order"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.get('/', (req, res) => {
  res.send('FASCO API is running...');
});

module.exports = app;