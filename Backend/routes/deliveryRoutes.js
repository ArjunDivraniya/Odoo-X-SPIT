const express = require('express');
const Delivery = require('../models/Delivery');
const Product = require('../models/Product'); // Import Product Model
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

// PUT Update - INCLUDES STOCK DEDUCTION
router.put('/:id', protect, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    // Check if status is being changed to 'completed'
    if (req.body.status === 'completed' && delivery.status !== 'completed') {
      const ownerId = delivery.adminId;

      for (const item of delivery.items) {
        const product = await Product.findOne({ name: item.product, adminId: ownerId });
        
        if (product) {
          const currentStock = product.stock.get(delivery.warehouse) || 0;
          // Ensure we don't go below zero (optional safety check)
          const newStock = Math.max(0, currentStock - item.quantity);
          
          product.stock.set(delivery.warehouse, newStock);
          await product.save();
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