![image](https://github.com/user-attachments/assets/483ad951-32e0-4e12-a26f-3ef0ca625fc7)

Below is an overview of this Node.js & Express backend code, focusing on the main architecture, the MongoDB/Mongoose schemas, and all the notable features you could highlight in your GitHub repository.

Overview
This backend sets up a real-time, bi-directional communication channel between a web client and the server via WebSockets and Express. The code also seamlessly integrates with MongoDB via Mongoose to persist incoming data, including gear states, engine icon colors, and user updates. It features a periodic broadcasting mechanism that updates connected clients at regular intervals, simulating real-time sensor data or state changes (e.g., changing gear states, toggling engine icon color).

Key Technologies
Node.js & Express for the REST API endpoints and HTTP server
WebSocket (ws) for real-time client-server communication
MongoDB & Mongoose for schema-driven NoSQL data persistence
dotenv for environment variable management
CORS & cookie-parser for security and cookie handling
HTTP/HTTPS core modules for flexible server creation
Folder Structure
model/userModel.js
Defines the schema for storing user-related data. The exact fields are not shown here, but it’s integrated in the code via require('./model/userModel').

model/gearModel.js
Manages gear states (e.g., N/N, 1, 2, 3, etc.). Periodic updates are saved to the database every few seconds.

model/engineIconColorModel.js
Stores the current engine icon color. The backend toggles between #ff0000 and 'rgb(51, 51, 51)' on a timed interval and broadcasts the change to all connected clients.

Each model is presumably defined using Mongoose schemas, providing structure and validation for your data. The code snippet references the following usage pattern:

js
Copy code
await Gear.findOneAndUpdate({}, { currentGear }, { upsert: true });
upsert: true ensures a new document is created if none exists—handy for storing or updating your single-document configurations (like current gear or engine color).

How it Works
Server Setup

The server listens on a port specified by process.env.PORT or defaults to 5000.
CORS and cookie-parser middlewares are applied for cross-origin requests and cookies.
Serves static files from dist folder for the production build if you're bundling a front-end in the same repo.
WebSocket Integration

A WebSocket Server (wss) is attached to the same HTTP server, listening for WebSocket connections.
On client connection: The server logs a message (“Client connected”).
On message: The server receives JSON data from the client, parses it, and uses Mongoose to update a User document in MongoDB. This is stored or updated via User.findOneAndUpdate({}, parsedData, { upsert: true }).
Broadcasting Updates

A helper function, broadcastUpdate(data), iterates over all WebSocket clients and sends them JSON data if they are still connected. This allows for real-time distribution of changes.
Periodic Data Emission

Gear Value Rotation: An array of possible gear values (['N/N', '1', '2', '3', '4', '5']) cycles every 5 seconds, broadcasting the current gear to all connected clients and persisting it in MongoDB via the Gear model.
Engine Icon Color Toggling: The engine icon color flips between #ff0000 and 'rgb(51, 51, 51)' every 5 seconds, broadcasting the new color and saving to the EngineIconColor collection.
REST Endpoints

POST /api/data: A basic endpoint that logs incoming JSON and responds with a success message. Could be used for custom data handling or debugging.
POST /api/update-status: Receives a JSON payload with updated status (e.g. motor RPM, battery percentage, etc.), logs it, and responds with success. This is mirrored in the front-end to store real-time updates.
MongoDB & Mongoose

Database Connection: Using mongoose.connect(process.env.MONGODB_URI).
Each Mongoose model likely has fields matching the structure you’re storing (e.g., gearValue, engineIconColor).
The code uses findOneAndUpdate with the upsert option to either update or create documents without manually checking if they exist.
Good Features to Highlight
Real-Time WebSocket Broadcasting:
The server sends updates to all connected WebSocket clients at fixed intervals. This simulates real sensor data or state changes in an industrial or vehicle-themed scenario.

Auto-Upsert:
Using Mongoose's findOneAndUpdate with { upsert: true } elegantly handles single-document scenarios—no need for separate “create” or “update” logic.

Neat Model Separation:
Having separate Mongoose models (User, Gear, EngineIconColor) keeps the code maintainable. Each collection can be queried or updated independently.

Centralized Broadcasting:
The broadcastUpdate(data) function ensures that any data you want to push to clients can be reused throughout the code.

Modular Intervals:
Two separate intervals handle gear cycling and engine color toggling. They each store data in MongoDB and broadcast to active clients, showcasing an example of how to automate repeated tasks.

Environment-Based Config:
The code leverages dotenv for environment variables (like PORT and MONGODB_URI), which is a best practice for project portability and security.

Scalable Server:
Because the WebSocket server is attached to the existing Express HTTP server, this setup can easily scale or be deployed to the cloud (e.g., Heroku, AWS, etc.).

Static File Serving:
If you bundle a front-end in dist/ (e.g., via React build), the Express server seamlessly serves the production files. This can be turned into a self-contained, full-stack solution.

Potential Enhancements
Model Definitions: Provide more detailed schema definitions in separate files (e.g., userModel.js). For example:
js
Copy code
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // define the shape, e.g.
    motorRPM: Number,
    batteryPercentage: Number,
    // etc.
});

module.exports = mongoose.model('User', userSchema);
Error Handling: Use centralized error handlers or robust logging for database operations and WebSocket events.
Authentication: Integrate token-based or session-based auth if your environment requires user logins.
Custom Logging: Could add Winston or Morgan for more structured logging.
In summary, this backend code demonstrates a well-structured Node.js + Express server with WebSocket real-time communication and MongoDB persistence. The timed broadcasts for gear changes and engine icon color show how to simulate or manage live data updates. Each update is stored in the database, and the server seamlessly notifies connected clients. This setup is perfectly suited for real-time dashboard apps, IoT data visualization, or multi-user applications needing immediate feedback.
