const express = require('express');
const router = express.Router();
const Product = require('../../Mongodb/Productschema');
const { getAsync, setAsync, expireAsync, client } = require('../../redis/redis');

// Cache middleware
const cacheMiddleware = async (req, res, next) => {
  const { category, subcategory, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  const cacheKey = `products:${category}:${subcategory}:${minPrice}:${maxPrice}:${page}:${limit}`;
  
  try {
    const cachedData = await getAsync(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    next();
  } catch (err) {
    console.error('Redis error:', err);
    next();
  }
};

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products based on category, subcategory, or both with pagination and price filter, cacheMiddleware
router.get('/',  cacheMiddleware,async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    let filter = {};
    console.log(req.query)

    if (category) {
      filter.category = category;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (minPrice || maxPrice) {
      filter['prices.price'] = {};
      if (minPrice) {
        filter['prices.price'].$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter['prices.price'].$lte = parseFloat(maxPrice);
      }
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      select: 'productName prices'
    };

    const products = await Product.paginate(filter, options);
    console.log(products)

    // Cache the result
    const cacheKey = `products:${category}:${subcategory}:${minPrice}:${maxPrice}:${page}:${limit}`;

    await setAsync(cacheKey, JSON.stringify(products));
    await expireAsync(cacheKey, 3600); // Cache for 1 hour

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by _id excluding productName and embeddings
router.get('/info/:id', async (req, res) => {
  try {
    
    const { id } = req.params;
    console.log(id)
    const product = await Product.findById(id, '-productName_embedding'); // Exclude productName and embeddings

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
