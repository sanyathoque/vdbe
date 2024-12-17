![image](https://github.com/user-attachments/assets/483ad951-32e0-4e12-a26f-3ef0ca625fc7)

Overview
This React application provides a dynamic and interactive UI for monitoring and controlling values such as motor RPM, battery percentage, gear state, etc. It leverages a combination of D3.js for drawing highly customized gauges, React Hooks for state management and side effects, and WebSockets for real-time updates. The UI itself is carefully styled with neon-like gradients, dynamic animations, and a futuristic aesthetic inspired by dashboards seen in high-performance or industrial equipment.

Key Technologies
React (functional components + Hooks)
Material-UI (MUI) for sliders and snackbars
D3.js for SVG-based gauge rendering
WebSockets for real-time data exchange
Axios for HTTP requests to a backend
Local Storage for persisting or sharing state across components
Various Icon Libraries (MUI Icons, React Icons) for a wide range of icons
Main Features
1. Futuristic Gauges with D3.js
Custom Gauge Render: The code creates two gauge components (one for power/kW, one for RPM) using D3’s low-level SVG rendering. Each gauge:

Has a radial gradient background and multiple arcs to indicate different zones (e.g. green, yellow, red).
Renders ticks and labels to show scale markings (e.g. -1000 kW to +1000 kW, 0 to 800 RPM, etc.).
Displays a dynamically animated needle that smoothly transitions to the current value.
Features additional decorative arcs, swirl patterns, lens flares, outer glows, highlights, and gradients to create a 3D glass-like or neon dashboard look.
Smooth Animations: Needles rotate and update using D3 transitions. The code also uses CSS keyframe animations for pulsing ring glows, rotating background gradients, and swirling arcs, giving the gauges a cutting-edge, animated aesthetic.

Dynamic Labels: Gauges automatically update their central text readout based on the current needle angle. Utility functions are provided (getClosestLabelText) to find the nearest label from the angle, ensuring the text inside the gauge matches the scale.

Responsive & Reusable: Although the code is somewhat tailored to this particular application, the underlying D3 gauge logic could be adapted to many use cases (just provide different labels, data range, or styling).

2. Real-Time Status Management
WebSocket Integration: The app connects to a WebSocket server (WEBSOCKET_URL), listens for incoming messages (like gear state, engine icon color), and updates the UI automatically.
Periodic Data Sending: The app also sends data back to the server every second. This includes current gear, engine icon color, battery percentage, battery temperature, motor RPM, and gauge readouts.
3. Stateful Dashboard Widgets
Icons & Indicators: The top bar shows active status icons (parking brake, engine, battery, etc.). The color and animation for each icon change based on the application state. For example, the parking icon might glow red when the gear is N/N, and the engine icon can flash if certain RPM thresholds are met.
Battery and Temperature Indicators: The code cycles through multiple battery icons and thermometer icons to illustrate battery capacity and temperature levels.
Gear State: The gear state is controlled via WebSocket data. If the gear is N/N (neutral), a red color indicates that the vehicle might be in a “parked” or “neutral” state.
Motor RPM Slider: Users can change the motor speed (RPM) with a slider. This slider is disabled when the system is in recharge mode. When the motor speed changes, the app triggers an HTTP POST (/api/update-status) with axios to synchronize the backend. The gauge and other UI components respond by updating in real-time.
4. Recharge Mode Simulation
Recharge Toggle: A clickable “plug” icon toggles the “rechargeAngle” state. When recharge mode is activated:
The UI disables the motor speed slider.
It starts an interval that slowly increases the battery charge indicator.
Gauges and icons update accordingly, showcasing a visual example of how real charging state might be handled.
5. Extensive Styling & Animations
Use of Gradients & Filters: A variety of SVG filters (outer glow, inner shadow, lens flare) and CSS animations are used to create a polished “futuristic” gauge style.
Modular, Reusable Filters: The defs block includes multiple gradient definitions (needleGradient, backgroundGradient, reflectionGradient, highlightGradient) and filter definitions (outerGlow, lensFlare, needleShadow). This modular approach makes the gauge highly customizable.
3D and Neon Effects: The code uses carefully crafted arcs, swirling paths, keyframe pulses, CSS transitions, and layering of radial gradients to produce a slick, 3D-inspired neon glow look.
Hover Effects: Elements like icons and small info boxes scale up slightly and change box-shadow color on hover. This interactive styling can be seen in the onBoxHover and onBoxLeave events.
6. Local Storage Persistence
Persistence Between Sessions: The app frequently reads from and writes to localStorage for certain values (e.g. motor RPM, current gear, kW readouts). This allows some degree of continuity even if the page is refreshed or reloaded (although the code primarily focuses on ephemeral UI states).
7. Error Handling & Notifications
Snackbar: The Material-UI Snackbar is used to handle and display errors (e.g., if the backend HTTP post fails).
8. Easy Customization
Scalable Icon Setup: The code includes multiple icon imports from react-icons and MUI Icons. You can easily swap them or add new ones to match your aesthetic or requirements.
Adaptable Gauge: The D3 gauge creation logic (createGauge) supports labeled angles, arc segments, needle animations, and dynamic arcs. Modifying kwLabels or rpmLabels changes how the gauges look or what scale they represent.
How the Components Work
App Component:

Holds most of the dashboard logic: states for battery percentage/temperature, gear value, motor RPM, icons, etc.
Establishes WebSocket connections for receiving data (e.g., gear state, engine color).
Sends status updates (gearValue, battery stats, motorRPM) every second to the WebSocket server.
Renders the top bar icons, the D3-based gauges, and all bottom panel UI (slider, battery info, gear, keypad, etc.).
Includes the logic to handle toggling recharge mode, which auto-increments battery icon states.
GaugeSection Component:

Builds the custom D3 gauges inside an SVG element.
Creates two distinct gauges: one for kW (left gauge) and one for RPM (right gauge).
Defines a robust useEffect that handles all D3 setup, rendering arcs, gradients, the needle, ticks, etc.
Another useEffect carefully updates the needle angle and textual readouts whenever props (motorRPM, rechargeAngle, etc.) change.
Exposes callback props updateMotorIconColor and updateMotorIconColorTrue so that changes in RPM (e.g. going above 400) can toggle a flashing icon color in the parent component.
Event Handlers and Effects:

Several useEffect hooks animate or transform the UI based on state (e.g., toggling color for the earth engine indicator, cycling temperature icons every 2 seconds, incrementing battery charge in recharge mode, etc.).
The Slider from MUI triggers a handler (handleSpeedChange) that updates the local state (status) and performs an Axios POST request to the server.
Potential Next Steps
Responsive Adjustments: Currently, the layout is fixed at certain widths (like 1000px for the gauge SVG). Making it fully responsive or mobile-friendly could be a beneficial enhancement.
User Configuration: Expand the code to allow user-defined gauge ranges, color thresholds, or gradient styles.
Modularization: Extract styling and logic into separate sub-components or custom hooks for maintainability.
Tests: Implement unit and integration tests (e.g., using React Testing Library) to ensure reliability of gauge updates and WebSocket interactions.
Performance Optimization: If needed, you can refactor or memoize certain expensive operations (like D3 updates).
Getting Started
Install Dependencies:

bash
Copy code
npm install
Set the .env (optional):

REACT_APP_WEBSOCKET_URL=ws://localhost:8080
REACT_APP_API_URL=http://localhost:5000
Run the Application:

bash
Copy code
npm start
Open http://localhost:3000 to see the real-time gauges and dashboard.

Conclusion
This project demonstrates an eye-catching, animated dashboard UI built with React + D3.js + WebSockets. Its futuristic design, custom-coded gauges, and dynamic icons make for a great demonstration of advanced front-end techniques and real-time data handling. Feel free to modify the gauge logic, styling, or icons to suit your application’s needs—this codebase provides a foundation for many interactive dashboard experiences.
