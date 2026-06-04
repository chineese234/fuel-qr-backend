const Vehicle = require('../models/Vehicle');

// ─── Helper: Send success response ───────────────────────────────────────────
const success = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

// ─── Helper: Send error response ─────────────────────────────────────────────
const error = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ success: false, message, data: null });
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER A VEHICLE  →  POST /api/vehicles
// ─────────────────────────────────────────────────────────────────────────────
exports.registerVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const saved = await vehicle.save();
    success(res, saved, 'Vehicle registered successfully', 201);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      if (field === 'OwnerNIC') return error(res, 'This NIC is already registered', 409);
      return error(res, 'Registration number already exists', 409);
    }
    error(res, err.message, 400);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL VEHICLES  →  GET /api/vehicles
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    success(res, vehicles, `${vehicles.length} vehicles found`);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FIND BY REGISTRATION NUMBER  →  GET /api/vehicles/regno/:regNo
// ─────────────────────────────────────────────────────────────────────────────
exports.getByRegNo = async (req, res) => {
  try {
    // Case-insensitive search using regex
    const vehicle = await Vehicle.findOne({
      RegNo: { $regex: new RegExp(`^${req.params.regNo}$`, 'i') },
    });
    if (!vehicle) return error(res, 'Vehicle not found', 404);
    success(res, vehicle, 'Vehicle found');
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FIND BY OWNER FIRST NAME  →  GET /api/vehicles/firstname/:name
// ─────────────────────────────────────────────────────────────────────────────
exports.getByFirstName = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      FirstName: { $regex: new RegExp(req.params.name, 'i') },
    });
    if (!vehicles.length) return error(res, 'No vehicles found', 404);
    success(res, vehicles, `${vehicles.length} vehicle(s) found`);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FIND BY OWNER LAST NAME  →  GET /api/vehicles/lastname/:name
// ─────────────────────────────────────────────────────────────────────────────
exports.getByLastName = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      LastName: { $regex: new RegExp(req.params.name, 'i') },
    });
    if (!vehicles.length) return error(res, 'No vehicles found', 404);
    success(res, vehicles, `${vehicles.length} vehicle(s) found`);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FIND BY EMAIL  →  GET /api/vehicles/email/:email
// ─────────────────────────────────────────────────────────────────────────────
exports.getByEmail = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      Email: { $regex: new RegExp(req.params.email, 'i') },
    });
    if (!vehicles.length) return error(res, 'No vehicles found', 404);
    success(res, vehicles, `${vehicles.length} vehicle(s) found`);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FIND BY NEAREST STATION  →  GET /api/vehicles/station/:station
// ─────────────────────────────────────────────────────────────────────────────
exports.getByStation = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      NearestStation: { $regex: new RegExp(req.params.station, 'i') },
    });
    if (!vehicles.length) return error(res, 'No vehicles found', 404);
    success(res, vehicles, `${vehicles.length} vehicle(s) found`);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FIND BY FUEL TYPE  →  GET /api/vehicles/fueltype/:type
// ─────────────────────────────────────────────────────────────────────────────
exports.getByFuelType = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      FuelType: { $regex: new RegExp(`^${req.params.type}$`, 'i') },
    });
    if (!vehicles.length) return error(res, 'No vehicles found', 404);
    success(res, vehicles, `${vehicles.length} vehicle(s) found`);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FIND BY NIC  →  GET /api/vehicles/nic/:nic
// ─────────────────────────────────────────────────────────────────────────────
exports.getByNIC = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      OwnerNIC: { $regex: new RegExp(req.params.nic, 'i') },
    });
    if (!vehicles.length) return error(res, 'No vehicles found', 404);
    success(res, vehicles, `${vehicles.length} vehicle(s) found`);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE BY REGISTRATION NUMBER  →  PUT /api/vehicles/regno/:regNo
// ─────────────────────────────────────────────────────────────────────────────
exports.updateByRegNo = async (req, res) => {
  try {
    // Strip RegNo and QRCode — these must never be changed via update
    const { RegNo, QRCode, ...safeUpdate } = req.body;
    const vehicle = await Vehicle.findOneAndUpdate(
      { RegNo: { $regex: new RegExp(`^${req.params.regNo}$`, 'i') } },
      safeUpdate,
      { new: true, runValidators: true } // new:true returns updated doc
    );
    if (!vehicle) return error(res, 'Vehicle not found', 404);
    success(res, vehicle, 'Vehicle updated successfully');
  } catch (err) {
    error(res, err.message, 400);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE BY FIRST NAME  →  PUT /api/vehicles/firstname/:name
// ─────────────────────────────────────────────────────────────────────────────
exports.updateByFirstName = async (req, res) => {
  try {
    // Strip RegNo and QRCode — updating these on multiple records would cause
    // duplicate key errors and corrupt data
    const { RegNo, QRCode, ...safeUpdate } = req.body;
    const result = await Vehicle.updateMany(
      { FirstName: { $regex: new RegExp(`^${req.params.name}$`, 'i') } },
      safeUpdate,
      { runValidators: true }
    );
    if (result.matchedCount === 0) return error(res, 'No vehicles found', 404);
    success(res, result, `${result.modifiedCount} vehicle(s) updated`);
  } catch (err) {
    error(res, err.message, 400);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE BY REGISTRATION NUMBER  →  DELETE /api/vehicles/regno/:regNo
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteByRegNo = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      RegNo: { $regex: new RegExp(`^${req.params.regNo}$`, 'i') },
    });
    if (!vehicle) return error(res, 'Vehicle not found', 404);
    success(res, vehicle, 'Vehicle deleted successfully');
  } catch (err) {
    error(res, err.message);
  }
};
