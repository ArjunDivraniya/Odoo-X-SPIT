const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto delete after 5 mins
});

// Change the export line to:
module.exports = mongoose.models.Otp || mongoose.model('Otp', otpSchema);