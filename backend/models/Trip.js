const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  driverId: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  cargoWeight: { type: Number, default: 0 },
  plannedDistance: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  status: { type: String, default: 'Draft' },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
