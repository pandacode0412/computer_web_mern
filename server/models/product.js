const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../untils/schemaCleaner');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sale_price: {
    type: Number,
    required: true,
    default: 0,
  },
  quanlity: {
    type: Number,
    required: true,
    default: 0,
  },
  image: [
    {
      type: String,
    },
  ],
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.plugin(uniqueValidator);
schemaCleaner(productSchema);

module.exports = mongoose.model('product', productSchema);
