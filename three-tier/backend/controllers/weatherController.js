/**
 * TIER 2: CONTROLLER
 * Weather Controller: Receives HTTP requests, calls WeatherService, returns HTTP responses
 */
const weatherService = require('../services/weatherService');

const weatherController = {
  getAll: (req, res) => {
    try {
      const data = weatherService.getAllWeather();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve weather data', details: err.message });
    }
  },

  getByCity: (req, res) => {
    try {
      const city = req.params.city;
      const data = weatherService.getWeatherByCity(city);
      res.json(data);
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message });
    }
  }
};

module.exports = weatherController;
