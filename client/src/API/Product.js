import AxiosClient from "./AxiosClient";

const ProductAPI = {
  getAllProduct(limit, offset, categoryId, brandId, search, min, max) {
    const url = `/product?limit=${limit}&offset=${offset}&categoryId=${categoryId}&brandId=${brandId}&search=${search}&min=${min}&max=${max}`;
    return AxiosClient.get(url);
  },

  getProductByDate(fromDate, toDate) {
    const url = `/product/date?fromDate=${fromDate}&toDate=${toDate}`;
    return AxiosClient.get(url);
  },

  createNewProduct(productData) {
    const url = `/product`;
    return AxiosClient.post(url, { ...productData });
  },

  updateProductData(productData, productId) {
    const url = `/product/${productId}`;
    return AxiosClient.put(url, { ...productData });
  },

  deleteProduct(productId) {
    const url = `/product/${productId}`;
    return AxiosClient.delete(url);
  },

  getProductById(productId){
    const url = `/product/${productId}`;
    return AxiosClient.get(url);
  },

  addProductToCard(productId, userId, quanlity){
    const url = `/product/cart`;
    return AxiosClient.post(url, { productId, userId, quanlity});
  },

  getUserCart(userId){
    const url = `/product/cart/${userId}`;
    return AxiosClient.get(url);
  },

  changeCartProductQuanlity(productId, userId, quanlity){
    const url = `/product/cart/quanlity`;
    return AxiosClient.put(url, { productId, userId, quanlity});
  },

  deleteCartProduct(productId, userId){
    const url = `/product/cart/delete/${productId}/${userId}`;
    return AxiosClient.delete(url);
  },

  checkoutCart(cartDetail, id){
    const url = `/product/cart/checkout`;
    return AxiosClient.post(url , {...cartDetail, paymentId: id});
  },

  getAllCheckoutProduct(){
    const url = `/product/checkout/all`;
    return AxiosClient.get(url);
  },

  getCheckoutById(checkoutId){
    const url = `/product/checkout/${checkoutId}`;
    return AxiosClient.get(url);
  },

  deleteCheckoutProduct(checkoutId){
    const url = `/product/checkout/${checkoutId}`;
    return AxiosClient.delete(url);
  },

  changeCheckoutStatus(status, checkoutId){
    const url = `/product/checkout/${checkoutId}/status/${status}`;
    return AxiosClient.put(url);
  },

  getCheckoutByUserId(userId){
    const url = `/product/checkout/user/${userId}`;
    return AxiosClient.get(url);
  },
};
export default ProductAPI;
