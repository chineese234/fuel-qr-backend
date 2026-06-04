const mongoose = require('mongoose');
const QRCodeLib = require('qrcode');

// ─── Vehicle Schema ───────────────────────────────────────────────────────────
// Defines the structure of each vehicle document stored in MongoDB.
// Every field matches the JSON format from the assignment specification.

const vehicleSchema = new mongoose.Schema(
  {
    RegNo: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    FirstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    LastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    Email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    NearestStation: {
      type: String,
      required: [true, 'Nearest station is required'],
      trim: true,
    },
    FuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: {
        values: ['Petrol', 'Diesel', 'Electric'],
        message: 'FuelType must be Petrol, Diesel, or Electric',
      },
    },
    OwnerNIC: {
      type: String,
      required: [true, 'Owner NIC is required'],
      unique: true,
      trim: true,
    },
    VehicleModel: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    QRCode: {
      type: String,
      // Auto-generated from RegNo if not provided
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Pre-save Hook ────────────────────────────────────────────────────────────
// Automatically generate a real scannable QR code (base64 data URL) from RegNo.
vehicleSchema.pre('save', async function (next) {
  if (!this.QRCode) {
    this.QRCode = await QRCodeLib.toDataURL(this.RegNo);
  }
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
