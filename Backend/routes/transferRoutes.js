const express = require('express');
const Transfer = require('../models/Transfer');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => req.user.adminId || (req.user.role === 'Admin' ? req.user.id : null);

// GET All Transfers
router.get('/', protect, async (req, res) => {
  try {
    const transfers = await Transfer.find({ adminId: getOwnerId(req) }).sort({ createdAt: -1 });
    res.json(transfers);
  } catch (e) { res.status(500).json({ message: 'Error fetching transfers' }); }
});

// POST Create Transfer
router.post('/', protect, async (req, res) => {
  try {
    const transfer = await Transfer.create({ 
      ...req.body, 
      adminId: getOwnerId(req), 
      createdBy: req.user.name || 'System',
      status: 'requested'
    });
    res.status(201).json(transfer);
  } catch (e) { res.status(500).json({ message: 'Error creating transfer' }); }
});

// PUT Update Transfer (e.g., mark as completed)
router.put('/:id', protect, async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(transfer);
  } catch (e) { res.status(500).json({ message: 'Error updating transfer' }); }
});

// DELETE Transfer
router.delete('/:id', protect, async (req, res) => {
  try {
    await Transfer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transfer deleted' });
  } catch (e) { res.status(500).json({ message: 'Error deleting transfer' }); }
});

module.exports = router;