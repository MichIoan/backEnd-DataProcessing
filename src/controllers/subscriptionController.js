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
}

const changeSubscription = async (req, res) => {
  try {
    const userId = req.params.userId;
    const subscriptionPlan = req.body.subscriptionPlan;

    if (!userId) {
      response(req, res, 400, { error: "User ID parameter is missing in the URL." });
      return;
    }

    if (!subscriptionPlan) {
      response(req, res, 400, { error: "Please specify in the body the new subscription plan" });
      return;
    }

    const user = await User.findOne({
      where: {
        user_id: userId
      }
    });

    const subscription = await Subscription.findOne({
      where: {
        user_id: userId,
      }
    });

    if (!subscription) {
      response(req, res, 400, { error: "No subscription found for this user" });
      return;
    }

    if (subscription.type === subscriptionPlan) {
      response(req, res, 400, { error: "The user already has this subscription plan!" });
      return;
    }

    let plan;
    switch (subscriptionPlan) {
      case 'SD':
        plan = Plan.SD;
        break;
      case 'HD':
        plan = Plan.HD;
        break;
      case 'UHD':
        plan = Plan.UHD;
        break;
      default:
        response(req, res, 400, { error: "Invalid subscription plan. Choose between SD, HD, UHD!" });
        return;
    }

    if (user.has_discount) {
      plan.price -= 2;
    }

    const updatedSubscription = await subscription.update({
      type: plan.plan,
      price: plan.price,
      description: plan.description
    });

    if (!updatedSubscription) {
      response(req, res, 400, { error: "Subscription couldn't be updated, please try again!" });
      return;
    }

    response(req, res, 200, { message: "Subscription updated succesfully!" });
    return;
  } catch (err) {
    console.log(err);
    response(req, res, 500, { error: "Internal server error" });
    return;
  }
}

const renewSubscription = async (req, res) => {
  try {
    const userId = req.params.userId;
    const subscriptionPlan = req.body.subscriptionPlan;

    if (!userId) {
      response(req, res, 400, { error: "User ID parameter is missing in the URL." });
      return;
    }

    if (!subscriptionPlan) {
      response(req, res, 400, { error: "Please specify in the body the subscription plan that you want to renew" });
      return;
    }

    const user = await User.findOne({
      where: {
        user_id: userId
      }
    });

    const subscription = await Subscription.findOne({
      where: {
        user_id: userId,
      }
    });

    if (!subscription) {
      response(req, res, 403, { error: "No subscription found for this user, please try again." });
      return;
    }

    //compare end date with the current date
    if (new Date(subscription.end_date) < new Date().now) {
      response(req, res, 400, { error: "You can't renew your subscription yet! Wait until " + subscription.end_date });
      return;
    }

    let plan;
    switch (subscriptionPlan) {
      case 'SD':
        plan = Plan.SD;
        break;
      case 'HD':
        plan = Plan.HD;
        break;
      case 'UHD':
        plan = Plan.UHD;
        break;
      default:
        response(req, res, 400, { error: "Invalid subscription plan. Choose between SD, HD, UHD!" });
        return;
    }

    const date = new Date();
    const endDate = date.setMonth(date.getMonth() + 1);

    if (user.has_discount) {
      plan.price -= 2;
    }

    await subscription.update({
      start_date: Date.now(),
      end_date: endDate,
      type: plan.type,
      price: plan.price,
      description: plan.description,
    });

    response(req, res, 200, { message: "Subscription renewed succesfully!" });
    return;
  } catch (error) {
    console.log(error);
    response(req, res, 500, { error: "Internal server error" });
    return;
  }
}

//enum for subscription plans
const Plan = Object.freeze({
  SD: { plan: "SD", price: 7.99, description: "This is the standard plan." },
  HD: { plan: "HD", price: 10.99, description: "This is the medium plan." },
  UHD: { plan: "UHD", price: 13.99, description: "This is the high plan." }
});

module.exports = { getSubscriptionInfo, changeSubscription, renewSubscription };