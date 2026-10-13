const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const predictionsPath = path.join(__dirname, '../data/predictions.json');
const weatherPath = path.join(__dirname, '../data/weather.json');

// Helper calculation function
function calculatePrediction(city, temperature) {
  const temp = parseFloat(temperature);
  let heatwave = false;
  let severity = 'LOW';
  let riskScore = 25;

  if (temp < 35) {
    heatwave = false;
    severity = 'LOW';
    riskScore = Math.max(10, Math.round((temp / 35) * 35));
  } else if (temp <= 39) {
    heatwave = false;
    severity = 'MODERATE';
    riskScore = Math.round(40 + ((temp - 35) / 4) * 25);
  } else if (temp <= 44) {
    heatwave = true;
    severity = 'HIGH';
    riskScore = Math.round(70 + ((temp - 40) / 4) * 18);
  } else {
    heatwave = true;
    severity = 'EXTREME';
    riskScore = Math.min(99, Math.round(90 + (temp - 45) * 2.5));
  }

  const predictedTemperature = Math.round((temp + (temp >= 40 ? 1.5 : 1.0)) * 10) / 10;

  return {
    city,
    temperature: temp,
    predictedTemperature,
    heatwave,
    severity,
    riskScore,
    calculatedAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
  };
}

// GET /api/prediction/:city
router.get('/:city', (req, res) => {
  try {
    const cityParam = req.params.city.toLowerCase().trim();

    // Try finding in predictions.json first
    if (fs.existsSync(predictionsPath)) {
      const stored = JSON.parse(fs.readFileSync(predictionsPath, 'utf-8'));
      const match = stored.find(item => item.city.toLowerCase() === cityParam);
      if (match) {
        return res.json(match);
      }
    }

    // Otherwise check weather data and calculate
    if (fs.existsSync(weatherPath)) {
      const weatherData = JSON.parse(fs.readFileSync(weatherPath, 'utf-8'));
      const weatherMatch = weatherData.find(item => item.city.toLowerCase() === cityParam);
      if (weatherMatch) {
        const result = calculatePrediction(weatherMatch.city, weatherMatch.temperature);
        return res.json(result);
      }
    }

    res.status(404).json({ error: `No prediction data found for city '${req.params.city}'` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve prediction', details: err.message });
  }
});

// POST /api/prediction - Calculate prediction dynamically
router.post('/', (req, res) => {
  try {
    const { city, temperature } = req.body;
    if (!city || temperature === undefined) {
      return res.status(400).json({ error: 'City and temperature are required in request body' });
    }
    const result = calculatePrediction(city, temperature);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate prediction', details: err.message });
  }
});

module.exports = router;
