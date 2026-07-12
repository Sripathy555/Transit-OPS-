const User = require('./User');
const Vehicle = require('./Vehicle');
const Driver = require('./Driver');
const Trip = require('./Trip');

const seedDefaultData = async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await User.create({
      name: 'Transit Manager',
      email: 'manager@transitops.com',
      password: 'password123',
      role: 'Fleet Manager',
      status: 'Active',
    });
  }

  const vehicleCount = await Vehicle.countDocuments();
  if (vehicleCount === 0) {
    await Vehicle.create([
      { registrationNumber: 'TRK-001', nameModel: 'Volvo FH16 Semi', type: 'Semi-Truck', maxLoadCapacity: 15000, odometer: 85000, acquisitionCost: 120000, status: 'Available', region: 'North' },
      { registrationNumber: 'VAN-002', nameModel: 'Ford Transit 350', type: 'Cargo Van', maxLoadCapacity: 1200, odometer: 34120, acquisitionCost: 35000, status: 'On Trip', region: 'East' },
      { registrationNumber: 'TRK-003', nameModel: 'Isuzu NPR Box', type: 'Box Truck', maxLoadCapacity: 5000, odometer: 120000, acquisitionCost: 65000, status: 'In Shop', region: 'West' },
    ]);
  }

  const driverCount = await Driver.countDocuments();
  if (driverCount === 0) {
    await Driver.create([
      { name: 'John Doe', licenseNumber: 'DL-98321-A', licenseCategory: 'Class A CDL', licenseExpiryDate: '2027-12-15', contactNumber: '+1-555-0192', safetyScore: 95, status: 'Available' },
      { name: 'Sarah Smith', licenseNumber: 'DL-11028-B', licenseCategory: 'Class B CDL', licenseExpiryDate: '2026-11-20', contactNumber: '+1-555-0143', safetyScore: 88, status: 'On Trip' },
    ]);
  }

  const tripCount = await Trip.countDocuments();
  if (tripCount === 0) {
    await Trip.create({
      source: 'Chicago Hub',
      destination: 'Detroit Depot',
      vehicleId: 'TRK-001',
      driverId: 'DL-98321-A',
      cargoWeight: 800,
      plannedDistance: 450,
      revenue: 1500,
      status: 'Dispatched',
    });
  }
};

module.exports = seedDefaultData;
