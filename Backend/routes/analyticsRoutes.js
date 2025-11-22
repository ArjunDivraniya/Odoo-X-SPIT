// Backend/routes/analyticsRoutes.js
const express = require('express');
const Product = require('../models/Product');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Transfer = require('../models/Transfer');
const Adjustment = require('../models/Adjustment');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const getOwnerId = (req) => req.user.adminId || (req.user.role === 'Admin' ? req.user.id : null);

router.get('/', protect, async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    
    const [products, receipts, deliveries, transfers, adjustments] = await Promise.all([
      Product.find({ adminId: ownerId }),
      Receipt.find({ adminId: ownerId }),
      Delivery.find({ adminId: ownerId }),
      Transfer.find({ adminId: ownerId }),
      Adjustment.find({ adminId: ownerId })
    ]);

    // --- 1. Calculate KPIs ---
    let lowStockCount = 0;
    const categoryMap = {};

    products.forEach(p => {
      const totalStock = p.stock ? Array.from(p.stock.values()).reduce((a, b) => a + b, 0) : 0;
      if (totalStock <= (p.minLevel || 0)) lowStockCount++;
      categoryMap[p.category] = (categoryMap[p.category] || 0) + totalStock;
    });

    const pendingReceipts = receipts.filter(r => r.status !== 'done').length;
    const pendingDeliveries = deliveries.filter(d => d.status !== 'completed').length;
    const scheduledTransfers = transfers.filter(t => t.status !== 'completed').length;

    // Added 'change' field to match Frontend UI requirements
    const kpis = [
      { label: 'Total Products', value: products.length, icon: 'Package', trend: 'up', change: '+0%' },
      { label: 'Low Stock Items', value: lowStockCount, icon: 'AlertTriangle', trend: lowStockCount > 0 ? 'down' : 'up', change: '0%' },
      { label: 'Pending Receipts', value: pendingReceipts, icon: 'ArrowDownToLine', trend: 'neutral', change: '0%' },
      { label: 'Pending Deliveries', value: pendingDeliveries, icon: 'ArrowUpFromLine', trend: 'neutral', change: '0%' },
      { label: 'Scheduled Transfers', value: scheduledTransfers, icon: 'ArrowLeftRight', trend: 'neutral', change: '0%' },
      { label: 'Total Adjustments', value: adjustments.length, icon: 'Settings', trend: 'neutral', change: '0%' },
    ];

    // --- 2. Prepare Chart Data ---
    const categoryData = Object.keys(categoryMap).map(k => ({ name: k, value: categoryMap[k] }));

    // --- 3. Calculate Stock Trend ---
    const trendMap = {};
    const addToTrend = (dateStr, type, qty) => {
      const date = new Date(dateStr).toISOString().split('T')[0];
      if (!trendMap[date]) trendMap[date] = { date, incoming: 0, outgoing: 0 };
      trendMap[date][type] += qty;
    };

    receipts.forEach(r => {
      if (r.createdAt) addToTrend(r.createdAt, 'incoming', r.items.reduce((sum, item) => sum + (item.received || 0), 0));
    });

    deliveries.forEach(d => {
      if (d.createdAt) addToTrend(d.createdAt, 'outgoing', d.items.reduce((sum, item) => sum + (item.quantity || 0), 0));
    });

    const stockTrend = Object.values(trendMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); 

    res.json({ kpis, categoryData, stockTrend });

  } catch (e) { 
    console.error("Analytics Error:", e);
    res.status(500).json({ message: 'Error fetching analytics' }); 
  }
});

module.exports = router;