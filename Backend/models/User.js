const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  isVerified: { type: Boolean, default: false },
  assignedWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' } // For staff
}, { timestamps: true });

// Change the export line to:
module.exports = mongoose.models.User || mongoose.model('User', userSchema);