const asyncHandler = require('express-async-handler');
const categoryMiddleware = require('../middleware/category');

module.exports = {
  getAllCategory: asyncHandler(async (req, res) => {
    const results = await categoryMiddleware.getAllCategory();
    res.json(results);
  }),

  createNewCategory: asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const results = await categoryMiddleware.createNewCategory(
      name,
      description
    );
    res.json(results);
  }),

  updateCategory: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { name, description } = req.body;
    const results = await categoryMiddleware.updateCategory(
      name,
      description,
      categoryId
    );
    res.json(results);
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const results = await categoryMiddleware.deleteCategory(categoryId);
    res.json(results);
  }),
};
