const express = require('express');
const Receipt = require('../models/Receipt');
const Product = require('../models/Product'); // Import Product Model
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => {
  const isAdmin = req.user.role && String(req.user.role).toLowerCase() === 'admin';
  return req.user.adminId || (isAdmin ? req.user.id : null);
};

// GET All
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
    
    // If creating immediately as 'done' (rare but possible), update stock
    if (req.body.status === 'done') {
      for (const item of req.body.items) {
        const product = await Product.findOne({ name: item.product, adminId: getOwnerId(req) });
        if (product) {
          const currentQty = product.stock.get(req.body.warehouse) || 0;
          product.stock.set(req.body.warehouse, currentQty + (item.received || item.ordered));
          await product.save();
          try { const { getIO } = require('../socket'); const io = getIO(); if (io) io.to(String(ownerId)).emit('productsUpdated', { type: 'stock_change', product }); } catch(e){}
        }
      }
    }
    
    res.status(201).json(receipt);
  } catch (e) { res.status(500).json({ message: 'Error creating receipt' }); }
});

// PUT (Update) - INCLUDES STOCK UPDATE LOGIC
router.put('/:id', protect, async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ message: 'Receipt not found' });

    // Check if status is being changed to 'done' and it wasn't done before
    if (req.body.status === 'done' && receipt.status !== 'done') {
      const ownerId = receipt.adminId;
      
      // Iterate over items to update product stock
      for (const item of receipt.items) {
        const product = await Product.findOne({ name: item.product, adminId: ownerId });
        
        if (product) {
          // Get current stock for the warehouse, default to 0 if undefined
          const currentStock = product.stock.get(receipt.warehouse) || 0;
          // Use received quantity if available, otherwise ordered quantity
          const qtyToAdd = item.received > 0 ? item.received : item.ordered;
          
          product.stock.set(receipt.warehouse, currentStock + qtyToAdd);
          await product.save();
        }
      }
    }

    // Proceed with normal update
    const updatedReceipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReceipt);
  } catch (e) { 
    console.error(e);
    res.status(500).json({ message: 'Error updating receipt' }); 
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    await Receipt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Receipt deleted' });
  } catch (e) { res.status(500).json({ message: 'Error deleting receipt' }); }
});

module.exports = router;