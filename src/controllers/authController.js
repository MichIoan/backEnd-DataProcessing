const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const response = require('../utilities/response');
const { isEmail, isValidPassword } = require('../utilities/validate');
const checkReferralCode = require('../utilities/checkReferralCode');
const Subscription = require('../models/subscription');

const register = async (req, res) => {
  try {
    const email = req.body.email;
    const discountCode = req.body.discountCode;

    if (!isEmail(email)) {
      response(req, res, 401, { error: "Invalid email format!" });
      return;
    }

    const userExists = await checkIfUserExists(email);

    if (userExists) {
      response(req, res, 401, { error: 'User with this email already exists' });
      return;
    }

    if (!isValidPassword(req.body.password)) {
      response(req, res, 401, { error: "Password must contain at least 1 capital, a number and 6 characters" });
      return;
    }

    let hasDiscount;
    if (checkReferralCode(discountCode)) {
      hasDiscount = true;
    }

    const password = await bcrypt.hash(req.body.password, 10);
    const referral_code = await generateUniqueReferralCode(email);
    const token = jwt.sign({ email: req.body.email }, process.env.JWT_KEY, { expiresIn: '1d' });
    const verificationLink = `localhost:8081/auth/activate?token=${token}`;

    await sendVerificationEmail(req.body.email, verificationLink);

    const newUser = await User.create({
      email: email,
      password: password,
      referral_code: referral_code,
      has_discount: hasDiscount,
    });

    if (!newUser) {
      response(req, res, 400, { error: "Error while creating the account, please try again" });
      return;
    }

    response(req, res, 201, { message: 'User registered successfully. Activate account from email!' });
    return;
  } catch (error) {
    console.log(error);
    response(req, res, 500, { error: 'Internal server error' });
    return;
  }
}

const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!isEmail(email)) {
      response(req, res, 401, { error: "Invalid email format" });
      return;
    }

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      response(req, res, 404, { error: 'User not found' });
      return;
    }

    if (existingUser.status == 'not_activated') {
      response(req, res, 403, { error: 'Please activate the account first' });
      return;
    }

    const timeNow = new Date();
    if (existingUser.status == "suspended") {
      if (timeNow > existingUser.locked_until) {
        existingUser.update({
          status: 'active',
          locked_until: null,
          failed_login_attempts: 0,
        })
      } else {
        response(req, res, 403, { error: `Your account is locked until ${existingUser.locked_until}` });
        return;
      }
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      const counter = existingUser.failed_login_attempts + 1;

      if (counter === 3) {
        const oneHourFromNow = new Date();
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

        existingUser.update({
          status: "suspended",
          locked_until: oneHourFromNow,
          failed_login_attempts: counter
        });

        response(req, res, 403, { error: `You have failed to login for 3 times, you account has been locked for an hour.` });
        return;
      }

      existingUser.update({
        failed_login_attempts: counter,
      });

      const leftAttempts = 3 - counter;

      response(req, res, 401, { error: `Invalid password. You have ${leftAttempts} attempts left.` });
      return;
    }

    const userSub = await Subscription.findOne({
      where: {
        user_id: existingUser.user_id,
      }
    });

    const end_date = new Date(userSub.end_date);

    if (end_date < timeNow) {
      console.log('EXPIRED');
      await userSub.update({
        status: 'inactive'
      });
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '24h' }
    );

    existingUser.update({
      failed_login_attempts: 0,
      locked_until: null,
    })

    response(req, res, 200, { message: 'Login successful', token: token });
    return;
  } catch (error) {
    console.log(error);
    response(req, res, 500, { error: 'Internal server error' });
    return;
  }
}

const emailVerification = async (req, res) => {
  const token = req.query.token;

  try {
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

    response(req, res, 200, { message: 'Account activated successfully' });
    return;
  } catch (error) {
    response(req, res, 400, { error: 'Invalid or expired token.' });
    return;
  }
}

async function isReferralCodeUnique(referralCode) {
  const existingUser = await User.findOne({
    where: {
      referral_code: referralCode,
    },
  });

  return !existingUser;
}

async function generateUniqueReferralCode(email) {
  const baseCode = email.toLowerCase();

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

module.exports = { emailVerification, register, login };