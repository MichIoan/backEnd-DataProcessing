const express = require("express");
const router = express.Router();

const subscriptionController = require("../controllers/subscriptionContoller");

router.get("/getInfo", subscriptionController.getSubscriptionInfo);

module.exports = router;
