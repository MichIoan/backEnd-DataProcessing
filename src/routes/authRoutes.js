const { body } = require('express-validator');
const authController = require('../controllers/authController');
const resetPassword = require('../controllers/resetPassword');
const express = require('express');
const router = express.Router();

router.post('/register', [
    body('email')
        .isEmail()
        .withMessage()
        .normalizeEmail({ gmail_remove_dots: false }),
    body('password').trim().isLength({ min: 5 }),
], authController.register);

router.get('/activate', authController.emailVerification);

router.post('/login', authController.login);

router.post('/:userId/reset_password', [
    body('email')
        .isEmail()
        .withMessage()
        .normalizeEmail({ gmail_remove_dots: false }),
], resetPassword.resetPasswordEmail);

router.post('/reset-password', [
    body('password').trim().isLength({ min: 5 }),
], resetPassword.updatePassword);

module.exports = router;