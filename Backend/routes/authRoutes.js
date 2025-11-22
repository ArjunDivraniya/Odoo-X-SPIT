const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// 1. Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
  await Otp.create({ email, otp });

  await transporter.sendMail({ 
    from: process.env.EMAIL_USER, 
    to: email, 
    subject: 'StockMaster OTP', 
    text: `Your OTP is ${otp}` 
  });
  
  console.log(`MOCK EMAIL TO ${email}: Your OTP is ${otp}`);
  res.json({ message: 'OTP sent successfully' });
});

// 2. Admin Signup
router.post('/signup', async (req, res) => {
  const { fullName, email, password, otp } = req.body;

  const validOtp = await Otp.findOne({ email, otp });
  if (!validOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create Admin
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: 'Admin', // Normalized to match frontend enum usually
    isVerified: true
  });
  
  // Ideally, an Admin owns themselves or is the root. 
  // We can set adminId to their own ID to simplify querying later.
  user.adminId = user._id;
  await user.save();

  await Otp.deleteMany({ email });

  res.status(201).json({ message: 'Admin registered successfully' });
});

// 3. Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

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

module.exports = router;