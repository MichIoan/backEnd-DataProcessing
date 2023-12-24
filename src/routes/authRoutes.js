// authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/activateAccount', authController.emailVerification);

router.post('/register', [
  body('email')
    .isEmail()
    .withMessage()
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password').trim().isLength({ min: 5 }),
], authController.register);

router.post('/login', authController.login);

module.exports = router;
