const { body } = require('express-validator');
const authController = require('../controllers/authController');
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

module.exports = router;