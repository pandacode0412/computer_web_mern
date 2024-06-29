const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../untils/schemaCleaner');

const productCheckoutSchema = new mongoose.Schema({
  total_price: {
    type: Number,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
    trim: true,
  },
  user_address: {
    type: String,
    required: true,
    trim: true,
  },
  user_phone: {
    type: String,
    required: true,
    trim: true,
  },
  user_email: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Number,
    required: true,
  },
  payment_methods: {
    type: String,
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

productCheckoutSchema.plugin(uniqueValidator);
schemaCleaner(productCheckoutSchema);

module.exports = mongoose.model('product-checkout', productCheckoutSchema);

