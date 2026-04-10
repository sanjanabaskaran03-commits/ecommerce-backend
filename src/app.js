const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;