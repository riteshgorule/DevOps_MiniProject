/**
 * MICROSERVICE 2: HEATWAVE PREDICTION SERVICE
 * -------------------------------------------
 * Port: 5002
 * Responsibilities:
 * - Calculate heatwave risk and status using deterministic mathematical rules
 * - Service-to-service communication: Can query Weather Service (5001) or use local data
 * - Independent failure domain: Weather Service failure does not take down Prediction
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5002;
const WEATHER_SERVICE_URL = process.env.WEATHER_SERVICE_URL || 'http://localhost:5001';
const dataPath = path.join(__dirname, 'data/predictions.json');

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[PREDICTION-SERVICE : ${PORT}] ${req.method} ${req.url}`);
  next();
});

// Deterministic rule-based calculation
function computePrediction(city, temp) {
  const temperature = parseFloat(temp);
  let heatwave = false;
  let severity = 'LOW';
  let riskScore = 20;

  if (temperature < 35) {
    heatwave = false;
    severity = 'LOW';
    riskScore = Math.max(10, Math.round((temperature / 35) * 35));
  } else if (temperature <= 39) {
    heatwave = false;
    severity = 'MODERATE';
    riskScore = Math.round(40 + ((temperature - 35) / 4) * 25);
  } else if (temperature <= 44) {
    heatwave = true;
    severity = 'HIGH';
    riskScore = Math.round(70 + ((temperature - 40) / 4) * 18);
  } else {
    heatwave = true;
    severity = 'EXTREME';
    riskScore = Math.min(99, Math.round(90 + (temperature - 45) * 2.5));
  }

  const predictedTemperature = Math.round((temperature + (temperature >= 40 ? 1.5 : 1.0)) * 10) / 10;

  return {
    city,
    temperature,
    predictedTemperature,
    heatwave,
    severity,
    riskScore,
    calculatedAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
  };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ service: 'prediction-service', port: PORT, status: 'UP' });
});

// GET /api/prediction - Get all predictions
app.get('/api/prediction', (req, res) => {
  try {
    if (fs.existsSync(dataPath)) {
      const stored = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      return res.json(stored);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read predictions', details: err.message });
  }
});

// GET /api/prediction/:city
app.get('/api/prediction/:city', async (req, res) => {
  const cityParam = req.params.city.toLowerCase().trim();

  // 1. Try local data file first
  try {
    if (fs.existsSync(dataPath)) {
      const stored = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      const found = stored.find(item => item.city.toLowerCase() === cityParam);
      if (found) {
        return res.json(found);
      }
    }
  } catch (err) {
    console.warn('[PREDICTION] Error reading local file:', err.message);
  }

  // 2. Try querying Weather Microservice (Service-to-Service REST call)
  try {
    const weatherRes = await fetch(`${WEATHER_SERVICE_URL}/api/weather/${encodeURIComponent(req.params.city)}`);
    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      const calculated = computePrediction(weatherData.city, weatherData.temperature);
      return res.json(calculated);
    }
  } catch (netErr) {
    console.warn(`[PREDICTION] Weather service not reachable at ${WEATHER_SERVICE_URL}: ${netErr.message}`);
  }

  res.status(404).json({ error: `City '${req.params.city}' not found for prediction` });
});

// POST /api/prediction - Calculate prediction dynamically
app.post('/api/prediction', (req, res) => {
  const { city, temperature } = req.body;
  if (!city || temperature === undefined) {
    return res.status(400).json({ error: 'City and temperature are required in request body' });
  }

  const prediction = computePrediction(city, temperature);
  res.json(prediction);
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🔮 PREDICTION MICROSERVICE running on Port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}/api/prediction/:city`);
  console.log(`====================================================`);
});
