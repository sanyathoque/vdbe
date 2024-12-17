![image](https://github.com/user-attachments/assets/483ad951-32e0-4e12-a26f-3ef0ca625fc7)

# Node.js WebSocket + MongoDB Backend

This repository contains a **Node.js & Express** backend that leverages **WebSockets** and **Mongoose** to simulate real-time data updates. It broadcasts gear changes and engine icon color toggles to connected clients, and stores these updates in MongoDB.

## Features

1. **Real-Time WebSocket Broadcasting**  
   - Periodically sends updated gear states (`N/N`, `1`, `2`, `3`, `4`, `5`) and toggles engine icon color between `#ff0000` and `rgb(51, 51, 51)`.
   - Uses a simple `broadcastUpdate` function to notify **all** connected clients whenever data changes.

2. **MongoDB Integration with Mongoose**  
   - **Schemas (Models)**: 
     - **User**: Persists user-specific real-time metrics.
     - **Gear**: Stores the current gear state.
     - **EngineIconColor**: Maintains engine icon color states.
   - **Upsert Operations**: Automatically inserts a document if none exists, or updates the existing one.
   - Connection established via an environment variable (`MONGODB_URI`).

3. **REST API Endpoints**  
   - **POST `/api/data`**: Accepts JSON data, logs it, and responds with success.
   - **POST `/api/update-status`**: Receives the current system status (e.g., RPM, battery, etc.) from a frontend. Logs & responds with a success message.

4. **Configurable Intervals**  
   - Gear cycling interval sends the next gear value every **5 seconds**.
   - Engine icon color toggles on the **same 5-second** schedule.
   - Both intervals persist changes to MongoDB and push updates to WebSocket clients.

5. **HTTP + WebSockets in One Server**  
   - Attaches a **WebSocket.Server** to the same HTTP server object, simplifying deployment.
   - Automatically serves static files from the `/dist` folder (useful if you bundle a frontend).

6. **Environment-Based Setup**  
   - **dotenv**: Manages sensitive config (e.g. `PORT`, `MONGODB_URI`) via `.env`.

## How it Works

1. **Client Connects via WebSocket**  
   - The server logs `"Client connected"`.
   - On receiving a message (JSON data), the server updates the `User` model (`findOneAndUpdate` with `{ upsert: true }`).

2. **Periodic Emissions**  
   - **Gear State**: Cycles through an array (`['N/N', '1', '2', '3', '4', '5']`). Each update is saved to the `Gear` collection and broadcast to all clients.
   - **Engine Icon Color**: Flips between `#ff0000` and `rgb(51, 51, 51)` and updates the `EngineIconColor` model. All connected WebSocket clients receive the new color.

3. **Broadcast Mechanism**  
   - A helper `broadcastUpdate(data)` function iterates over all `wss.clients` and sends JSON updates if the connection is still open.

4. **Express Endpoints**  
   - **`POST /api/data`**: Logs received data; could be extended for custom logic or analytics.
   - **`POST /api/update-status`**: Forwards status from the frontend to your backend logic. Responds with success after logging.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
Create .env File:

plaintext
Copy code
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbName>
Run the Server:

bash
Copy code
npm start
The backend will run at http://localhost:5000 by default (or the PORT in your .env).

Open WebSocket:

The server exposes a WebSocket endpoint at the same URL (e.g. ws://localhost:5000).
On connection, it begins sending periodic gear and engine color updates.
Models (Schemas)
Note: For clarity, here’s an approximate structure of the Mongoose models. Adjust as needed in your actual code.

js
Copy code
// model/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // e.g. motorRPM: Number,
  // batteryPercentage: Number,
  // ...
});

module.exports = mongoose.model('User', userSchema);
js
Copy code
// model/gearModel.js
const mongoose = require('mongoose');

const gearSchema = new mongoose.Schema({
  currentGear: {
    type: String,
    default: 'N/N'
  },
});

module.exports = mongoose.model('Gear', gearSchema);
js
Copy code
// model/engineIconColorModel.js
const mongoose = require('mongoose');

const engineIconColorSchema = new mongoose.Schema({
  engineIconColor: {
    type: String,
    default: '#ff0000'
  },
});

module.exports = mongoose.model('EngineIconColor', engineIconColorSchema);
Highlights
Bi-Directional Real-Time Communication with minimal overhead, thanks to the ws library.
Simple yet Powerful Database Updates: findOneAndUpdate({}, data, { upsert: true }) ensures a single doc acts as the “latest state.”
Scalable: Easily add more intervals or broadcast logic for different datasets.
Flexible: Integrates seamlessly with a front-end React or other frameworks for a real-time dashboard.
Feel free to fork this repository, adapt the intervals or broadcast mechanism, and customize the model schemas to fit your needs. This code is an excellent starting point for automotive dashboards, IoT monitoring, or any scenario requiring live state updates in Node.js!
