const express = require('express');
const Warehouse = require('../models/Warehouse');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Get All Warehouses (For Selection Page)
router.get('/', protect, async (req, res) => {
  const warehouses = await Warehouse.find();
  res.json(warehouses);
});

// Create Warehouse (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, location, description } = req.body;
  
  const warehouse = await Warehouse.create({
    name,
    location,
    description,
    adminId: req.user.id
  });

  res.status(201).json(warehouse);
});

module.exports = router;