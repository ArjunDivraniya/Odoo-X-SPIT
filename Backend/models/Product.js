const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true }, // Removed unique:true globally to allow different admins to have same SKU, but you can enforce unique per adminId if needed
  category: { type: String, required: true },
  unit: { type: String, required: true },
  image: { type: String },
  minLevel: { type: Number, default: 0 },
  maxLevel: { type: Number, default: 0 },
  // Stock is a Map where key is WarehouseID and value is Quantity
  stock: {
    type: Map,
    of: Number,
    default: {}
  },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate status dynamically based on total stock
productSchema.virtual('status').get(function() {
  let total = 0;
  if (this.stock) {
    this.stock.forEach((qty) => total += qty);
  }
  if (total === 0) return 'out_of_stock';
  if (total <= this.minLevel) return 'low_stock';
  return 'in_stock';
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);