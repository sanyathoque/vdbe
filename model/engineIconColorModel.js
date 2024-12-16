const mongoose = require('mongoose');

// Define the EngineIconColor schema
const engineIconColorSchema = new mongoose.Schema({
  engineIconColor: {
    type: String,
  }
}, {
  timestamps: true,
});

// Create the EngineIconColor model
const EngineIconColor = mongoose.model('EngineIconColor', engineIconColorSchema);

module.exports = EngineIconColor;
