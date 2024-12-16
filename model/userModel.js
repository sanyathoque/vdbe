const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  motorRPM: {
    type: Number,
  },
  gearValue: {
    type: String,
  },
  engineIconColor: {
    type: String,
  },
  batteryPercentage: {
    type: Number,
  },
  batteryTemperature: {
    type: Number,
  }
}, {
  timestamps: true,
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;