const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');
const seedDefaultData = require('./models/SeedData');

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
  connectDB().then(() => {
    seedDefaultData().catch((err) => console.error('Seed data failed:', err.message));
  });
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

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const loginEmail = String(email || '').trim().toLowerCase();

  try {
    const user = await User.findOne({ email: loginEmail, password }).lean();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      token: 'demo-token',
      user: {
        id: user._id.toString(),
        name: user.name || user.email,
        email: user.email,
        role: normalizeRole(user.role),
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.json(users.map((user) => ({
      ...user,
      id: user._id.toString(),
      role: normalizeRole(user.role),
      status: user.status || 'Active',
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name || 'New User',
      email: req.body.email,
      password: req.body.password || 'temp123',
      role: normalizeRole(req.body.role || 'Dispatcher'),
      status: 'Active',
    });

    res.status(201).json({ message: 'User created', user: { ...newUser.toObject(), id: newUser._id.toString() } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: `User ${req.params.id} deleted` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/kpis', async (req, res) => {
  try {
    const [vehicles, trips, drivers] = await Promise.all([
      Vehicle.find({}).lean(),
      Trip.find({}).lean(),
      Driver.find({}).lean(),
    ]);

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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trips', async (req, res) => {
  try {
    const trips = await Trip.find({}).lean();
    res.json(trips.map((trip) => ({ ...trip, id: trip._id.toString() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trips', async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, status: 'Draft' });
    res.status(201).json({ ...trip.toObject(), id: trip._id.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trips/:id/dispatch', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, { status: 'Dispatched' }, { new: true });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ ...trip.toObject(), id: trip._id.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trips/:id/complete', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, { status: 'Completed' }, { new: true });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ ...trip.toObject(), id: trip._id.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trips/:id/cancel', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ ...trip.toObject(), id: trip._id.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/maintenance', (req, res) => {
  res.json([]);
});

app.post('/api/maintenance', (req, res) => {
  res.status(201).json(req.body);
});

app.get('/api/fuel', (req, res) => {
  res.json([]);
});

app.post('/api/fuel', (req, res) => {
  res.status(201).json(req.body);
});

app.get('/api/expenses', (req, res) => {
  res.json([]);
});

app.post('/api/expenses', (req, res) => {
  res.status(201).json(req.body);
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