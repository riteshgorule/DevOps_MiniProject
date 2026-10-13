/**
 * TIER 2: CONTROLLER
 * Alert Controller: Receives HTTP requests, calls AlertService, returns HTTP responses
 */
const alertService = require('../services/alertService');

const alertController = {
  getAll: (req, res) => {
    try {
      const data = alertService.getAllAlerts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve alerts', details: err.message });
    }
  },

  getActive: (req, res) => {
    try {
      const data = alertService.getActiveAlerts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve active alerts', details: err.message });
    }
  },

  getAdvisoryByCity: (req, res) => {
    try {
      const city = req.params.city;
      const data = alertService.getAdvisoryForCity(city);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve advisory', details: err.message });
    }
  },

  create: (req, res) => {
    try {
      const { city, severity, alert } = req.body;
      if (!city || !severity || !alert) {
        return res.status(400).json({ error: 'City, severity, and alert title are required' });
      }
      const created = alertService.createAlert(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create alert', details: err.message });
    }
  }
};

module.exports = alertController;
