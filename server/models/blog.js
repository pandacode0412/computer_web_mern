const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../untils/schemaCleaner');

const blogSchema = new mongoose.Schema({
  blog_title: {
    type: String,
    required: true,
    trim: true,
  },
  blog_desc: {
    type: String,
    required: true,
    trim: true,
  },
  blog_image: {
    type: String,
    required: false,
    trim: true,
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

blogSchema.plugin(uniqueValidator);
schemaCleaner(blogSchema);

module.exports = mongoose.model('blogs', blogSchema);