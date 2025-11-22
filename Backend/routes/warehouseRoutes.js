const express = require('express');
const Warehouse = require('../models/WareHouse');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Get Warehouses
// Filter by the current logged-in Admin's ID (Business Owner)
router.get('/', protect, async (req, res) => {
  try {
    // Determine the owner ID. 
    // If logged in user is Admin, they are the owner. 
    // If staff, we use the adminId stored in their token/user record.
    // Fallback to req.user.id if adminId is missing (for root admins)
    const isAdmin = req.user.role && String(req.user.role).toLowerCase() === 'admin';
    const ownerId = req.user.adminId || (isAdmin ? req.user.id : null);

    if (!ownerId) {
       return res.json([]); 
    }

    const warehouses = await Warehouse.find({ adminId: ownerId });
    res.json(warehouses);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    res.status(500).json({ message: 'Error fetching warehouses' });
  }
});

// Create Warehouse (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, location, description } = req.body;
    
    // Determine the owner ID. 
    // For a logged-in Admin, this is their own ID.
    // We use req.user.adminId if it exists (for sub-admins), otherwise req.user.id
    // Crucially, for a new Root Admin, req.user.adminId might be their own ID or undefined depending on signup flow.
    // The safest bet for an 'adminOnly' route is that the creator IS the owner if they are a Root Admin.
    
    const ownerId = req.user.adminId || req.user.id;

    if (!ownerId) {
        return res.status(400).json({ message: "Could not determine warehouse owner." });
    }

    const warehouse = await Warehouse.create({
      name,
      location,
      description,
      adminId: ownerId, // Assign to the business owner
      stats: { // Initialize stats
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