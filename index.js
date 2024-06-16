const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./Mongodb/connection');
const productRoutes = require('./routes/CURD/routes');
const { connectredis } = require('./redis/redis');
const Product = require('./Mongodb/Productschema'); // Assuming the Product model is in models/Product.js

const app = express();

// Connect to MongoDB
connectDB();
connectredis();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/products', productRoutes);

// Sample descriptions


// Function to update product details for all products




// Start the server
const PORT = process.env.PORT || 3032;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
