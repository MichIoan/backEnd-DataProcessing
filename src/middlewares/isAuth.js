const jwt = require('jsonwebtoken');
const sendResponse = require('../utilities/response');
const User = require('../models/user');
const { isEmail } = require('../utilities/validate');

async function isAuth(req, res, next) {
    const decoded = await verifyToken(req, res);
    if (res.headersSent) return;

    const email = decoded.email;

    if (!isEmail(email)) {
        sendResponse(req, res, 400, { error: "Email is not valid or token is malformed" });
        return;
    }

    try {
        const user = await User.findOne({
            where: {
                email: email,
            }
        });

        if (!user) {
            sendResponse(req, res, 401, { error: "No account found with this email" });
            return;
        }

        if (user.status === "locked") {
            sendResponse(req, res, 401, { message: "Your account is locked, please try again later" });
            return;
        }

        if (user.status === "not activated") {
            sendResponse(req, res, 401, { message: "Please activate your account first" });
            return;
        }

        next();
    } catch (err) {
        console.log(err);
        response(req, res, 500, { error: 'Internal server error' });
        return;
    }
}

async function verifyToken(req, res) {

    const authHeader = req.headers.authorization;
    let token;

    if (!authHeader) {
        sendResponse(req, res, 400, { error: "Please provide a token as Authorization Bearer" });
        return;
    }

    const bearer = authHeader.split(" ");
    if (bearer.length == 2 && bearer[0] === "Bearer") {
        token = bearer[1]; // Return the token
    }

    if (!token) {
        sendResponse(req, res, 400, { error: "Token not provided or Authorization header is not in the correct format." });
        return;
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            sendResponse(req, res, 403, { error: "Token expired" });
            return;
        } else {
            sendResponse(req, res, 400, { error: "Invalid token" });
            return;
        }
    }

    return decoded;
}

module.exports = isAuth;