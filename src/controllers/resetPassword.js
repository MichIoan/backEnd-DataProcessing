const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const prepareResponse = require('../utilities/response');

const resetPasswordEmail = async (req, res) => {
    try {
        const email = req.body.email;

        const existingUser = await User.findOne({
            where: {
                email: email,
            },
        });

        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        const resetPasswordLink = `localhost:8081/passwordReset/resetPassword?token=${token}`;
        await sendResetPassEmail(req.body.email, resetPasswordLink);

        prepareResponse(res, 200, { message: 'Please check your email to reset your password.' });

        return next();
    } catch (error) {
        console.error(error);
        prepareResponse(res, 500, { error: 'Internal server error' });
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
    const token = req.query.token;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const email = decoded.email;

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (!existingUser) {
            prepareResponse(res, 404, { error: 'User not found' });

            return next();
        }

        existingUser.update({
            password: hashedPassword
        });

        prepareResponse(res, 200, { message: `Password has been changed.` });

        return next();

    } catch (error) {
        console.error(error);
        prepareResponse(res, 500, { error: 'Internal server error' });

        return next();
    }
}

module.exports = { resetPasswordEmail, updatePassword }
