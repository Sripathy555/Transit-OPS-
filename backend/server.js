const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const {
  vehicles,
  drivers,
  trips,
  maintenanceLogs,
  fuelLogs,
  expenses,
  users
} = require('./components/store');

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

if (process.env.MONGO_URI) {
  connectDB();
}

app.get('/', (req, res) => {
  res.json({ message: 'API is running...', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const normalizeRole = (role) => {
  if (!role) return 'Fleet Manager';
  const normalizedRole = String(role).trim().toLowerCase();
  const roleMap = {
    manager: 'Fleet Manager',
    admin: 'Fleet Manager',
    dispatcher: 'Dispatcher',
    analyst: 'Financial Analyst',
    'financial analyst': 'Financial Analyst',
    'safety officer': 'Safety Officer',
    'fleet manager': 'Fleet Manager',
  };
  return roleMap[normalizedRole] || role;
};

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const loginEmail = String(email || '').trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === loginEmail && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json({
    token: 'demo-token',
    user: {
      id: user.id,
      name: user.name || user.email,
      email: user.email,
      role: normalizeRole(user.role),
    }
  });
});

app.get('/api/users', (req, res) => {
  res.json(users.map((user) => ({
    ...user,
    role: normalizeRole(user.role),
    status: user.status || 'Active',
  })));
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: `usr-${Date.now()}`,
    name: req.body.name || 'New User',
    email: req.body.email,
    password: req.body.password || 'temp123',
    role: normalizeRole(req.body.role || 'Dispatcher'),
    status: 'Active',
  };

  users.push(newUser);
  res.status(201).json({ message: 'User created', user: newUser });
});

app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(index, 1);
  return res.json({ message: `User ${req.params.id} deleted` });
});

app.get('/api/dashboard/kpis', (req, res) => {
  const activeVehicles = vehicles.filter(v => ['Available', 'On Trip'].includes(v.status)).length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const inMaintenance = vehicles.filter(v => v.status === 'In Shop').length;
  const onTrip = vehicles.filter(v => v.status === 'On Trip').length;

  res.json({
    activeVehicles,
    availableVehicles,
    inMaintenance,
    onTrip,
    activeTrips: trips.filter(t => t.status === 'Dispatched').length,
    pendingTrips: trips.filter(t => t.status === 'Draft').length,
    driversOnDuty: drivers.filter(d => d.status === 'On Trip').length,
    fleetUtilization: activeVehicles ? ((onTrip / activeVehicles) * 100).toFixed(2) : 0
  });
});

app.get('/api/trips', (req, res) => {
  res.json(trips);
});

app.post('/api/trips', (req, res) => {
  const trip = { id: `trip-${Date.now()}`, ...req.body, status: 'Draft' };
  trips.push(trip);
  res.status(201).json(trip);
});

app.post('/api/trips/:id/dispatch', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.status = 'Dispatched';
  res.json(trip);
});

app.post('/api/trips/:id/complete', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.status = 'Completed';
  res.json(trip);
});

app.post('/api/trips/:id/cancel', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.status = 'Cancelled';
  res.json(trip);
});

app.get('/api/maintenance', (req, res) => {
  res.json(maintenanceLogs);
});

app.post('/api/maintenance', (req, res) => {
  const log = { id: `maint-${Date.now()}`, ...req.body };
  maintenanceLogs.push(log);
  res.status(201).json(log);
});

app.get('/api/fuel', (req, res) => {
  res.json(fuelLogs);
});

app.post('/api/fuel', (req, res) => {
  const entry = { id: `fuel-${Date.now()}`, ...req.body };
  fuelLogs.push(entry);
  res.status(201).json(entry);
});

app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const entry = { id: `exp-${Date.now()}`, ...req.body };
  expenses.push(entry);
  res.status(201).json(entry);
});

const loginHandler = (req, res) => {
  const { email, username, password } = req.body;
  const loginEmail = String(email || username || '').trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === loginEmail && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Login failed' });
  }

  return res.json({
    message: 'Login successful',
    token: 'demo-token',
    user: {
      id: user.id,
      name: user.name || user.email,
      email: user.email,
      role: normalizeRole(user.role),
    },
  });
};

app.post('/login', loginHandler);
app.post('/api/login', loginHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});