const express = require('express');
const profilesController = require('../controllers/profilesController');

const router = express.Router();

//router.get('/profile-information', profilesController.getProfileInformation);

//router.get('/get-account-profiles', profilesController.getAccountProfiles);

//router.post('/update-profile-settings', profilesController.modifyProfile);

router.post('/createNewProfile', profilesController.createProfile);

//router.post('/delete-profile', profilesController.deleteProfile);

module.exports = router;

// create-profile x
// update-profile x
// delete-profile x
// get-profile-details(preferences,viewing history, ) x
// List Profiles x