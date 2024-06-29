const asyncHandler = require('express-async-handler');
const brandMiddleware = require('../middleware/brand');

module.exports = {
  getAllBrand: asyncHandler(async (req, res) => {
    const results = await brandMiddleware.getAllBrand();
    res.json(results);
  }),

  createNewBrand: asyncHandler(async (req, res) => {
    const { name, image, description } = req.body;
    const results = await brandMiddleware.createNewBrand(
      name,
      image,
      description
    );
    res.json(results);
  }),

  updateBrand: asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    const { name, image, description } = req.body;
    const results = await brandMiddleware.updateBrand(
      name,
      image,
      description,
      brandId
    );
    res.json(results);
  }),

  deleteBrand: asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    const results = await brandMiddleware.deleteBrand(brandId);
    res.json(results);
  }),
};
