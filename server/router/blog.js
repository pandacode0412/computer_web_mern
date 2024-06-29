const express =  require('express');
const router = express.Router();
const blogController = require('../controllers/blog');

router.get('/', blogController.getAllPost);
router.get('/:postId', blogController.getPostById);
router.post('/', blogController.addNewPostData);
router.delete('/:postId', blogController.deletePostData);
router.put('/:postId', blogController.updatePostData)

module.exports = router;