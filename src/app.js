const cartRoutes = require('./routes/CartRoutes');
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true              
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use("/uploads", express.static("uploads"));
// 🔥 ADD THIS
app.use('/api/cart', require('./routes/CartRoutes'));

app.get('/', (req, res) => {
  res.send('FASCO API is running...');
});

module.exports = app;