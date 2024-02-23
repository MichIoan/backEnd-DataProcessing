// authRoutes.js
const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const profilesController = require('../controllers/profilesController');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

router.use(isAuth);

//subscrption routes
//router.post('/:userId/subscription/choose-plan', subscriptionController.changeSubscription);

router.get("/info", subscriptionController.getSubscriptionInfo);


//profile routes
router.post('/:userId/profiles/:profileId/info', profilesController.getProfileInformation);

router.get('/:userId/profiles', profilesController.getAccountProfiles);

router.patch('/:userId/profiles/:profileId/modify-preferences', profilesController.modifyPreferences);

router.post('/:userId/profiles/:profileId/update-settings', profilesController.modifyProfile);

router.post('/:userId/profiles/create', profilesController.createProfile);

router.delete('/:userId/profiles/:profileId/delete', profilesController.deleteProfile);

module.exports = router;