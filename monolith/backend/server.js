/**
 * MONOLITHIC BACKEND SERVER
 * -------------------------
 * Architectural Concept:
 * In a Monolithic Architecture, all functional modules (Weather, Prediction,
 * Hotspots, and Alerts) run within ONE single Node.js process and codebase.
 * 
 * Strengths: Easy to develop initially, simple local deployment.
 * Limitations: Single point of failure - if one component crashes, the entire backend goes down.
 */

const express = require('express');
const cors = require('cors');

const weatherRoutes = require('./routes/weatherRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const hotspotRoutes = require('./routes/hotspotRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for demonstration
app.use((req, res, next) => {
  console.log(`[MONOLITH - Port ${PORT}] ${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/hotspots', hotspotRoutes);
app.use('/api/alerts', alertRoutes);

// Direct alias for advisory endpoint: GET /api/advisory/:city
app.get('/api/advisory/:city', (req, res, next) => {
  req.url = `/advisory/${req.params.city}`;
  alertRoutes(req, res, next);
});

// System Status / Health Check
app.get('/api/health', (req, res) => {
  res.json({
    architecture: 'Monolithic Architecture',
    status: 'UP',
    modules: ['weather', 'prediction', 'hotspots', 'alerts'],
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌍 Climate Intelligence - MONOLITHIC Backend Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🧩 Modules Included: Weather, Prediction, Hotspots, Alerts`);
  console.log(`====================================================`);
});
