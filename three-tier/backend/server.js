/**
 * 3-TIER ARCHITECTURE - APPLICATION & BUSINESS LOGIC SERVER
 * ---------------------------------------------------------
 * Architectural Concept:
 * Logical separation of concerns across 3 clearly defined layers:
 * 
 * TIER 1: Presentation Layer (React Frontend)
 *    │ (HTTP / JSON Requests)
 *    ▼
 * TIER 2: Business & Application Logic Layer (Express Controllers & Services)
 *    │ (Internal function calls & validations)
 *    ▼
 * TIER 3: Data Access Layer (Repositories & JSON Storage)
 */

const express = require('express');
const cors = require('cors');

const weatherController = require('./controllers/weatherController');
const predictionController = require('./controllers/predictionController');
const hotspotController = require('./controllers/hotspotController');
const alertController = require('./controllers/alertController');

const app = express();
const PORT = process.env.PORT || 5010;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[3-TIER APP LAYER - Port ${PORT}] ${req.method} ${req.url}`);
  next();
});

// Weather Endpoints -> routed to weatherController
app.get('/api/weather', weatherController.getAll);
app.get('/api/weather/:city', weatherController.getByCity);

// Prediction Endpoints -> routed to predictionController
app.get('/api/prediction/:city', predictionController.getByCity);
app.post('/api/prediction', predictionController.calculate);

// Hotspot Endpoints -> routed to hotspotController
app.get('/api/hotspots', hotspotController.getAll);
app.get('/api/hotspots/high-risk', hotspotController.getHighRisk);

// Alert Endpoints -> routed to alertController
app.get('/api/alerts', alertController.getAll);
app.get('/api/alerts/active', alertController.getActive);
app.get('/api/alerts/advisory/:city', alertController.getAdvisoryByCity);
app.get('/api/advisory/:city', alertController.getAdvisoryByCity);
app.post('/api/alerts', alertController.create);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    architecture: '3-Tier Layered Architecture',
    tier1: 'Presentation (React)',
    tier2: 'Business Logic (Controllers + Services)',
    tier3: 'Data Access (Repositories + JSON)',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏛️  Climate Intelligence - 3-TIER Backend Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📐 Tier 2: Controllers & Services`);
  console.log(`💾 Tier 3: Repositories & Data Files`);
  console.log(`====================================================`);
});
