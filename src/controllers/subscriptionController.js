const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Subscription = require("../models/subscription");
const response = require("../utilities/response");

const getSubscriptionInfo = async (req, res) => {
  try {
    const jwtToken = getToken(req);

    if (!jwtToken) {
      response(req, res, 404, { error: "No JWT token found in the Header" });
      return;
    }

    const decoded = jwt.verify(jwtToken, process.env.JWT_KEY);

    const email = decoded.email;

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      response(req, res, 404, { error: "No user found with this email" });
    }

    const userId = existingUser.account_id;

    const subscription = await Subscription.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!subscription) {
      response(req, res, 404, { message: "No subscription was found for this user." });
      return;
    }

    const subscriptionInfo = [];

    subscriptionInfo.push(
      subscription.price,
      subscription.type,
      subscription.subscription_status,
      subscription.end_date,
      subscription.description
    );

    response(req, res, 200, subscription);
    return;
  } catch (err) {
    console.log(err);
    response(req, res, 500, { message: err });
    return;
  }
};

module.exports = { getSubscriptionInfo };
