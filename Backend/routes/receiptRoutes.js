const express = require('express');
const Receipt = require('../models/Receipt');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => req.user.adminId || (req.user.role === 'Admin' ? req.user.id : null);

// GET All (Read)
router.get('/', protect, async (req, res) => {
  try {
    const receipts = await Receipt.find({ adminId: getOwnerId(req) }).sort({ createdAt: -1 });
    res.json(receipts);
  } catch (e) { res.status(500).json({ message: 'Error fetching receipts' }); }
});

// POST (Create)
router.post('/', protect, async (req, res) => {
  try {
    const receipt = await Receipt.create({ ...req.body, adminId: getOwnerId(req), createdBy: req.user.name || 'System' });
    res.status(201).json(receipt);
  } catch (e) { res.status(500).json({ message: 'Error creating receipt' }); }
});

// PUT (Update)
router.put('/:id', protect, async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(receipt);
  } catch (e) { res.status(500).json({ message: 'Error updating receipt' }); }
});

// DELETE (Delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Receipt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Receipt deleted' });
  } catch (e) { res.status(500).json({ message: 'Error deleting receipt' }); }
});

module.exports = router;