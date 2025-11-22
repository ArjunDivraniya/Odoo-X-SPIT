const express = require('express');
const Delivery = require('../models/Delivery');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => req.user.adminId || (req.user.role === 'Admin' ? req.user.id : null);

router.get('/', protect, async (req, res) => {
  try {
    const deliveries = await Delivery.find({ adminId: getOwnerId(req) }).sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (e) { res.status(500).json({ message: 'Error fetching deliveries' }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const delivery = await Delivery.create({ ...req.body, adminId: getOwnerId(req), createdBy: req.user.name || 'System' });
    res.status(201).json(delivery);
  } catch (e) { res.status(500).json({ message: 'Error creating delivery' }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(delivery);
  } catch (e) { res.status(500).json({ message: 'Error updating delivery' }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Delivery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Delivery deleted' });
  } catch (e) { res.status(500).json({ message: 'Error deleting delivery' }); }
});

module.exports = router;