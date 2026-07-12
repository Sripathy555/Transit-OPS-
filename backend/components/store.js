const vehicles = [
  { id: 'veh-1', status: 'Available', max_load_capacity: 1200, type: 'Bus', region: 'North' },
  { id: 'veh-2', status: 'On Trip', max_load_capacity: 900, type: 'Van', region: 'South' },
  { id: 'veh-3', status: 'In Shop', max_load_capacity: 800, type: 'Bus', region: 'West' }
];

const drivers = [
  { id: 'drv-1', status: 'Available', name: 'Ava Chen' },
  { id: 'drv-2', status: 'On Trip', name: 'Noah Patel' }
];

const trips = [
  { id: 'trip-1', vehicle_id: 'veh-1', driver_id: 'drv-1', cargo_weight: 700, status: 'Draft' },
  { id: 'trip-2', vehicle_id: 'veh-2', driver_id: 'drv-2', cargo_weight: 600, status: 'Dispatched' }
];

const maintenanceLogs = [];
const fuelLogs = [];
const expenses = [];

const users = [
  {
    id: 'user-1',
    name: 'Transit Manager',
    email: process.env.DEFAULT_LOGIN_EMAIL || 'manager@transitops.com',
    password: process.env.DEFAULT_LOGIN_PASSWORD || 'password123',
    role: 'Fleet Manager',
    status: 'Active',
  },
  {
    id: 'user-2',
    name: 'Ops Analyst',
    email: 'ops@transitops.com',
    password: 'password123',
    role: 'Financial Analyst',
    status: 'Active',
  },
];

module.exports = {
  vehicles,
  drivers,
  trips,
  maintenanceLogs,
  fuelLogs,
  expenses,
  users
};
