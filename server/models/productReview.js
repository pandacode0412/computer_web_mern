const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../untils/schemaCleaner');

const productReviewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
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

productReviewSchema.plugin(uniqueValidator);
schemaCleaner(productReviewSchema);

module.exports = mongoose.model('product-review', productReviewSchema);
