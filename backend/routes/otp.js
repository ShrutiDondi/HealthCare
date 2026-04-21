const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const router = express.Router();
const otpStore = {};
const OTP_EXPIRY_MS = 10 * 60 * 1000;

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const buildOtp = () =>
  otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

router.post(
  '/send-otp',
  [body('email').isEmail().normalizeEmail().withMessage('Valid email required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const email = normalizeEmail(req.body.email);
      const otp = buildOtp();
      const transporter = getTransporter();

      if (!transporter) {
        return res.status(500).json({
          message: 'OTP email service is not configured on the server.',
        });
      }

      otpStore[email] = {
        otp,
        expires: Date.now() + OTP_EXPIRY_MS,
      };

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your Smart Health Care OTP',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      });

      return res.json({
        message: `OTP sent successfully to ${email}`,
        email,
      });
    } catch (error) {
      console.error('OTP send error:', error);
      return res.status(500).json({ message: 'Failed to send OTP' });
    }
  }
);

router.post(
  '/verify-otp',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid OTP required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = normalizeEmail(req.body.email);
    const { otp } = req.body;
    const otpData = otpStore[email];

    if (!otpData) {
      return res.status(400).json({ message: 'No OTP found' });
    }

    if (Date.now() > otpData.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    return res.json({ message: 'OTP verified successfully' });
  }
);

module.exports = { router, otpStore };
