const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  licenseCategory: { type: String, default: 'Class A CDL' },
  licenseExpiryDate: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  safetyScore: { type: Number, default: 100 },
  status: { type: String, default: 'Available' },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
