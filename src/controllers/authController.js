const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const prepareResponse = require('../middlewares/prepareResponse');

async function isReferralCodeUnique(referralCode) {
  const existingUser = await User.findOne({
    where: {
      referral_code: referralCode,
    },
  });

  return !existingUser;
}

async function generateUniqueReferralCode(email) {
  const baseCode = email.toLowerCase(); // Use the lowercase email as a base

  let referralCode;
  let suffix = 1;

  do {
    const hashedSuffix = crypto.createHash('md5').update(suffix.toString()).digest('hex');
    referralCode = baseCode.substring(0, 8) + hashedSuffix.substring(0, 4);

    suffix++;
  } while (!(await isReferralCodeUnique(referralCode)));

  return referralCode;
}

async function checkIfUserExists(email) {
  const existingUser = await User.findOne({
    where: {
      email: email,
    },
  });

  return existingUser;
}

async function sendVerificationEmail(email, link) {
  try {
    const emailContent = `
      <p>Thank you for registering! Please click the following link to activate your account:</p>
      <a href="http://${link}">Click here to activate account!</a>
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
      subject: 'Account Verification',
      html: emailContent,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email.');
  }
}

const register = async (req, res, next) => {
  try {
    const email = req.body.email;

    // Check if the user with the provided email already exists
    const userExists = await checkIfUserExists(email);

    if (userExists) {
      prepareResponse(res, 409, { error: 'User with this email already exists' });

      return next();
    }

    const password = await bcrypt.hash(req.body.password, 10);
    const referral_code = await generateUniqueReferralCode(email);

    const token = jwt.sign({ email: req.body.email }, process.env.JWT_KEY, { expiresIn: '1d' });

    const verificationLink = `localhost:8081/auth/activateAccount?token=${token}`;
    await sendVerificationEmail(req.body.email, verificationLink);

    const newUser = await User.create({
      email: email,
      password: password,
      referral_code: referral_code,
    });

    prepareResponse(res, 201, { message: 'User registered successfully. Activate account from email!' });

    next();

  } catch (error) {
    prepareResponse(res, 500, { error: 'Internal server error' });

    next();
  }
};


const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Check if the user with the provided email exists
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      prepareResponse(res, 404, { error: 'User not found' });

      return next();
    }

    if (existingUser.status == 'not_activated') {
      prepareResponse(res, 403, { error: 'Please activate the account first' });

      next();
    }

    if (existingUser.status == "suspended") {
      const timeNow = new Date();
      if (timeNow > existingUser.locked_until) {
        existingUser.update({
          status: 'active',
          locked_until: null,
          failed_login_attempts: 0,
        })
      } else {
        prepareResponse(res, 403, { error: `Your account is locked until ${existingUser.locked_until}` });

        return next();
      }

    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    //check if password is valid and increase the counter if needed
    if (!isPasswordValid) {
      const counter = existingUser.failed_login_attempts + 1;

      //if counter is 3, block the account
      if (counter === 3) {
        const oneHourFromNow = new Date();
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

        existingUser.update({
          status: "suspended",
          locked_until: oneHourFromNow,
          failed_login_attempts: counter
        });

        prepareResponse(res, 403, { error: `You have failed to login for 3 times, you account has been locked for an hour.` });

        return next();
      }

      existingUser.update({
        failed_login_attempts: counter
      });

      const leftAttempts = 3 - counter;

      prepareResponse(res, 401, { error: `Invalid password. You have ${leftAttempts} attempts left.` });

      return next();
    }

    // If the password is valid, generate a JWT token
    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, profileId: existingUser.profileId },
      process.env.JWT_KEY, // Secret key
      { expiresIn: '1h' }
    );

    existingUser.update({
      failed_login_attempts: 0,
      locked_until: null,
    })

    prepareResponse(res, 200, { message: 'Login successful', token: token });

    return next();
  } catch (error) {
    console.error('Error during login:', error);
    prepareResponse(res, 500, { error: 'Internal server error' });
  }
};

const emailVerification = async (req, res) => {
  const token = req.query.token;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const userEmail = decoded.email;

    User.update(
      { status: 'activated' },
      {
        where: {
          email: userEmail,
        },
      }
    )

    prepareResponse(res, 200, { message: 'Account activated successfully' });
  } catch (error) {
    console.error('Error activating account:', error);
    prepareResponse(res, 400, { error: 'Invalid or expired token.' });
  }
};

module.exports = { emailVerification, register, login };