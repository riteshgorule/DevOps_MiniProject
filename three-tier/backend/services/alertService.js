/**
 * TIER 2: BUSINESS LOGIC LAYER
 * Alert & Advisory Service: Predefined rules & template-based citizen advisory generator
 */
const alertRepository = require('../repositories/alertRepository');

// Predefined advisory templates based on severity
const ADVISORY_TEMPLATES = {
  LOW: 'Normal seasonal conditions. Routine hydration and standard sun protection recommended.',
  MODERATE: 'Moderate heat conditions. Carry drinking water and avoid extended direct sun exposure during peak noon hours.',
  HIGH: 'High heat conditions expected. Stay hydrated and avoid prolonged outdoor exposure between 12:00 PM and 3:00 PM.',
  EXTREME: 'Extreme heat conditions detected. Avoid unnecessary outdoor activity, stay hydrated and take appropriate precautions.'
};

const WARNING_TITLES = {
  LOW: 'Seasonal Temperature Normal',
  MODERATE: 'Moderate Heat Advisory',
  HIGH: 'Severe Heatwave Warning',
  EXTREME: 'Extreme Heat Red Alert'
};

const alertService = {
  getAllAlerts: () => {
    return alertRepository.findAll();
  },

  getActiveAlerts: () => {
    return alertRepository.findActive();
  },

  getAdvisoryForCity: (city) => {
    const existing = alertRepository.findByCity(city);
    if (existing) {
      return {
        city: existing.city,
        severity: existing.severity,
        alert: existing.alert,
        advisory: existing.advisory,
        issuedAt: existing.issuedAt
      };
    }

    // Dynamic fallback template
    return {
      city,
      severity: 'LOW',
      alert: WARNING_TITLES.LOW,
      advisory: ADVISORY_TEMPLATES.LOW,
      issuedAt: new Date().toLocaleTimeString('en-IN') + ' IST'
    };
  },

  createAlert: (alertData) => {
    const { city, severity, alert, warning, advisory } = alertData;

    const cleanSeverity = (severity || 'MODERATE').toUpperCase();
    const cleanAlert = alert || WARNING_TITLES[cleanSeverity] || 'Heatwave Warning';
    const cleanAdvisory = advisory || ADVISORY_TEMPLATES[cleanSeverity] || ADVISORY_TEMPLATES.MODERATE;

    const newRecord = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      city,
      severity: cleanSeverity,
      status: 'ACTIVE',
      alert: cleanAlert,
      warning: warning || `Active advisory issued for ${city} due to elevated temperatures.`,
      advisory: cleanAdvisory,
      issuedAt: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    };

    return alertRepository.save(newRecord);
  }
};

module.exports = alertService;
