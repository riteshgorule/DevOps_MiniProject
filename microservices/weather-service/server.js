/**
 * MICROSERVICE 1: WEATHER SERVICE
 * -------------------------------
 * Port: 5001
 * Responsibilities:
 * - Read weather data from localized weather.json
 * - Return current weather conditions for all cities or requested city
 * - Independent process & failure domain
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const dataPath = path.join(__dirname, 'data/weather.json');

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[WEATHER-SERVICE : ${PORT}] ${req.method} ${req.url}`);
  next();
});

// Helper to read data
function getWeatherData() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ service: 'weather-service', port: PORT, status: 'UP' });
});

// GET /api/weather - Get all weather
app.get('/api/weather', (req, res) => {
  try {
    const data = getWeatherData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read weather records', details: err.message });
  }
});

// GET /api/weather/:city - Get city weather
app.get('/api/weather/:city', (req, res) => {
  try {
    const data = getWeatherData();
    const cityParam = req.params.city.toLowerCase().trim();
    const cityWeather = data.find(item => item.city.toLowerCase() === cityParam);

    if (!cityWeather) {
      return res.status(404).json({ error: `City '${req.params.city}' not found in weather service` });
    }

    res.json(cityWeather);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read weather records', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌤️  WEATHER MICROSERVICE running on Port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}/api/weather`);
  console.log(`====================================================`);
});
