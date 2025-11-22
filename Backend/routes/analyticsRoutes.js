const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => req.user.adminId || (req.user.role === 'Admin' ? req.user.id : null);

router.get('/', protect, async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const products = await Product.find({ adminId: ownerId });
    
    // 1. Stock by Category
    const categoryMap = {};
    products.forEach(p => {
      const total = p.stock ? Array.from(p.stock.values()).reduce((a, b) => a + b, 0) : 0;
      categoryMap[p.category] = (categoryMap[p.category] || 0) + total;
    });
    const categoryData = Object.keys(categoryMap).map(k => ({ name: k, value: categoryMap[k] }));

    // 2. Mock Turnover/Performance (Real calculation requires order history)
    const turnoverData = [
      { month: 'Jan', turnover: 2.3 }, { month: 'Feb', turnover: 2.5 },
      { month: 'Mar', turnover: 2.8 }, { month: 'Apr', turnover: 2.4 },
      { month: 'May', turnover: 3.1 }, { month: 'Jun', turnover: 2.9 }
    ];
    const warehousePerformance = [
      { warehouse: 'Main', efficiency: 92, accuracy: 95, speed: 88 },
      { warehouse: 'Factory', efficiency: 88, accuracy: 91, speed: 85 },
    ];

    res.json({ categoryData, turnoverData, warehousePerformance });
  } catch (e) { res.status(500).json({ message: 'Error fetching analytics' }); }
});

module.exports = router;