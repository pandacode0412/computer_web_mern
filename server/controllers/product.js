const asyncHandler = require('express-async-handler');
const productMiddleware = require('../middleware/product');

module.exports = {
  getAllProduct: asyncHandler(async (req, res) => {
    const { limit, offset, categoryId, brandId, search, min, max } = req.query;
    const results = await productMiddleware.getAllProduct(
      limit,
      offset,
      categoryId,
      brandId,
      search,
      min,
      max
    );
    res.json(results);
  }),

  getCheckoutByDate: asyncHandler(async (req, res) => {
    const { fromDate, toDate } = req.query;
    const results = await productMiddleware.getCheckoutByDate(fromDate, toDate);
    res.json(results);
  }),

  getProductById: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const results = await productMiddleware.getProductById(productId);
    res.json(results);
  }),

  createNewProduct: asyncHandler(async (req, res) => {
    const {
      name,
      description,
      image,
      price,
      sale_price,
      quanlity,
      brand_id,
      category_id,
      font_image,
      back_image,
    } = req.body;
    const results = await productMiddleware.createNewProduct(
      name,
      description,
      image,
      price,
      sale_price,
      quanlity,
      brand_id,
      category_id,
      font_image,
      back_image
    );
    res.json(results);
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const {
      name,
      description,
      image,
      price,
      sale_price,
      quanlity,
      brand_id,
      category_id,
      front_image,
      back_image,
    } = req.body;
    const results = await productMiddleware.updateProduct(
      name,
      description,
      image,
      price,
      sale_price,
      quanlity,
      brand_id,
      category_id,
      productId,
      front_image,
      back_image
    );
    res.json(results);
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const results = await productMiddleware.deleteProduct(productId);
    res.json(results);
  }),

  addProductToCart: asyncHandler(async (req, res) => {
    const { productId, userId, quanlity } = req.body;
    const results = await productMiddleware.addProductToCart(
      productId,
      userId,
      quanlity
    );
    res.json(results);
  }),

  getUserCart: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const results = await productMiddleware.getUserCart(userId);
    res.json(results);
  }),

  changeProductCartQuanlity: asyncHandler(async (req, res) => {
    const { productId, userId, quanlity } = req.body;
    const results = await productMiddleware.changeProductCartQuanlity(
      productId,
      userId,
      quanlity
    );
    res.json(results);
  }),

  deleteCartProduct: asyncHandler(async (req, res) => {
    const { productId, userId } = req.params;
    const results = await productMiddleware.deleteCartProduct(
      productId,
      userId
    );
    res.json(results);
  }),

  checkoutCart: asyncHandler(async (req, res) => {
    const { total_price, user_id, list_product, paymentId, payment_method } =
      req.body;
    const results = await productMiddleware.checkoutCart(
      total_price,
      user_id,
      list_product,
      paymentId,
      payment_method
    );
    res.json(results);
  }),

  getAllCheckoutProduct: asyncHandler(async (req, res) => {
    const results = await productMiddleware.getAllCheckoutProduct();
    res.json(results);
  }),

  getCheckoutById: asyncHandler(async (req, res) => {
    const { checkoutId } = req.params;
    const results = await productMiddleware.getCheckoutById(checkoutId);
    res.json(results);
  }),

  deleteCheckoutProduct: asyncHandler(async (req, res) => {
    const { checkoutId } = req.params;
    const results = await productMiddleware.deleteCheckoutProduct(checkoutId);
    res.json(results);
  }),

  changeCheckoutStatus: asyncHandler(async (req, res) => {
    const { checkoutId, status } = req.params;
    const results = await productMiddleware.changeCheckoutStatus(
      checkoutId,
      status
    );
    res.json(results);
  }),

  getCheckoutByUserId: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const results = await productMiddleware.getCheckoutByUserId(userId);
    res.json(results);
  }),
};
