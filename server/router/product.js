const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/', productController.getAllProduct);
router.get('/date', productController.getCheckoutByDate);
router.get('/:productId', productController.getProductById);
router.post('/', productController.createNewProduct);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);
router.post('/cart', productController.addProductToCart);
router.get('/cart/:userId', productController.getUserCart);
router.put('/cart/quanlity', productController.changeProductCartQuanlity);
router.delete(
  '/cart/delete/:productId/:userId',
  productController.deleteCartProduct
);
router.post('/cart/checkout', productController.checkoutCart);
router.get('/checkout/all', productController.getAllCheckoutProduct);
router.get('/checkout/:checkoutId', productController.getCheckoutById);
router.delete('/checkout/:checkoutId', productController.deleteCheckoutProduct);
router.put(
  '/checkout/:checkoutId/status/:status',
  productController.changeCheckoutStatus
);
router.get('/checkout/user/:userId', productController.getCheckoutByUserId);

module.exports = router;
