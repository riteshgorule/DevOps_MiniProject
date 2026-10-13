const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/weather.json');

// Helper to read weather data
function getWeatherData() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/weather - Get all weather records
router.get('/', (req, res) => {
  try {
    const data = getWeatherData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read weather data', details: err.message });
  }
});

// GET /api/weather/:city - Get weather for specific city
router.get('/:city', (req, res) => {
  try {
    const data = getWeatherData();
    const cityParam = req.params.city.toLowerCase().trim();
    const cityWeather = data.find(item => item.city.toLowerCase() === cityParam);

    if (!cityWeather) {
      return res.status(404).json({ error: `City '${req.params.city}' not found in weather records` });
    }

    res.json(cityWeather);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read weather data', details: err.message });
  }
});

module.exports = router;
