const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  product: { type: String, required: true },
  warehouse: { type: String, required: true },
  systemQty: { type: Number, required: true },
  physicalQty: { type: Number, required: true },
  difference: { type: Number }, 
  reason: { type: String },
  date: { type: String },
  performedBy: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.models.Adjustment || mongoose.model('Adjustment', adjustmentSchema);