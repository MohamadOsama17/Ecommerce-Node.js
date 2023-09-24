
const router = require('express').Router();
const authController = require('../../controllers/authController');

router.post('/forget-password', authController.forgetPassword);

router.post('/verify-forget-password-code', authController.verifyForgetPassCode);

router.post('/reset-password', authController.resetPassword);

module.exports = router;