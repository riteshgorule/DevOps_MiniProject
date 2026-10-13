/**
 * TIER 2: CONTROLLER
 * Hotspot Controller: Receives HTTP requests, calls HotspotService, returns HTTP responses
 */
const hotspotService = require('../services/hotspotService');

const hotspotController = {
  getAll: (req, res) => {
    try {
      const data = hotspotService.getAllHotspots();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve hotspots', details: err.message });
    }
  },

  getHighRisk: (req, res) => {
    try {
      const data = hotspotService.getHighRiskHotspots();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve high risk hotspots', details: err.message });
    }
  }
};

module.exports = hotspotController;
