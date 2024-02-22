const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');
const User = require('../models/user');
const getToken = require('../middlewares/getToken');
const sendResponse = require('../utilities/response');
const Preferences = require('../models/preferences');
const getProfile = require('../utilities/getProfile');

const getProfileInformation = async (req, res) => {
    try {
        const decoded = await verifyToken(req, res);

        const userId = req.params.userId;
        const profileId = req.params.profileId;

        if (res.headersSent) return;

        if (!userId) {
            sendResponse(req, res, 401, { error: "Please provide the user id as a parameter in the URL" });
            return;
        }

        if (!profileId) {
            sendResponse(req, res, 401, { error: "Please provide the profileId as a parameter in the URL" });
            return;
        }

        const existingUser = await User.findOne({
            where: {
                user_id: userId,
            }
        })

        if (!existingUser) {
            sendResponse(req, res, 401, { error: "No user found with this id" });
            return;
        }

        const profile = await Profile.findOne({
            where: {
                user_id: existingUser.user_id,
                profile_id: profileId,
            }
        });

        if (!profile) {
            sendResponse(req, res, 401, { error: "No profile found" });
            return;
        }

        sendResponse(req, res, 202, { profile });
        return;

    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, { error: "Internal server error" });
        return;
    }
}

const getAccountProfiles = async (req, res) => {
    try {
        const decoded = await verifyToken(req, res);

        if (res.headersSent) return;

        const existingUser = await User.findOne({
            where: {
                email: decoded.email,
            }
        });

        if (!existingUser) {
            sendResponse(req, res, 404, { error: "No user found with this email" });
            return;
        }

        const profiles = await Profile.findAll({
            where: {
                user_id: existingUser.user_id,
            }
        });

        sendResponse(req, res, 202, { profiles });
        return;

    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, { error: "internal server error" });
        return;
    }
}

const createProfile = async (req, res) => {
    try {
        const profileDetails = req.body;
        const decoded = await verifyToken(req, res);

        if (res.headersSent) return;

        const email = decoded.email;
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

        const check = await Profile.findOne({
            where: {
                user_id: userId,
                name: profileDetails.name
            }
        });

        if (check) {
            sendResponse(req, res, 409, { error: "Profile with this name already exists" });
            return;
        } else {

            const profile = await Profile.create({
                user_id: userId,
                name: profileDetails.name,
                photo_path: profileDetails.profile_image,
                child_profile: profileDetails.kids,
                preferences: profileDetails.preferences,
                date_of_birth: profileDetails.date_of_birth,
                language: profileDetails.language,
            });

            sendResponse(req, res, 201, { message: "Profile created successfully" });
            return;
        }

    } catch (error) {
        console.error(error);
        sendResponse(req, res, 500, { error: "Internal server error" });
        return;
    }
};

const modifyProfile = async (req, res) => {
    try {
        const profileDetails = req.body;
        const decoded = await verifyToken(req, res);

        if (res.headersSent) return;

        const email = decoded.email;
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
            sendResponse(req, res, 404, { error: "No profile found" });
            return;
        }

        const profileId = profile.profile_id;

        const updatedProfileData = {};
        if (profileDetails.NewName) updatedProfileData.name = profileDetails.NewName;
        if (profileDetails.photoPath) updatedProfileData.photo_path = profileDetails.photoPath;
        if (profileDetails.childProfile !== undefined) updatedProfileData.child_profile = profileDetails.childProfile;
        if (profileDetails.date_of_birth) updatedProfileData.date_of_birth = profileDetails.date_of_birth;
        if (profileDetails.language) updatedProfileData.language = profileDetails.language;

        if (updatedProfileData) {
            await Profile.update(updatedProfileData, {
                where:
                {
                    profile_id: profileId,
                    name: profileName,
                }
            });

            sendResponse(req, res, 200, { message: "Profile updated successfully!" });

            return;
        } else {
            sendResponse(req, res, 200, { message: "No settings updated" });

            return;
        }
    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, { error: "Internal server error" });

        return;
    }
}

const modifyPreferences = async (req, res) => {
    try {
        const decoded = await verifyToken(req, res);

        if (res.headersSent) return;

        let profile;
        await getProfile(req, res, decoded, next).then(fetchedProfile => {
            profile = fetchedProfile;
        });

        const profileId = profile.profile_id;

        if (!profileId) {
            sendResponse(req, res, 404, { error: "Profile not found" });
            return;
        }

        const preferences = await Preferences.findOne({
            where:
            {
                profile_id: profileId,
            }
        });

        sendResponse(req, res, 202, { message: "Profile found" });
        return;

    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, { error: "Internal server error" });
        return;
    }
}

const deleteProfile = async (req, res) => {
    try {
        const decoded = await verifyToken(req, res);

        if (res.headersSent) return;

        const profile = await getProfile(req, res, decoded.email);

        if (res.headersSent) return;

        const profileId = profile.profile_id;

        if (!profileId) {
            sendResponse(req, res, 401, { error: "Profile not found" });

            return;
        }

        const destroyed = await Profile.destroy({
            where:
            {
                profile_id: profileId,
                name: profile.name,
            }
        });

        if (!destroyed) {
            sendResponse(req, res, 404, { error: "No profile found with this name" });

            return;
        }

        sendResponse(req, res, 204, { message: "Profile deleted successfully" });

        return;
    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, { error: "Internal server error" });

        return;
    }
}

async function verifyToken(req, res) {
    const token = getToken(req);
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            sendResponse(req, res, 401, { error: "Token expired" });

            return;
        } else {
            sendResponse(req, res, 401, { error: "Invalid token" });

            return;
        }
    }

    return decoded;
}

module.exports = { createProfile, modifyProfile, modifyPreferences, getProfileInformation, getAccountProfiles, deleteProfile };