import AxiosClient from "./AxiosClient";

const ReviewAPI = {
  getReviewByProduct({ productId, limit, page }) {
    const url = `/review/${productId}?limit=${limit}&page=${page}`;
    return AxiosClient.get(url);
  },

  createCustomerReview({ user_id, review, product_id }) {
    const url = `/review`;
    return AxiosClient.post(url, { user_id, review, product_id });
  },

  getAllReview() {
    const url = `/review`;
    return AxiosClient.get(url);
  },

  updateReviewStatus(reviewId, status) {
    const url = `/review/${reviewId}/status`
    return AxiosClient.put(url, {status});
  }
};
export default ReviewAPI;
