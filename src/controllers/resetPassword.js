const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const response = require('../utilities/response');
const { isValidInt, isValidPassword } = require('../utilities/validate');

const resetPasswordEmail = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!isValidInt(userId)) {
            response(req, res, 400, { message: "URL parameter is not a valid integer" });
            return;
        }

        const existingUser = await User.findOne({
            where: {
                user_id: userId,
            },
        });

        if (!existingUser) {
            response(req, res, 401, { error: "No user has been found for this email" });
            return;
        }

        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        const resetPasswordLink = `localhost:8081/passwordReset/resetPassword?token=${token}`;
        await sendResetPassEmail(req.body.email, resetPasswordLink);

        response(req, res, 200, { message: 'Please check your email to reset your password.' });
        return;
    } catch (error) {
        console.error(error);
        response(req, res, 500, { error: 'Internal server error' });
        return;
    }
}

async function sendResetPassEmail(email, link) {
    try {
        const emailContent = `
        <p> The link is available for only one hour! </p>
        <a href="http://${link}">Click here to reset your password!</a>
      `;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASSWORD,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: 'aab989399@gmail.com',
            to: email,
            subject: 'Password reset',
            html: emailContent,
        });
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email.');
    }
}

const updatePassword = async (req, res) => {

    if (!req.body.password) {
        response(req, res, 400, { message: "The new password has to be sent in the request body" });
        return;
    }

    if (!isValidPassword(req.body.password)) {
        response(req, res, 400, { message: "Password should contain one capital, 6 character and a number!" });
        return;
    };

    const token = req.query.token;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (!token) {
        response(req, res, 403, { message: "No token has been found in the URL" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const email = decoded.email;
        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (!existingUser) {
            response(req, res, 401, { error: 'User not found' });
            return;
        }

        existingUser.update({
            password: hashedPassword
        });

        response(req, res, 200, { message: `Password has been changed.` });
        return;
    } catch (error) {
        console.error(error);
        response(req, res, 500, { error: 'Internal server error' });
        return;
    }
}

module.exports = { resetPasswordEmail, updatePassword }
