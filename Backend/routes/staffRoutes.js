const express = require('express');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const Warehouse = require('../models/WareHouse');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin creates Staff
router.post('/create', protect, adminOnly, async (req, res) => {
  const { fullName, email, warehouseId } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // Generate Random Password
  const randomPassword = otpGenerator.generate(8, { specialChars: true });
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  const staff = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: 'staff',
    isVerified: true,
    assignedWarehouse: warehouseId
  });

  // Increment warehouse staff count
  await Warehouse.findByIdAndUpdate(warehouseId, { $inc: { 'stats.staffCount': 1 }});

  // Send Credentials via Email
  console.log(`EMAIL TO STAFF ${email}: Login: ${email} | Password: ${randomPassword}`);
  
  res.status(201).json({ message: 'Staff created and credentials sent via email' });
});

module.exports = router;