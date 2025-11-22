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

// @route   POST /api/staff/create
// @desc    Admin creates a new user/staff member
router.post('/create', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, role, warehouses, phone, status } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const randomPassword = otpGenerator.generate(10, { upperCaseAlphabets: true, specialChars: true, digits: true, lowerCaseAlphabets: true });
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

    // CRITICAL FIX: Link new user to the current Admin's business
    // req.user.adminId comes from the JWT token we updated in authRoutes
    const businessOwnerId = req.user.role === 'Admin' ? req.user.id : req.user.adminId;

    const newUser = await User.create({
      fullName: name,
      email,
      password: hashedPassword,
      role: role || 'Warehouse Staff',
      warehouses: warehouses || [],
      phone: phone || '',
      status: status || 'active',
      avatar: avatarUrl,
      isVerified: true,
      adminId: businessOwnerId // Link to the creating Admin
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to StockMaster - Your Login Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #2563eb;">Welcome to StockMaster!</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your account has been successfully created.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${randomPassword}</p>
          </div>
          <a href="http://localhost:5173/login">Login Now</a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      message: 'User created successfully',
      user: { ...newUser._doc, id: newUser._id } // Ensure id is returned
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
});

// @route   GET /api/staff
// @desc    Get all users associated with the current Admin's business
router.get('/', protect, async (req, res) => {
  try {
    // CRITICAL FIX: Filter by adminId.
    // If I am an Admin, my adminId is my own ID (set during signup).
    // If I am Staff, my adminId points to my boss.
    // In both cases, req.user.adminId (from token) groups us together.
    
    // Fallback: if req.user.adminId isn't in token yet (old token), use req.user.id if admin
    const ownerId = req.user.adminId || (req.user.role === 'Admin' || req.user.role === 'admin' ? req.user.id : null);

    if (!ownerId) {
      return res.status(400).json({ message: 'Unable to determine business owner' });
    }

    // Find all users that belong to this Admin ID
    const users = await User.find({ adminId: ownerId })
      .select('-password')
      .sort({ createdAt: -1 });
    
    const formattedUsers = users.map(user => ({
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
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;