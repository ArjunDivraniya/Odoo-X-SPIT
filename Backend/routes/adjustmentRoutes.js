const express = require('express');
const Adjustment = require('../models/Adjustment');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => req.user.adminId || (req.user.role === 'Admin' ? req.user.id : null);

// GET All Adjustments
router.get('/', protect, async (req, res) => {
  try {
    const adjustments = await Adjustment.find({ adminId: getOwnerId(req) }).sort({ createdAt: -1 });
    res.json(adjustments);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching adjustments' });
  }
});

// POST Create Adjustment
router.post('/', protect, async (req, res) => {
  try {
    const adjustment = await Adjustment.create({ 
      ...req.body, 
      adminId: getOwnerId(req),
      performedBy: req.user.name || 'System'
    });
    res.status(201).json(adjustment);
  } catch (e) {
    res.status(500).json({ message: 'Error creating adjustment' });
  }
});

module.exports = router;