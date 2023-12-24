const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');

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

        res.status(400).json({ message: "Please check your email to reset your password." })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
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
            return res.status(404).json({ error: 'User not found' });
        }

        existingUser.update({
            password: hashedPassword
        });

        res.status(200).json({ message: `Password has been changed.` })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { resetPasswordEmail, updatePassword }
