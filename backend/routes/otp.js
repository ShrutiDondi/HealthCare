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

  console.log('🔍 Checking SMTP config:');
  console.log('   SMTP_HOST:', SMTP_HOST);
  console.log('   SMTP_PORT:', SMTP_PORT);
  console.log('   SMTP_USER:', SMTP_USER);
  console.log('   SMTP_PASS:', SMTP_PASS ? '***' : 'NOT SET');
  console.log('   SMTP_SECURE:', SMTP_SECURE);

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || SMTP_PASS === 'your_email_app_password') {
    console.log('❌ Missing SMTP credentials');
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
      console.log('📧 OTP send request received:', req.body.email);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const email = normalizeEmail(req.body.email);
      const otp = buildOtp();
      console.log('🔑 Generated OTP for', email, ':', otp);
      const transporter = getTransporter();

      otpStore[email] = {
        otp,
        expires: Date.now() + OTP_EXPIRY_MS,
      };

      if (!transporter) {
        console.log(`\n=========================================`);
        console.log(`[DEV MODE] OTP for ${email} is: ${otp}`);
        console.log(`[DEV MODE] SMTP not configured. Check your .env file.`);
        console.log(`=========================================\n`);
        return res.json({
          message: 'SMTP not configured. Check your server console for the OTP.',
          email,
        });
      }

      console.log('📧 SMTP configured, sending email...');
      console.log(`   From: ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
      console.log(`   To: ${email}`);

      await transporter.sendMail({
        from: `Smart Health Care <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your Smart Health Care OTP',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #2563eb;">Smart Health Care Registration</h2>
            <p>Thank you for registering. Please use the following One-Time Password (OTP) to complete your registration.</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1d4ed8; background-color: #eef2ff; padding: 10px 20px; border-radius: 8px; display: inline-block;">
              ${otp}
            </p>
            <p>This OTP is valid for 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #777;">&copy; Smart Health Care. All rights reserved.</p>
          </div>
        `,
      });

      console.log(`✅ OTP email sent successfully to ${email}`);
      return res.json({
        message: `OTP sent successfully to ${email}`,
        email,
      });
    } catch (error) {
      console.error('❌ OTP send error:', error.message);
      console.error('Error details:', error);
      return res.status(500).json({
        message: 'Failed to send OTP email. Please check your SMTP credentials.',
        error: error.message
      });
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
