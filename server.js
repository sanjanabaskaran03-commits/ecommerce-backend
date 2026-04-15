require('dotenv').config(); 
const connectDB = require('./src/config/db'); 
const createAdmin = require('./src/config/createAdmin');
const app = require('./src/app'); 

connectDB(); 
createAdmin();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 