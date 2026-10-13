/**
 * TIER 2: CONTROLLER
 * Prediction Controller: Receives HTTP requests, calls PredictionService, returns HTTP responses
 */
const predictionService = require('../services/predictionService');

const predictionController = {
  getByCity: (req, res) => {
    try {
      const city = req.params.city;
      const prediction = predictionService.getPredictionForCity(city);
      res.json(prediction);
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message });
    }
  },

  calculate: (req, res) => {
    try {
      const { city, temperature } = req.body;
      if (!city || temperature === undefined) {
        return res.status(400).json({ error: 'City and temperature are required in request body' });
      }
      const prediction = predictionService.calculatePrediction(city, temperature);
      res.json(prediction);
    } catch (err) {
      res.status(500).json({ error: 'Failed to calculate prediction', details: err.message });
    }
  }
};

module.exports = predictionController;
