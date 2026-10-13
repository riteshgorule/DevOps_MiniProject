/**
 * TIER 3: DATA ACCESS LAYER
 * Hotspot Repository: Encapsulates all data access for hotspots.json
 */
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/hotspots.json');

const hotspotRepository = {
  findAll: () => {
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  },

  findByCity: (city) => {
    const all = hotspotRepository.findAll();
    return all.find(item => item.city.toLowerCase() === city.toLowerCase().trim());
  }
};

module.exports = hotspotRepository;
