const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Inventory Manager', 'Warehouse Staff', 'Picker', 'admin', 'staff'], 
    default: 'Warehouse Staff' 
  },
  // Link to the Admin who created this user (The Business Owner)
  // For the Root Admin themselves, this can be their own ID or handled via logic
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  warehouses: [{ type: String }], 
  phone: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: true },
  activities: [{
    label: String,
    date: Date
  }]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);