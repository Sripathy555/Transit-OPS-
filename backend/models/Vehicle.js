const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  nameModel: { type: String, required: true },
  type: { type: String, default: 'Cargo Van' },
  maxLoadCapacity: { type: Number, default: 0 },
  odometer: { type: Number, default: 0 },
  acquisitionCost: { type: Number, default: 0 },
  status: { type: String, default: 'Available' },
  region: { type: String, default: 'North' },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
