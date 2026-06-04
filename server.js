// ─────────────────────────────────────────────────────────────────────────────
// server.js  —  Fuel QR Registration System Backend
// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS:
//   1. Load environment variables from .env
//   2. Create Express app and configure middleware
//   3. Connect to MongoDB using Mongoose
//   4. Mount API routes at /api/vehicles
//   5. Start HTTP server on PORT (default 3000)
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config(); // Load .env variables first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const vehicleRoutes = require('./routes/vehicles');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
// cors()        → Allows frontend (different port) to call this API
// express.json() → Parses incoming JSON request bodies

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
// All vehicle-related endpoints are prefixed with /api/vehicles
// Example: POST /api/vehicles  →  handled by routes/vehicles.js → controllers/vehicleController.js

app.use('/api/vehicles', vehicleRoutes);

// ─── Root endpoint (health check) ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '⛽ Fuel QR Registration System API is running',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/vehicles',
      getAll: 'GET /api/vehicles',
      byRegNo: 'GET /api/vehicles/regno/:regNo',
      byFirstName: 'GET /api/vehicles/firstname/:name',
      byLastName: 'GET /api/vehicles/lastname/:name',
      byEmail: 'GET /api/vehicles/email/:email',
      byStation: 'GET /api/vehicles/station/:station',
      byFuelType: 'GET /api/vehicles/fueltype/:type',
      byNIC: 'GET /api/vehicles/nic/:nic',
      updateByRegNo: 'PUT /api/vehicles/regno/:regNo',
      updateByFirstName: 'PUT /api/vehicles/firstname/:name',
      deleteByRegNo: 'DELETE /api/vehicles/regno/:regNo',
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── MongoDB Connection + Server Start ───────────────────────────────────────
// We connect to MongoDB FIRST, then start the server.
// This ensures the API never accepts requests before the DB is ready.

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fuelqrdb';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB:', MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📋 API docs at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit if DB connection fails
  });
