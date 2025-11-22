const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  product: { type: String, required: true },
  warehouse: { type: String, required: true },
  systemQty: { type: Number, default: 0 },
  physicalQty: { type: Number, required: true },
  difference: { type: Number, required: true },
  reason: { type: String, required: true },
  performedBy: { type: String },
  date: { type: String }, // Storing ISO string YYYY-MM-DD
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.models.Adjustment || mongoose.model('Adjustment', adjustmentSchema);