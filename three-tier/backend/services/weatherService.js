/**
 * TIER 2: BUSINESS LOGIC LAYER
 * Weather Service: Business rules, data transformations, and validation for weather
 */
const weatherRepository = require('../repositories/weatherRepository');

const weatherService = {
  getAllWeather: () => {
    return weatherRepository.findAll();
  },

  getWeatherByCity: (city) => {
    if (!city) {
      throw new Error('City parameter is required');
    }
    const record = weatherRepository.findByCity(city);
    if (!record) {
      const err = new Error(`City '${city}' not found`);
      err.status = 404;
      throw err;
    }
    return record;
  }
};

module.exports = weatherService;
