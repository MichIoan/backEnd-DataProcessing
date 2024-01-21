const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Subscription = require("../models/subscription");
const prepareResponse = require("../middlewares/prepareResponse");
const getToken = require("../middlewares/getToken");

const getSubscriptionInfo = async (req, res) => {
  try {
    const jwtToken = getToken(req);

    if (!jwtToken) {
      prepareResponse(res, 404, { error: "No JWT token found in the Header" });
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
      prepareResponse(res, 404, { error: "No user found with this email" });
    }

    const userId = existingUser.account_id;

    const subscription = await Subscription.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!subscription) {
      prepareResponse(res, 404, {
        message: "No subscription was found for this user.",
      });
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

    prepareResponse(res, 200, subscription);
  } catch (err) {
    console.log(err);
    prepareResponse(res, 500, { message: err });
  }
};

module.exports = { getSubscriptionInfo };
