/**
 * CENTRAL API CONFIGURATION
 * -------------------------
 * This configuration file defines backend URLs for all architectural modes.
 * In Microservice mode, each service has its own dedicated port:
 *   - Weather Service:    PORT 5001
 *   - Prediction Service: PORT 5002
 *   - Hotspot Service:    PORT 5003
 *   - Alert Service:      PORT 5004
 * 
 * In Monolithic mode: All requests target PORT 5000
 * In 3-Tier mode:     All requests target PORT 5010 (or 5000)
 */

export const SERVICE_PORTS = {
  weather: 5001,
  prediction: 5002,
  hotspots: 5003,
  alerts: 5004,
  monolith: 5000,
  threeTier: 5010
};

export const API_MODES = {
  MICROSERVICES: 'microservices',
  MONOLITH: 'monolith',
  THREE_TIER: 'three-tier'
};

export const API_BASE_URLS = {
  microservices: {
    weather: `http://localhost:${SERVICE_PORTS.weather}`,
    prediction: `http://localhost:${SERVICE_PORTS.prediction}`,
    hotspots: `http://localhost:${SERVICE_PORTS.hotspots}`,
    alerts: `http://localhost:${SERVICE_PORTS.alerts}`
  },
  monolith: {
    weather: `http://localhost:${SERVICE_PORTS.monolith}`,
    prediction: `http://localhost:${SERVICE_PORTS.monolith}`,
    hotspots: `http://localhost:${SERVICE_PORTS.monolith}`,
    alerts: `http://localhost:${SERVICE_PORTS.monolith}`
  },
  'three-tier': {
    weather: `http://localhost:${SERVICE_PORTS.threeTier}`,
    prediction: `http://localhost:${SERVICE_PORTS.threeTier}`,
    hotspots: `http://localhost:${SERVICE_PORTS.threeTier}`,
    alerts: `http://localhost:${SERVICE_PORTS.threeTier}`
  }
};

/**
 * Returns complete endpoint URLs according to current active architecture mode
 */
export function getEndpoints(mode = API_MODES.MICROSERVICES) {
  const base = API_BASE_URLS[mode] || API_BASE_URLS.microservices;
  return {
    weatherAll: `${base.weather}/api/weather`,
    weatherCity: (city) => `${base.weather}/api/weather/${encodeURIComponent(city)}`,
    weatherHealth: `${base.weather}/api/health`,

    predictionCity: (city) => `${base.prediction}/api/prediction/${encodeURIComponent(city)}`,
    predictionPost: `${base.prediction}/api/prediction`,
    predictionHealth: `${base.prediction}/api/health`,

    hotspotsAll: `${base.hotspots}/api/hotspots`,
    hotspotsHighRisk: `${base.hotspots}/api/hotspots/high-risk`,
    hotspotsHealth: `${base.hotspots}/api/health`,

    alertsAll: `${base.alerts}/api/alerts`,
    alertsActive: `${base.alerts}/api/alerts/active`,
    advisoryCity: (city) => `${base.alerts}/api/advisory/${encodeURIComponent(city)}`,
    alertsPost: `${base.alerts}/api/alerts`,
    alertsHealth: `${base.alerts}/api/health`,

    // Single server health for monolith or 3-tier
    systemHealth: `${base.weather}/api/health`
  };
}

export const CITIES = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'];
