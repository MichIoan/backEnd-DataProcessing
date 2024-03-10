// authRoutes.js
const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const profilesController = require('../controllers/profilesController');
const authController = require('../controllers/authController');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

router.use(isAuth);

//subscription routes
router.patch('/:userId/subscription/change-plan', subscriptionController.changeSubscription);

router.get("/:userId/subscription/info", subscriptionController.getSubscriptionInfo);

router.patch("/:userId/subscription/renew", subscriptionController.renewSubscription);

//profile routes
router.post('/:userId/profiles/:profileId/info', profilesController.getProfileInformation);

router.get('/:userId/profiles', profilesController.getAccountProfiles);

router.patch('/:userId/profiles/:profileId/modify-preferences', profilesController.modifyPreferences);

router.patch('/:userId/profiles/:profileId/update-settings', profilesController.modifyProfile);

router.post('/:userId/profiles/create', profilesController.createProfile);

router.delete('/:userId/profiles/:profileId/delete', profilesController.deleteProfile);

router.delete('/:userId/delete-user', authController.deleteUser);

module.exports = router;