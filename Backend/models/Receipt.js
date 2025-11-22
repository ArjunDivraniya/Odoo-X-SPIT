const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  supplier: { type: String, required: true }, // Suggest past suppliers
  warehouse: { type: String, required: true },
  scheduledDate: { type: String },
  items: [{
    product: { type: String, required: true },
    ordered: { type: Number, required: true },
    received: { type: Number, default: 0 }
  }],
  status: { type: String, enum: ['draft', 'ready', 'done'], default: 'draft' },
  createdBy: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.models.Receipt || mongoose.model('Receipt', receiptSchema);