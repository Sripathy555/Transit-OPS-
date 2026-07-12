const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Test route to confirm server is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});