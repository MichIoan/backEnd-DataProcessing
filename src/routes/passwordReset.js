const express = require('express');
const { body } = require('express-validator');
const resetPassword = require('../controllers/resetPassword');

const router = express.Router();

router.post('/sendEmail', [
    body('email')
        .isEmail()
        .withMessage()
        .normalizeEmail({ gmail_remove_dots: false }),
], resetPassword.resetPasswordEmail);

router.post('/updatePassword', [
    body('password').trim().isLength({ min: 5 }),
], resetPassword.updatePassword);

module.exports = router;