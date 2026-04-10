const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
  res.send('FASCO API is running...');
});

module.exports = app;