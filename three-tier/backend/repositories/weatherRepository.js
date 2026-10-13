/**
 * TIER 3: DATA ACCESS LAYER
 * Weather Repository: Encapsulates all data access operations for weather.json
 */
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/weather.json');

const weatherRepository = {
  findAll: () => {
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  },

  findByCity: (city) => {
    const all = weatherRepository.findAll();
    return all.find(item => item.city.toLowerCase() === city.toLowerCase().trim());
  }
};

module.exports = weatherRepository;
