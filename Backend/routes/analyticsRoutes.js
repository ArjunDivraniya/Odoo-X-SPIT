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
    
    // Fetch all necessary data in parallel
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
      // Calculate total stock for this product across all warehouses
      const totalStock = p.stock ? Array.from(p.stock.values()).reduce((a, b) => a + b, 0) : 0;
      
      // Check Low Stock (if total is less than minLevel)
      if (totalStock <= (p.minLevel || 0)) {
        lowStockCount++;
      }

      // Aggregate Category Data
      categoryMap[p.category] = (categoryMap[p.category] || 0) + totalStock;
    });

    const pendingReceipts = receipts.filter(r => r.status !== 'done').length;
    const pendingDeliveries = deliveries.filter(d => d.status !== 'completed').length;
    const scheduledTransfers = transfers.filter(t => t.status !== 'completed').length;

    const kpis = [
      { label: 'Total Products', value: products.length, icon: 'Package', trend: 'neutral' },
      { label: 'Low Stock Items', value: lowStockCount, icon: 'AlertTriangle', trend: lowStockCount > 0 ? 'down' : 'up' },
      { label: 'Pending Receipts', value: pendingReceipts, icon: 'ArrowDownToLine', trend: 'neutral' },
      { label: 'Pending Deliveries', value: pendingDeliveries, icon: 'ArrowUpFromLine', trend: 'neutral' },
      { label: 'Scheduled Transfers', value: scheduledTransfers, icon: 'ArrowLeftRight', trend: 'neutral' },
      { label: 'Total Adjustments', value: adjustments.length, icon: 'Settings', trend: 'neutral' },
    ];

    // --- 2. Prepare Chart Data (Stock by Category) ---
    const categoryData = Object.keys(categoryMap).map(k => ({ name: k, value: categoryMap[k] }));

    // --- 3. Calculate Stock Trend (Incoming vs Outgoing over time) ---
    // We will group receipts and deliveries by date (YYYY-MM-DD)
    const trendMap = {};

    // Helper to add to trend map
    const addToTrend = (dateStr, type, qty) => {
      const date = new Date(dateStr).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!trendMap[date]) trendMap[date] = { date, incoming: 0, outgoing: 0 };
      trendMap[date][type] += qty;
    };

    // Process Receipts (Incoming)
    receipts.forEach(r => {
      if (r.createdAt) {
        const totalReceived = r.items.reduce((sum, item) => sum + (item.received || 0), 0);
        addToTrend(r.createdAt, 'incoming', totalReceived);
      }
    });

    // Process Deliveries (Outgoing)
    deliveries.forEach(d => {
      if (d.createdAt) {
        const totalDelivered = d.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        addToTrend(d.createdAt, 'outgoing', totalDelivered);
      }
    });

    // Convert map to array and sort by date (last 30 entries max to keep chart clean)
    const stockTrend = Object.values(trendMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); 

    res.json({ 
      kpis, 
      categoryData, 
      stockTrend 
    });

  } catch (e) { 
    console.error("Analytics Error:", e);
    res.status(500).json({ message: 'Error fetching analytics' }); 
  }
});

module.exports = router;