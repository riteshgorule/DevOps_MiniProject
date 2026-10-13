const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const hotspotsPath = path.join(__dirname, '../data/hotspots.json');

function getHotspotsData() {
  const raw = fs.readFileSync(hotspotsPath, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/hotspots - Get all hotspots
router.get('/', (req, res) => {
  try {
    const data = getHotspotsData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read hotspots data', details: err.message });
  }
});

// GET /api/hotspots/high-risk - Get only HIGH and EXTREME risk hotspots
router.get('/high-risk', (req, res) => {
  try {
    const data = getHotspotsData();
    const highRisk = data.filter(h => h.severity === 'HIGH' || h.severity === 'EXTREME');
    res.json(highRisk);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read high-risk hotspots', details: err.message });
  }
});

module.exports = router;
