/**
 * TIER 3: DATA ACCESS LAYER
 * Alert Repository: Encapsulates all data access and persistence for alerts.json
 */
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/alerts.json');

const alertRepository = {
  findAll: () => {
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  },

  findActive: () => {
    const all = alertRepository.findAll();
    return all.filter(item => item.status === 'ACTIVE');
  },

  findByCity: (city) => {
    const all = alertRepository.findAll();
    return all.find(item => item.city.toLowerCase() === city.toLowerCase().trim());
  },

  save: (newAlert) => {
    const all = alertRepository.findAll();
    all.unshift(newAlert);
    fs.writeFileSync(dataFilePath, JSON.stringify(all, null, 2), 'utf-8');
    return newAlert;
  }
};

module.exports = alertRepository;
