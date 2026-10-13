/**
 * MICROSERVICE 3: HOTSPOT SERVICE
 * -------------------------------
 * Port: 5003
 * Responsibilities:
 * - Maintain geospatial and temperature hotspot data
 * - Classify and filter high-risk regions
 * - Operates independently from other microservices
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5003;
const dataPath = path.join(__dirname, 'data/hotspots.json');

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[HOTSPOT-SERVICE : ${PORT}] ${req.method} ${req.url}`);
  next();
});

function getHotspots() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ service: 'hotspot-service', port: PORT, status: 'UP' });
});

// GET /api/hotspots - Get all hotspot locations
app.get('/api/hotspots', (req, res) => {
  try {
    const data = getHotspots();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve hotspots', details: err.message });
  }
});

// GET /api/hotspots/high-risk - Get only high and extreme risk hotspots
app.get('/api/hotspots/high-risk', (req, res) => {
  try {
    const data = getHotspots();
    const highRisk = data.filter(h => h.severity === 'HIGH' || h.severity === 'EXTREME');
    res.json(highRisk);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve high-risk hotspots', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🔥 HOTSPOT MICROSERVICE running on Port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}/api/hotspots`);
  console.log(`====================================================`);
});
