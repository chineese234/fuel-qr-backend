const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehicleController');

// ─────────────────────────────────────────────────────────────────────────────
// VEHICLE ROUTES
// Base URL: /api/vehicles
// All routes are handled by vehicleController.js
// ─────────────────────────────────────────────────────────────────────────────

// ── CREATE ────────────────────────────────────────────────────────────────────
router.post('/', ctrl.registerVehicle);               // Register a new vehicle

// ── READ (all) ────────────────────────────────────────────────────────────────
router.get('/', ctrl.getAllVehicles);                  // Get all vehicles

// ── READ (search by field) ────────────────────────────────────────────────────
// IMPORTANT: More specific routes must come BEFORE generic ones.
// e.g. /fueltype/:type must be defined before /:regNo to avoid conflicts.

router.get('/regno/:regNo', ctrl.getByRegNo);         // Find by RegNo
router.get('/firstname/:name', ctrl.getByFirstName);  // Find by first name
router.get('/lastname/:name', ctrl.getByLastName);    // Find by last name
router.get('/email/:email', ctrl.getByEmail);         // Find by email
router.get('/station/:station', ctrl.getByStation);   // Find by nearest station
router.get('/fueltype/:type', ctrl.getByFuelType);    // Find by fuel type
router.get('/nic/:nic', ctrl.getByNIC);               // Find by NIC

// ── UPDATE ────────────────────────────────────────────────────────────────────
router.put('/regno/:regNo', ctrl.updateByRegNo);      // Update by RegNo
router.put('/firstname/:name', ctrl.updateByFirstName); // Update by first name

// ── DELETE ────────────────────────────────────────────────────────────────────
router.delete('/regno/:regNo', ctrl.deleteByRegNo);   // Delete by RegNo

module.exports = router;
