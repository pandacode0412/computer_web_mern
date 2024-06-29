const express =  require('express');
const router = express.Router();
const reviewController = require('../controllers/review');

router.get('/:productId', reviewController.getReviewByProductId)
router.post('/', reviewController.createNewReview)
router.put('/:reviewId/status', reviewController.changeReviewStatus)
router.get('/', reviewController.getAllReview)

module.exports = router;