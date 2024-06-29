const express = require('express');
const router = express.Router();
const brandController = require('../controllers/_brand');

router.get('/', brandController.getAllBrand);
router.post('/', brandController.createNewBrand);
router.put('/:brandId', brandController.updateBrand);
router.delete('/:brandId', brandController.deleteBrand);

module.exports = router;