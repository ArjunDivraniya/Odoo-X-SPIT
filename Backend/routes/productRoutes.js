const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper to get owner ID
const getOwnerId = (req) => {
  const isAdmin = req.user.role && String(req.user.role).toLowerCase() === 'admin';
  return req.user.adminId || (isAdmin ? req.user.id : null);
};
const { getIO } = require('../socket');

// @route   GET /api/products
// @desc    Get all products for the logged-in business
router.get('/', protect, async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.json([]);

    const products = await Product.find({ adminId: ownerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const { name, sku, category, unit, image, minLevel, maxLevel, stock } = req.body;

    // Check if SKU exists for this admin
    const exists = await Product.findOne({ sku, adminId: ownerId });
    if (exists) return res.status(400).json({ message: 'Product with this SKU already exists' });

    const product = await Product.create({
      name, sku, category, unit, image, 
      minLevel, maxLevel, stock,
      adminId: ownerId
    });

    // Emit product created to admin room
    try { const io = getIO(); if (io) io.to(String(ownerId)).emit('productsUpdated', { type: 'created', product }); } catch(e){ }
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, sku, category, unit, image, minLevel, maxLevel, stock } = req.body;

    product.name = name || product.name;
    product.sku = sku || product.sku;
    product.category = category || product.category;
    product.unit = unit || product.unit;
    product.image = image || product.image;
    product.minLevel = minLevel !== undefined ? minLevel : product.minLevel;
    product.maxLevel = maxLevel !== undefined ? maxLevel : product.maxLevel;
    
    // Update stock if provided
    if (stock) {
      product.stock = stock;
    }

    await product.save();
    // Emit product updated
    try { const io = getIO(); if (io) io.to(String(product.adminId)).emit('productsUpdated', { type: 'updated', product }); } catch(e){}
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;