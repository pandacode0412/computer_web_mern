
const express =  require('express');
const router = express.Router();
const userController = require('../controllers/user');


router.post('/signup', userController.userSignUp);
router.post('/login', userController.userLogin);
router.get('/all', userController.getAllUser);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUserInfo);
router.delete('/:userId', userController.deleteUserId);

module.exports = router;