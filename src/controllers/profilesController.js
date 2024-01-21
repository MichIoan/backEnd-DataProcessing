// create-profile x
// update-profile x
// delete-profile x
// get-profile-details(preferences,viewing history, ) x
// List Profiles x

const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');
const User = require('../models/user');
const getToken = require('../middlewares/getToken');
const prepareResponse = require('../middlewares/prepareResponse');

const createProfile = async (req, res) => {
    try {
        const profileDetails = req.body;
        const token = getToken(req)

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY);
            console.log('decoded', decoded);
        } catch (error) {
            console.log(error);
            prepareResponse(res, 401, { error: "Invalid token" });
        }

        if (!decoded) {
            prepareResponse(res, 401, { error: "Invalid token" });
            return;
        }

        if (decoded.exp) {
            prepareResponse(res, 401, { error: "Token expired" });
            return;
        }

        console.log("AAA");

        const email = decoded.email;
        const existingUser = await User.findOne({
            where: {
                email: email,
            }
        });

        if (!existingUser) {
            prepareResponse(res, 404, { error: "User not found" });
            return;
        }

        const userId = existingUser.user_id;

        await Profile.create({
            user_id: userId,
            name: profileDetails.name,
            photo_path: profileDetails.profile_image,
            child_profile: profileDetails.kids,
            preferences: profileDetails.preferences,
            date_of_birth: profileDetails.date_of_birth,
            language: profileDetails.language,
        });

        prepareResponse(res, 201, { message: "Profile created successfully", profile: profile });

        return;

    } catch (error) {
        console.log(error);
        prepareResponse(res, 500, { error: "error1" });
        return;
    }
};

module.exports = { createProfile }