const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromWarehouse: { type: String, required: true },
  toWarehouse: { type: String, required: true },
  scheduledDate: { type: String },
  items: [{
    product: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  status: { 
    type: String, 
    enum: ['requested', 'in_transit', 'completed'], 
    default: 'requested' 
  },
  createdBy: { type: String },
  completedOn: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.models.Transfer || mongoose.model('Transfer', transferSchema);