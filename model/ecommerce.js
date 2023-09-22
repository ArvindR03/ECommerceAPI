const mongoose = require('mongoose');

// Create a Mongoose schema for the product
const productSchema = new mongoose.Schema({
  productID: { type: String, unique: true, required: true, immutable: true },
  productName: { type: String, required: true },
  productDescription: { type: String },
  productCategory: { type: String },
  price: { type: Number, required: true },
  currency: { type: String },
  stockQuantity: { type: Number, default: 0 },
  manufacturer: { type: String },
  images: [String], // Array of image URLs
  ratings: [
    {
      userId: { type: String },
      rating: { type: Number },
      comment: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  variants: [
    {
      size: { type: String },
      color: { type: String },
      price: { type: Number },
      stockQuantity: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// Create a Mongoose model using the schema
module.exports = mongoose.model('Product', productSchema);

