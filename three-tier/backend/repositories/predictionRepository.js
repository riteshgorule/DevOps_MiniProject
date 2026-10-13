/**
 * TIER 3: DATA ACCESS LAYER
 * Prediction Repository: Encapsulates all data access for predictions.json
 */
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/predictions.json');

const predictionRepository = {
  findAll: () => {
    if (!fs.existsSync(dataFilePath)) return [];
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  },

  findByCity: (city) => {
    const all = predictionRepository.findAll();
    return all.find(item => item.city.toLowerCase() === city.toLowerCase().trim());
  }
};

module.exports = predictionRepository;
