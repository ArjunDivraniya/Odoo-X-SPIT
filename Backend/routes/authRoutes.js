const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');
const router = express.Router();

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// 1. Send OTP (For Signup & Forgot Password)
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
  
  await Otp.create({ email, otp });

  // In production, uncomment this to send real email
  // await transporter.sendMail({ to: email, subject: 'StockMaster OTP', text: `Your OTP is ${otp}` });

  // Sending real email now
await transporter.sendMail({ 
  from: process.env.EMAIL_USER, // It's good practice to specify 'from'
  to: email, 
  subject: 'StockMaster OTP', 
  text: `Your OTP is ${otp}` 
});
  
  console.log(`MOCK EMAIL TO ${email}: Your OTP is ${otp}`); // For testing
  res.json({ message: 'OTP sent successfully' });
});

// 2. Admin Signup (Verify OTP first)
router.post('/signup', async (req, res) => {
  const { fullName, email, password, otp } = req.body;

  // Verify OTP
  const validOtp = await Otp.findOne({ email, otp });
  if (!validOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create Admin
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: 'admin', // Hardcoded as per requirement 1
    isVerified: true
  });

  await Otp.deleteMany({ email }); // Cleanup OTPs

  res.status(201).json({ message: 'Admin registered successfully' });
});

// 3. Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, name: user.fullName, role: user.role } });
});

module.exports = router;