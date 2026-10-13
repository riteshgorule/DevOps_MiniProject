/**
 * TIER 2: BUSINESS LOGIC LAYER
 * Hotspot Service: Geographical hotspot intelligence and filtering
 */
const hotspotRepository = require('../repositories/hotspotRepository');

const hotspotService = {
  getAllHotspots: () => {
    return hotspotRepository.findAll();
  },

  getHighRiskHotspots: () => {
    const all = hotspotRepository.findAll();
    return all.filter(h => h.severity === 'HIGH' || h.severity === 'EXTREME');
  }
};

module.exports = hotspotService;
