var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

router.get('/', user_controller.getUser);
router.get('/:id', user_controller.findUserById);
router.post('/', user_controller.createUser);
router.put('/:id', user_controller.updateUser);
router.delete("/:id", user_controller.deleteUser);
router.post('/login',user_controller.login);

module.exports = router;