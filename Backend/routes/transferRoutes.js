const express = require('express');
const Transfer = require('../models/Transfer');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => {
  const isAdmin = req.user.role && String(req.user.role).toLowerCase() === 'admin';
  return req.user.adminId || (isAdmin ? req.user.id : null);
};

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

// PUT - HANDLES STOCK MOVEMENT
router.put('/:id', protect, async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const oldTransfer = await Transfer.findById(req.params.id);

    if (!oldTransfer) return res.status(404).json({ message: 'Transfer not found' });

    // If marking as completed, move the stock
    if (req.body.status === 'completed' && oldTransfer.status !== 'completed') {
      for (const item of oldTransfer.items) {
        const product = await Product.findOne({ name: item.product, adminId: ownerId });
        if (product) {
            const fromWh = oldTransfer.fromWarehouse;
            const toWh = oldTransfer.toWarehouse;
          
            const fromQty = product.stock.get(fromWh) || 0;
            const toQty = product.stock.get(toWh) || 0;

            // Move stock
            product.stock.set(fromWh, fromQty - item.quantity);
            product.stock.set(toWh, toQty + item.quantity);
          
            await product.save();
            try { const { getIO } = require('../socket'); const io = getIO(); if (io) io.to(String(ownerId)).emit('productsUpdated', { type: 'stock_change', product }); } catch(e){}
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