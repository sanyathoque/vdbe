const mongoose = require('mongoose');

// Define the Gear schema
const gearSchema = new mongoose.Schema({
  currentGear: {
    type: String,
  }
}, {
  timestamps: true,
});

// Create the Gear model
const Gear = mongoose.model('Gear', gearSchema);

module.exports = Gear;
