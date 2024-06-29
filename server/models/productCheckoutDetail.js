const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../untils/schemaCleaner');

const productCheckoutDetailSchema = new mongoose.Schema({
  checkout_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  proudct_brand: {
    type: String,
    required: true,
  },
  proudct_image: {
    type: String,
    required: true,
  },
  product_category: {
    type: String,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_quanlity: {
    type: Number,
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

productCheckoutDetailSchema.plugin(uniqueValidator);
schemaCleaner(productCheckoutDetailSchema);

module.exports = mongoose.model('product-checkout-detail', productCheckoutDetailSchema);

