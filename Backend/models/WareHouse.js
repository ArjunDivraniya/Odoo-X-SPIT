const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Mock stats for now - these would usually be calculated from an Item model
  stats: {
    totalItems: { type: Number, default: 0 },
    lowStock: { type: Number, default: 0 },
    receipts: { type: Number, default: 0 },
    deliveries: { type: Number, default: 0 },
    staffCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Check if model exists first, otherwise create it
module.exports = mongoose.models.Warehouse || mongoose.model('Warehouse', warehouseSchema);