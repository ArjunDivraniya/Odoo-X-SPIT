const express = require('express');
const Delivery = require('../models/Delivery');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => {
  const isAdmin = req.user.role && String(req.user.role).toLowerCase() === 'admin';
  return req.user.adminId || (isAdmin ? req.user.id : null);
};

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

// PUT - HANDLES STOCK DEDUCTION
router.put('/:id', protect, async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const oldDelivery = await Delivery.findById(req.params.id);
    
    if (!oldDelivery) return res.status(404).json({ message: 'Delivery not found' });

    // Check if status is changing to 'completed'
    if (req.body.status === 'completed' && oldDelivery.status !== 'completed') {
      for (const item of oldDelivery.items) {
        const product = await Product.findOne({ name: item.product, adminId: ownerId });
        if (product) {
          const warehouseId = oldDelivery.warehouse;
          const currentQty = product.stock.get(warehouseId) || 0;
          // Decrease stock
          product.stock.set(warehouseId, currentQty - item.quantity);
          await product.save();
          try { const { getIO } = require('../socket'); const io = getIO(); if (io) io.to(String(ownerId)).emit('productsUpdated', { type: 'stock_change', product }); } catch(e){}
        }
      }
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDelivery);
  } catch (e) { 
    console.error(e);
    res.status(500).json({ message: 'Error updating delivery' }); 
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Delivery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Delivery deleted' });
  } catch (e) { res.status(500).json({ message: 'Error deleting delivery' }); }
});

module.exports = router;