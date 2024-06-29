const express =  require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

router.get('/', categoryController.getAllCategory);
router.post('/', categoryController.createNewCategory);
router.put('/:categoryId', categoryController.updateCategory);
router.delete('/:categoryId', categoryController.deleteCategory);

module.exports = router;