const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { MailtrapClient } = require('mailtrap');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');
const router = express.Router();

const mailtrapToken = process.env.MAILTRAP_TOKEN;
const mailtrapClient = mailtrapToken ? new MailtrapClient({ token: mailtrapToken }) : null;
const mailtrapSender = {
  email: process.env.MAILTRAP_SENDER_EMAIL || 'hello@demomailtrap.co',
  name: process.env.MAILTRAP_SENDER_NAME || 'StockMaster'
};

const gmailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
const gmailTransporter = gmailConfigured
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : null;

async function sendOtpEmail(to, otp, subject) {
  if (mailtrapClient) {
    await mailtrapClient.send({
      from: mailtrapSender,
      to: [{ email: to }],
      subject,
      text: `Your OTP is ${otp}`,
      category: 'StockMaster OTP'
    });
    return;
  }

  if (gmailTransporter) {
    await gmailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: `Your OTP is ${otp}`
    });
    return;
  }

  throw new Error('No email provider configured. Set MAILTRAP_TOKEN or EMAIL_USER/EMAIL_PASS.');
}

// 1. Send OTP (For Signup)
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!mailtrapClient && !gmailTransporter) {
      return res.status(500).json({
        message: 'No email provider configured. Set MAILTRAP_TOKEN or EMAIL_USER/EMAIL_PASS.'
      });
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    // Keep only one active OTP per email for predictable verification.
    await Otp.deleteMany({ email: normalizedEmail });
    await Otp.create({ email: normalizedEmail, otp });

    await sendOtpEmail(normalizedEmail, otp, 'StockMaster OTP');

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      message: 'Failed to send OTP email. Check your Mailtrap token and sender configuration.'
    });
  }
});

// 2. Admin Signup
router.post('/signup', async (req, res) => {
  const { fullName, email, password, otp } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  const validOtp = await Otp.findOne({ email: normalizedEmail, otp });
  if (!validOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create Admin
  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'Admin', // Normalized to match frontend enum usually
    isVerified: true
  });
  
  // Ideally, an Admin owns themselves or is the root. 
  // We can set adminId to their own ID to simplify querying later.
  user.adminId = user._id;
  await user.save();

  await Otp.deleteMany({ email: normalizedEmail });

  res.status(201).json({ message: 'Admin registered successfully' });
});

// 3. Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Include adminId in token so we know which "Business" this user belongs to
  // Normalize role and ensure adminId fallback for Admin users
  const isAdmin = user.role && String(user.role).toLowerCase() === 'admin';
  const tokenAdminId = user.adminId || (isAdmin ? user._id : undefined);

  const token = jwt.sign(
    { id: user._id, role: user.role, adminId: tokenAdminId },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.fullName,
      role: user.role,
      email: user.email,
      adminId: tokenAdminId // Ensure frontend receives a usable adminId
    }
  });
});

// 4. Forgot Password - Send Reset OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    
    // Clear any existing OTPs for this email to avoid confusion
    await Otp.deleteMany({ email: normalizedEmail });
    
    // Save new OTP
    await Otp.create({ email: normalizedEmail, otp });

    // Send Email
    try {
      await sendOtpEmail(normalizedEmail, otp, 'Reset Your Password - StockMaster');
      console.log(`RESET OTP TO ${normalizedEmail}: ${otp}`); 
      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error("Email send error:", error);
      res.status(500).json({ message: 'Error sending email through Mailtrap' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. Reset Password with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    // Verify OTP
    const validOtp = await Otp.findOne({ email: normalizedEmail, otp });
    if (!validOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Update User Password
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Cleanup used OTP
    await Otp.deleteMany({ email: normalizedEmail });

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;