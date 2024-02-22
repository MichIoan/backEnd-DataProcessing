// authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const resetPassword = require('../controllers/resetPassword');
const subscriptionController = require('../controllers/subscriptionController');
const profilesController = require('../controllers/profilesController');
const router = express.Router();

router.post('/password-reset-request', [
  body('email')
    .isEmail()
    .withMessage()
    .normalizeEmail({ gmail_remove_dots: false }),
], resetPassword.resetPasswordEmail);

router.post('/reset-password', [
  body('password').trim().isLength({ min: 5 }),
], resetPassword.updatePassword);

//subscrption routes
//router.post('/:userId/subscription/choose-plan', subscriptionController.changeSubscription);

router.get("/info", subscriptionController.getSubscriptionInfo);


//profile routes
router.post('/:userId/profiles/:profileId/info', profilesController.getProfileInformation);

router.get('/:userId/profiles', profilesController.getAccountProfiles);

router.post('/:userId/profiles/:profileId/update-settings', profilesController.modifyProfile);

router.post('/:userId/profiles/create', profilesController.createProfile);

router.post('/:userId/profiles/:profileId/delete', profilesController.deleteProfile);

module.exports = router;