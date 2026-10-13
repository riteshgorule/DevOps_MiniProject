const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const alertsPath = path.join(__dirname, '../data/alerts.json');

function getAlertsData() {
  const raw = fs.readFileSync(alertsPath, 'utf-8');
  return JSON.parse(raw);
}

function saveAlertsData(data) {
  fs.writeFileSync(alertsPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/alerts - Get all alerts
router.get('/', (req, res) => {
  try {
    const data = getAlertsData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read alerts', details: err.message });
  }
});

// GET /api/alerts/active - Get only active alerts
router.get('/active', (req, res) => {
  try {
    const data = getAlertsData();
    const active = data.filter(a => a.status === 'ACTIVE');
    res.json(active);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read active alerts', details: err.message });
  }
});

// GET /api/alerts/advisory/:city or advisory lookup
router.get('/advisory/:city', (req, res) => {
  try {
    const cityParam = req.params.city.toLowerCase().trim();
    const data = getAlertsData();
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

    // Default advisory if no specific alert found
    res.json({
      city: req.params.city,
      severity: 'LOW',
      alert: 'Standard Weather Advisory',
      advisory: 'No active heatwave warning. Stay adequately hydrated and follow general seasonal health guidelines.',
      issuedAt: new Date().toLocaleTimeString('en-IN') + ' IST'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve advisory', details: err.message });
  }
});

// POST /api/alerts - Create new alert
router.post('/', (req, res) => {
  try {
    const { city, severity, alert, warning, advisory } = req.body;
    if (!city || !severity || !alert) {
      return res.status(400).json({ error: 'City, severity, and alert title are required' });
    }

    const data = getAlertsData();
    const newAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      city,
      severity: severity.toUpperCase(),
      status: 'ACTIVE',
      alert,
      warning: warning || `Heatwave advisory declared for ${city}.`,
      advisory: advisory || 'Stay hydrated, avoid peak sun exposure, and follow local municipal guidelines.',
      issuedAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    };

    data.unshift(newAlert);
    saveAlertsData(data);

    res.status(201).json(newAlert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alert', details: err.message });
  }
});

module.exports = router;
