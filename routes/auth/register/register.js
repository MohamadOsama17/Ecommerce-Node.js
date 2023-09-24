const router = require('express').Router();
const registerController = require('../../../controllers/registerController')

router.post('/', registerController.registerUser);

module.exports = router;