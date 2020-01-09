var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');
var VerifyToken = require('../controllers/verifyToken');

router.get('/', VerifyToken,user_controller.getUser);
router.get('/:id', VerifyToken, user_controller.findUserById);
router.post('/',user_controller.createUser);
router.put('/:id', VerifyToken,user_controller.updateUser);
router.delete("/:id", VerifyToken,user_controller.deleteUser);
router.post('/login',user_controller.login);
router.put('/updatePassword/:id', VerifyToken,user_controller.updatePassword);

module.exports = router;