const express = require('express');
const Warehouse = require('../models/WareHouse');
const User = require('../models/User');
const Product = require('../models/Product');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   GET /api/warehouse
// @desc    Get Warehouses with Real-Time Stats
router.get('/', protect, async (req, res) => {
  try {
    // Determine the owner ID (Admin)
    const ownerId = req.user.adminId || (req.user.role === 'Admin' || req.user.role === 'admin' ? req.user.id : null);

    if (!ownerId) {
       return res.json([]); 
    }

    // 1. Fetch all warehouses for this admin
    const warehouses = await Warehouse.find({ adminId: ownerId });

    // 2. Calculate stats dynamically for each warehouse
    // We use Promise.all to run these calculations in parallel for performance
    const warehousesWithStats = await Promise.all(warehouses.map(async (wh) => {
      const whId = wh._id.toString();

      // A. Count Staff assigned to this warehouse
      const staffCount = await User.countDocuments({ 
        adminId: ownerId,
        warehouses: whId 
      });

      // B. Calculate Inventory Stats (Total Items & Low Stock)
      // We fetch all products and sum up the stock for this specific warehouse
      const products = await Product.find({ adminId: ownerId });
      let totalItems = 0;
      let lowStock = 0;

      products.forEach(p => {
        // Access the Map using .get() since stock is a Mongoose Map
        const qty = p.stock ? (p.stock.get(whId) || 0) : 0;
        totalItems += qty;
        
        if (qty > 0 && qty <= (p.minLevel || 0)) {
          lowStock++;
        }
      });

      // C. Count Pending Receipts (Incoming)
      const receipts = await Receipt.countDocuments({ 
        adminId: ownerId, 
        warehouse: whId, 
        status: { $ne: 'done' } 
      });

      // D. Count Pending Deliveries (Outgoing)
      const deliveries = await Delivery.countDocuments({ 
        adminId: ownerId, 
        warehouse: whId, 
        status: { $ne: 'completed' } 
      });

      // Return the warehouse object with the new dynamic stats
      return {
        ...wh.toObject(),
        stats: {
          totalItems,
          staffCount,
          lowStock,
          receipts,
          deliveries
        }
      };
    }));

    res.json(warehousesWithStats);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    res.status(500).json({ message: 'Error fetching warehouses' });
  }
});

// @route   POST /api/warehouse
// @desc    Create Warehouse (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const ownerId = req.user.adminId || req.user.id;

    if (!ownerId) {
        return res.status(400).json({ message: "Could not determine warehouse owner." });
    }

    const warehouse = await Warehouse.create({
      name,
      location,
      description,
      adminId: ownerId,
      stats: { // Initial stats are 0
        totalItems: 0,
        lowStock: 0,
        receipts: 0,
        deliveries: 0,
        staffCount: 0
      }
    });

    res.status(201).json(warehouse);
  } catch (error) {
    console.error("Error creating warehouse:", error);
    res.status(500).json({ message: 'Error creating warehouse' });
  }
});

module.exports = router;