/**
 * MICROSERVICE 4: ALERT & ADVISORY SERVICE
 * ----------------------------------------
 * Port: 5004
 * Responsibilities:
 * - Generate heatwave warnings and active emergency alerts
 * - Predefined rule-based citizen advisory messages
 * - Persist alert lifecycle state in alerts.json
 * - Operates independently from other microservices
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5004;
const dataPath = path.join(__dirname, 'data/alerts.json');

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[ALERT-SERVICE : ${PORT}] ${req.method} ${req.url}`);
  next();
});

// Rule templates
const ADVISORY_TEMPLATES = {
  LOW: 'Normal seasonal temperatures. Stay hydrated with routine water intake.',
  MODERATE: 'Warm weather conditions. Keep hydrated, carry drinking water, and protect yourself from direct sun exposure during peak afternoon hours.',
  HIGH: 'High heat conditions expected. Stay hydrated and avoid prolonged outdoor exposure between 12:00 PM and 3:00 PM.',
  EXTREME: 'Extreme heat conditions detected. Avoid unnecessary outdoor activity, stay hydrated and take appropriate precautions.'
};

const WARNING_TITLES = {
  LOW: 'Seasonal Normal Advisory',
  MODERATE: 'Moderate Heat Advisory',
  HIGH: 'Severe Heatwave Warning',
  EXTREME: 'Extreme Heat Red Alert'
};

function getAlerts() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function saveAlerts(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ service: 'alert-service', port: PORT, status: 'UP' });
});

// GET /api/alerts - All alerts
app.get('/api/alerts', (req, res) => {
  try {
    const data = getAlerts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read alerts', details: err.message });
  }
});

// GET /api/alerts/active - Active alerts only
app.get('/api/alerts/active', (req, res) => {
  try {
    const data = getAlerts();
    const active = data.filter(a => a.status === 'ACTIVE');
    res.json(active);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read active alerts', details: err.message });
  }
});

// GET /api/advisory/:city - Predefined advisory message for city
app.get('/api/advisory/:city', (req, res) => {
  try {
    const cityParam = req.params.city.toLowerCase().trim();
    const data = getAlerts();
    const alert = data.find(a => a.city.toLowerCase() === cityParam);

    if (alert) {
      return res.json({
        city: alert.city,
        severity: alert.severity,
        alert: alert.alert,
        advisory: alert.advisory,
        issuedAt: alert.issuedAt
      });
    }

    // Default template for city
    res.json({
      city: req.params.city,
      severity: 'LOW',
      alert: WARNING_TITLES.LOW,
      advisory: ADVISORY_TEMPLATES.LOW,
      issuedAt: new Date().toLocaleTimeString('en-IN') + ' IST'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve advisory', details: err.message });
  }
});

// POST /api/alerts - Create alert
app.post('/api/alerts', (req, res) => {
  try {
    const { city, severity, alert, warning, advisory } = req.body;
    if (!city || !severity || !alert) {
      return res.status(400).json({ error: 'City, severity, and alert title are required' });
    }

    const cleanSeverity = severity.toUpperCase();
    const newAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      city,
      severity: cleanSeverity,
      status: 'ACTIVE',
      alert,
      warning: warning || `Heatwave conditions detected in ${city}.`,
      advisory: advisory || ADVISORY_TEMPLATES[cleanSeverity] || ADVISORY_TEMPLATES.MODERATE,
      issuedAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    };

    const data = getAlerts();
    data.unshift(newAlert);
    saveAlerts(data);

    res.status(201).json(newAlert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save alert', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚨 ALERT & ADVISORY MICROSERVICE running on Port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}/api/alerts`);
  console.log(`====================================================`);
});
