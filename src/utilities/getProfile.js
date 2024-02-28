const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Profile = require('../models/profile');
const sendResponse = require('./response');

async function getProfile(req, res, email) {
    try {
        const existingUser = await User.findOne({
            where: {
                email: email,
            }
        });

        if (!existingUser) {
            sendResponse(req, res, 404, { error: "User not found" });
            return;
        }

        const userId = existingUser.user_id;
        const profileName = req.body.profileName;

        if (!profileName) {
            sendResponse(req, res, 404, { error: "Please provide the profile name" });
            return;
        }

        const profile = await Profile.findOne({
            where: {
                user_id: userId,
                name: profileName,
            }
        });

        if (!profile) {
            sendResponse(req, res, 404, { error: "You don't have a profile with this name" });
            return;
        }

        return profile;

    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, { error: "Internal server error" });
        return;
    }
}

module.exports = getProfile;