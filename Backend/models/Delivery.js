const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  customer: { type: String, required: true }, // Suggest past customers
  warehouse: { type: String, required: true },
  scheduledDate: { type: String },
  items: [{
    product: { type: String, required: true }, // Dropdown + Custom Input
    quantity: { type: Number, required: true },
    picked: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ['picking', 'ready', 'completed'], default: 'picking' },
  createdBy: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);