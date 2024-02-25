const Profile = require('../models/profile');
const User = require('../models/user');
const Preferences = require('../models/preferences');
const response = require('../utilities/response');

const getProfileInformation = async (req, res) => {
    try {
        const userId = req.params.userId;
        const profileId = req.params.profileId;

        if (!userId) {
            response(req, res, 401, { error: "Please provide the user id as a parameter in the URL" });
            return;
        }

        if (!profileId) {
            response(req, res, 401, { error: "Please provide the profileId as a parameter in the URL" });
            return;
        }

        const existingUser = await User.findOne({
            where: {
                user_id: userId,
            }
        })

        if (!existingUser) {
            response(req, res, 401, { error: "No user found with this id" });
            return;
        }

        const profile = await Profile.findOne({
            where: {
                user_id: existingUser.user_id,
                profile_id: profileId,
            }
        });

        if (!profile) {
            response(req, res, 401, { error: "No profile found with this id" });
            return;
        }

        response(req, res, 202, { profile });
        return;

    } catch (error) {
        console.log(error);
        response(req, res, 500, { error: "Internal server error" });
        return;
    }
}

const getAccountProfiles = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        response(req, res, 401, { error: "Please provide user id as parameter in the URL" });
        return;
    }

    try {
        const profiles = await Profile.findAll({
            where: {
                user_id: userId,
            }
        });

        if (!profiles) {
            response(req, res, 401, { error: "No profiles found" });
            return;
        }

        response(req, res, 202, { profiles });
        return;
    } catch (error) {
        console.log(error);
        response(req, res, 500, { error: "Internal server error" });
        return;
    }
}

const createProfile = async (req, res) => {
    try {
        const profileDetails = req.body;
        const userId = req.params.userId;
        const existingUser = await User.findOne({
            where: {
                user_id: userId,
            }
        });

        if (!existingUser) {
            response(req, res, 404, { error: "User not found" });
            return;
        }
        const check = await Profile.findOne({
            where: {
                user_id: userId,
                name: profileDetails.name
            }
        });

        if (check) {
            response(req, res, 409, { error: "Profile with this name already exists" });
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

            response(req, res, 201, { message: "Profile created successfully" });
            return;
        }
    } catch (error) {
        console.error(error);
        response(req, res, 500, { error: "Internal server error" });
        return;
    }
};

const modifyProfile = async (req, res) => {
    try {
        const profileDetails = req.body;
        const userId = req.params.userId;
        const profileId = req.params.profileId;

        if (!userId) {
            response(req, res, 401, { error: "Please provide the user id in the URL" });
            return;
        }

        if (!profileId) {
            response(req, res, 401, { error: "Please provide the profile id in the URL" });
            return;
        }

        const existingProfile = await Profile.findOne({
            where: {
                profile_id: profileId,
                user_id: userId
            }
        });

        if (!existingProfile) {
            response(req, res, 404, { error: "No profile found" });
            return;
        }

        const updatedProfileData = {};
        if (profileDetails.newName) updatedProfileData.name = profileDetails.newName;
        if (profileDetails.photoPath) updatedProfileData.photo_path = profileDetails.photoPath;
        if (profileDetails.childProfile !== undefined) updatedProfileData.child_profile = profileDetails.childProfile;
        if (profileDetails.date_of_birth) updatedProfileData.date_of_birth = profileDetails.date_of_birth;
        if (profileDetails.language) updatedProfileData.language = profileDetails.language;

        if (updatedProfileData) {
            await Profile.update(updatedProfileData, {
                where:
                {
                    profile_id: profileId,
                    user_id: userId
                }
            });

            response(req, res, 200, { message: "Profile updated successfully!" });
            return;
        } else {
            response(req, res, 200, { message: "No settings updated" });
            return;
        }
    } catch (error) {
        console.log(error);
        response(req, res, 500, { error: "Internal server error" });
        return;
    }
}

const modifyPreferences = async (req, res) => {
    try {
        const userId = req.params.userId;
        const profileId = req.params.profileId;
        const preferences = req.body;

        if (!userId) {
            response(req, res, 400, { error: "Please provide the user id in the URL" });
            return;
        }

        if (!profileId) {
            response(req, res, 400, { error: "Please provide the profile id in the URL" });
            return;
        }

        const existingProfile = await Profile.findOne({
            where: {
                user_id: userId,
                profile_id: profileId,
            }
        });

        if (!existingProfile) {
            response(req, res, 401, { message: "No profile found for this id" });
            return;
        }

        const updatedPreferences = {};
        if (updatedPreferences.content_type) updatedPreferences.content_type = preferences.content_type;
        if (updatedPreferences.genre) updatedPreferences.genre = preferences.genre;
        if (updatedPreferences.minimum_age) updatedPreferences.minimum_age = preferences.minimum_age;
        if (updatedPreferences.viewing_classification) updatedPreferences.viewing_classification = preferences.viewing_classification;

        if (!updatedPreferences) {
            response(req, res, 200, { message: "No preferences were modified" });
            return;
        }

        if (updatedPreferences) {
            await Preferences.update(updatedPreferences, {
                where:
                {
                    profile_id: profileId,
                }
            });
        }

        response(req, res, 202, { message: "Profile's preferences successfully modified" });
        return;
    } catch (error) {
        console.log(error);
        response(req, res, 500, { error: "Internal server error" });
        return;
    }
}

const deleteProfile = async (req, res) => {
    try {
        const profileId = req.params.profileId;
        const userId = req.params.userId;

        if (!profileId) {
            response(req, res, 401, { error: "Please provide the profile id in the URL" });
            return;
        }

        if (!userId) {
            response(req, res, 401, { error: "Please provide the user id in the URL" });
            return;
        }

        const destroyed = await Profile.destroy({
            where:
            {
                profile_id: profileId,
                user_id: userId,
            }
        });

        if (!destroyed) {
            response(req, res, 404, { error: "No profile found with this name" });
            return;
        }

        response(req, res, 204, { message: "Profile deleted successfully" });
        return;
    } catch (error) {
        console.log(error);
        response(req, res, 500, { error: "Internal server error" });
        return;
    }
}

module.exports = { createProfile, modifyProfile, modifyPreferences, getProfileInformation, getAccountProfiles, deleteProfile };