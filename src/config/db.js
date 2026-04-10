const mongoose = require('mongoose');

const connectDB = async () => mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error(err))

module.exports = connectDB; 