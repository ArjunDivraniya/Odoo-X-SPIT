const express = require('express');
const Transfer = require('../models/Transfer');
const Product = require('../models/Product'); // Import Product Model
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => req.user.adminId || (req.user.role === 'Admin' ? req.user.id : null);

router.get('/', protect, async (req, res) => {
  try {
    const transfers = await Transfer.find({ adminId: getOwnerId(req) }).sort({ createdAt: -1 });
    res.json(transfers);
  } catch (e) { res.status(500).json({ message: 'Error fetching transfers' }); }
});

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

// PUT Update - INCLUDES STOCK MOVEMENT
router.put('/:id', protect, async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) return res.status(404).json({ message: 'Transfer not found' });

    // Check if status is changing to 'completed'
    if (req.body.status === 'completed' && transfer.status !== 'completed') {
      const ownerId = transfer.adminId;

      for (const item of transfer.items) {
        const product = await Product.findOne({ name: item.product, adminId: ownerId });
        
        if (product) {
          const fromStock = product.stock.get(transfer.fromWarehouse) || 0;
          const toStock = product.stock.get(transfer.toWarehouse) || 0;

          // Deduct from Source
          product.stock.set(transfer.fromWarehouse, Math.max(0, fromStock - item.quantity));
          // Add to Destination
          product.stock.set(transfer.toWarehouse, toStock + item.quantity);
          
          await product.save();
        }
      }
    }

    const updatedTransfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTransfer);
  } catch (e) { 
    console.error(e);
    res.status(500).json({ message: 'Error updating transfer' }); 
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Transfer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transfer deleted' });
  } catch (e) { res.status(500).json({ message: 'Error deleting transfer' }); }
});

module.exports = router;