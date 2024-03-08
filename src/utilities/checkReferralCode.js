const User = require('../models/user');

async function checkReferralCode(code) {
    const user = await User.findOne({
        where: {
            referral_code: code
        }
    });

    if (!user) {
        return false;
    }

    return true;
}

module.exports = checkReferralCode;