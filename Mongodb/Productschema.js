const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Price Schema
const priceSchema = new mongoose.Schema({
  MOQ: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    trim: true
  }
});

// Inventory Schema
const inventorySchema = new mongoose.Schema({
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  warehouseLocation: {
    type: String,
    required: true,
    trim: true
  }
});

// Variant Schema
const variantSchema = new mongoose.Schema({
  variantName: {
    type: String,
    required: true,
    trim: true
  },
  photoUris: {
    type: [String], // Array of photo URIs
    required: true
  },
  attributes: {
    type: Map,
    of: String,  // Key-value pairs for variant attributes (e.g., color, size)
    required: true
  },
  prices: [priceSchema],
  inventory: inventorySchema
});

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
    trim: true
  },
  enterprise: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  gstNumber: {
    type: String,
    required: true,
    trim: true
  },
  vendorId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});
const productDetailSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

// Product Schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  cityCode: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  photoUris: {
    type: [String], // Array of photo URIs
    required: true
  },
  variants: [variantSchema],
  vendorDetails: {
    type: vendorSchema,
    required: true
  },
  productDetails:{
    type: [productDetailSchema]
  }
}, {
  timestamps: true
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
