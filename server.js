const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require('./model/userModel');
const Gear = require('./model/gearModel');
const EngineIconColor = require('./model/engineIconColorModel');

dotenv.config();

const app = express();

// Connect to DB using environment variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('Connected to dB'))
    .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// WebSocket server using environment variable for port
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT || 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', async (message) => {
    console.log('Received:', message.toString());

    try {
      const parsedData = JSON.parse(message);
      await User.findOneAndUpdate({}, parsedData, { upsert: true });
      console.log('Data updated in database:', JSON.stringify(parsedData, null, 2));
    } catch (error) {
      console.error('Error updating data:', error);
    }
  });
});

function broadcastUpdate(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Periodically send gear values to connected clients
const gearValues = ['N/N', '1', '2', '3', '4', '5'];
let index = 0;

setInterval(async () => {
  const currentGear = gearValues[index];
  const data = { currentGear };
  
  // Broadcast the current gear to all connected clients
  broadcastUpdate(data);
  
  // Save or update the current gear in the database
  try {
    await Gear.findOneAndUpdate({}, { currentGear }, { upsert: true });
    console.log('Current gear updated in database:', currentGear);
  } catch (error) {
    console.error('Error updating current gear in database:', error);
  }
  
  index = (index + 1) % gearValues.length;
}, 5000);

// Periodically send engine icon color updates to connected clients
let engineIconColor = '#ff0000';

setInterval(async () => {
  engineIconColor = engineIconColor === '#ff0000' ? 'rgb(51, 51, 51)' : '#ff0000';
  const data = { engineIconColor };
  
  // Broadcast the engine icon color to all connected clients
  broadcastUpdate(data);
  
  // Save the engine icon color to the database
  try {
    await EngineIconColor.findOneAndUpdate({}, { engineIconColor }, { upsert: true });
    console.log('Engine icon color updated in database:', engineIconColor);
  } catch (error) {
    console.error('Error updating engine icon color in database:', error);
  }
}, 5000);

// API endpoints
app.post(process.env.API_DATA_ENDPOINT || '/api/data', (req, res) => {
  const data = req.body;
  console.log('Received data:', JSON.stringify(data, null, 2));
  // Process the data as needed

  // Send a response back to the client
  res.status(200).json({ message: 'Data received successfully' });
});

// Route to receive updatedStatus from App.js
app.post(process.env.API_DATA_ENDPOINT || '/api/update-status', (req, res) => {
  const updatedStatus = req.body;
  console.log('Received updatedStatus:', updatedStatus);
  // Process the updatedStatus as needed
  res.status(200).json({ message: 'Status updated successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
