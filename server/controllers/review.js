const asyncHandler = require('express-async-handler');
const reviewMiddleware = require('../middleware/review');

module.exports = {
  getReviewByProductId: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { limit, page } = req.query;
    const results = await reviewMiddleware.getReviewByProductId(
      productId,
      limit,
      page
    );
    res.json(results);
  }),

  createNewReview: asyncHandler(async (req, res) => {
    const { user_id, review, product_id } = req.body;
    const results = await reviewMiddleware.createNewReview({
      user_id,
      review,
      product_id,
    });
    res.json(results);
  }),

  changeReviewStatus: asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { status } = req.body;
    const results = await reviewMiddleware.changeReviewStatus(reviewId, status);
    res.json(results);
  }),

  getAllReview: asyncHandler(async (req, res) => {
    const results = await reviewMiddleware.getAllReview();
    res.json(results);
  }),
};

