const express = require('express');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

// Helper to format user for frontend
const formatUser = (user) => ({
  id: user._id,
  name: user.fullName,
  email: user.email,
  role: user.role,
  warehouses: user.warehouses,
  phone: user.phone,
  status: user.status,
  avatar: user.avatar,
  createdOn: user.createdAt,
  activities: user.activities || []
});

// @route   POST /api/staff/create
// @desc    Create User
router.post('/create', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, role, warehouses, phone, status } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const randomPassword = otpGenerator.generate(10, { upperCaseAlphabets: true, specialChars: true, digits: true });
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    
    // Link to creator (Admin) - support case-insensitive role values
    const isAdminRole = req.user.role && String(req.user.role).toLowerCase() === 'admin';
    const businessOwnerId = isAdminRole ? req.user.id : req.user.adminId;

    const newUser = await User.create({
      fullName: name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'Warehouse Staff',
      warehouses: warehouses || [],
      phone: phone || '',
      status: status || 'active',
      avatar: avatarUrl,
      isVerified: true,
      adminId: businessOwnerId
    });

    // Try sending email (don't crash if it fails)
    try {
      if(process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Welcome to StockMaster',
          html: `<p>Login with: <strong>${email}</strong> / <strong>${randomPassword}</strong></p>`
        });
      }
    } catch (e) { console.log("Email skipped:", e.message); }

    res.status(201).json({ 
      message: 'User created successfully',
      user: formatUser(newUser) 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/staff
// @desc    Get Users
router.get('/', protect, async (req, res) => {
  try {
    const isAdmin = req.user.role && String(req.user.role).toLowerCase() === 'admin';
    const ownerId = req.user.adminId || (isAdmin ? req.user.id : null);
    if (!ownerId) return res.json([]); 

    const users = await User.find({ adminId: ownerId }).sort({ createdAt: -1 });
    res.json(users.map(formatUser));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// @route   PUT /api/staff/:id
// @desc    Update User (CRITICAL FOR EDIT)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (req.body.name) user.fullName = req.body.name;
    if (req.body.role) user.role = req.body.role;
    if (req.body.warehouses) user.warehouses = req.body.warehouses;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.status) user.status = req.body.status;

    await user.save();
    res.json({ message: 'User updated', user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// @route   DELETE /api/staff/:id
// @desc    Delete User
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;