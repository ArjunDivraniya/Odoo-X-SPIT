const express = require('express');
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
    const [receipts, deliveries, transfers, adjustments] = await Promise.all([
      Receipt.find({ adminId: ownerId }),
      Delivery.find({ adminId: ownerId }),
      Transfer.find({ adminId: ownerId }),
      Adjustment.find({ adminId: ownerId })
    ]);

    let movements = [];

    receipts.forEach(r => r.items.forEach(i => movements.push({
      id: r._id, date: r.createdAt, warehouse: r.warehouse, type: 'Receipt',
      reference: r._id.toString().slice(-6).toUpperCase(), product: i.product,
      quantity: `+${i.ordered}`, performedBy: r.createdBy
    })));

    deliveries.forEach(d => d.items.forEach(i => movements.push({
      id: d._id, date: d.createdAt, warehouse: d.warehouse, type: 'Delivery',
      reference: d._id.toString().slice(-6).toUpperCase(), product: i.product,
      quantity: `-${i.quantity}`, performedBy: d.createdBy
    })));

    transfers.forEach(t => t.items.forEach(i => movements.push({
      id: t._id, date: t.createdAt, warehouse: t.fromWarehouse, type: 'Transfer Out',
      reference: t._id.toString().slice(-6).toUpperCase(), product: i.product,
      quantity: `-${i.quantity}`, performedBy: t.createdBy
    })));

    adjustments.forEach(a => movements.push({
      id: a._id, date: a.date, warehouse: a.warehouse, type: 'Adjustment',
      reference: a._id.toString().slice(-6).toUpperCase(), product: a.product,
      quantity: a.difference > 0 ? `+${a.difference}` : `${a.difference}`, performedBy: a.performedBy
    }));

    movements.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(movements);
  } catch (e) { res.status(500).json({ message: 'Error fetching movements' }); }
});

module.exports = router;