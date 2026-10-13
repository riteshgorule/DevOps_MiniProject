/**
 * TIER 2: BUSINESS LOGIC LAYER
 * Prediction Service: Deterministic rule-based heatwave prediction engine
 */
const predictionRepository = require('../repositories/predictionRepository');
const weatherRepository = require('../repositories/weatherRepository');

const predictionService = {
  /**
   * Deterministic mathematical/rule-based calculation:
   * temp < 35  -> heatwave: false, severity: LOW
   * 35 - 39    -> heatwave: false, severity: MODERATE
   * 40 - 44    -> heatwave: true,  severity: HIGH
   * >= 45      -> heatwave: true,  severity: EXTREME
   */
  calculatePrediction: (city, temperature) => {
    const temp = parseFloat(temperature);
    if (isNaN(temp)) {
      throw new Error('Valid numerical temperature is required');
    }

    let heatwave = false;
    let severity = 'LOW';
    let riskScore = 20;

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

    // Slightly higher diurnal peak estimate
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
  },

  getPredictionForCity: (city) => {
    // Check pre-computed predictions
    const stored = predictionRepository.findByCity(city);
    if (stored) {
      return stored;
    }

    // If not in predictions repo, retrieve current temperature from weather repo
    const weather = weatherRepository.findByCity(city);
    if (weather) {
      return predictionService.calculatePrediction(weather.city, weather.temperature);
    }

    const err = new Error(`City '${city}' not found for prediction calculation`);
    err.status = 404;
    throw err;
  }
};

module.exports = predictionService;
