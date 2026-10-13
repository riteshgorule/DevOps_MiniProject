import React, { useEffect, useState } from 'react';
import { getEndpoints } from '../config/api';

export default function Dashboard({ currentMode, onSelectCity, onNavigateTab }) {
  const [weatherList, setWeatherList] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  
  const [errors, setErrors] = useState({
    weather: null, prediction: null, hotspots: null, alerts: null
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    const endpoints = getEndpoints(currentMode);

    try {
      const res = await fetch(endpoints.weatherAll, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setWeatherList(await res.json());
      setErrors(prev => ({ ...prev, weather: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, weather: 'Service Offline' }));
    }

    try {
      const res = await fetch(endpoints.hotspotsAll, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setHotspots(await res.json());
      setErrors(prev => ({ ...prev, hotspots: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, hotspots: 'Service Offline' }));
    }

    try {
      const res = await fetch(endpoints.alertsActive, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setActiveAlerts(await res.json());
      setErrors(prev => ({ ...prev, alerts: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, alerts: 'Service Offline' }));
    }

    try {
      const res = await fetch(endpoints.predictionCity('Nagpur'), { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSelectedPrediction(await res.json());
      setErrors(prev => ({ ...prev, prediction: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, prediction: 'Service Offline' }));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentMode]);

  const highestHotspot = hotspots.reduce((max, curr) => (curr.temperature > (max?.temperature || 0) ? curr : max), null);
  const avgTemp = weatherList.length > 0 
    ? Math.round(weatherList.reduce((acc, curr) => acc + curr.temperature, 0) / weatherList.length) 
    : 39;

  return (
    <div className="dashboard-container animate-fade-in">
      
      {/* Header aligned with the reference design */}
      <div className="section-header-block">
        <div>
          <h2 className="section-title">Overview</h2>
          <p className="section-desc">Real-time climate risk telemetry</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="pill-btn" onClick={fetchDashboardData} disabled={loading}>
            <span>🔄</span> {loading ? 'Syncing...' : 'Sync Telemetry'}
          </button>
        </div>
      </div>

      {Object.values(errors).some(Boolean) && (
        <div className="error-banner">
          <div>⚠️ Service Degradation Detected - Isolated modules offline</div>
          <button className="pill-btn" style={{ background: 'white', color: '#991b1b' }} onClick={fetchDashboardData}>Retry</button>
        </div>
      )}

      {/* Metrics Grid mapping to the reference image's pastel cards */}
      <div className="metrics-grid">
        
        {/* Wide Card (replaces the portfolio chart card in reference) */}
        <div className="metric-card card-blue">
          <div className="metric-header">
            Regional Mean Temp
            <span className="metric-badge" style={{ background: 'var(--text-primary)', color: 'white' }}>Station Net</span>
          </div>
          <div>
            <div className="metric-value">{errors.weather ? '—' : `${avgTemp}°C`}</div>
            <div className="metric-sub">{errors.weather ? 'Weather node offline' : `Aggregated from ${weatherList.length} nodes`}</div>
          </div>
        </div>

        {/* Small Pastel Cards */}
        <div className="metric-card card-purple">
          <div className="metric-header">
            Peak Risk
            <span className="metric-badge" style={{ background: 'var(--accent-purple)' }}>{selectedPrediction?.severity || 'HIGH'}</span>
          </div>
          <div>
            <div className="metric-value">{errors.prediction ? '—' : selectedPrediction?.riskScore || 96}</div>
            <div className="metric-sub">Risk Score</div>
          </div>
        </div>

        <div className="metric-card card-green">
          <div className="metric-header">
            Thermal Zone
            <span className="metric-badge" style={{ background: 'var(--accent-green)' }}>Peak</span>
          </div>
          <div>
            <div className="metric-value" style={{ fontSize: '1.8rem' }}>{errors.hotspots ? '—' : (highestHotspot?.city || 'Nagpur')}</div>
            <div className="metric-sub">{errors.hotspots ? 'Node offline' : `${highestHotspot?.temperature || 45}°C Observed`}</div>
          </div>
        </div>

        <div className="metric-card card-yellow">
          <div className="metric-header">
            Advisories
            <span className="metric-badge" style={{ background: 'var(--accent-yellow)' }}>Active</span>
          </div>
          <div>
            <div className="metric-value">{errors.alerts ? '—' : activeAlerts.length}</div>
            <div className="metric-sub">Municipal Bulletins</div>
          </div>
        </div>
      </div>

      {/* Bottom Layout Split (List view vs Dark Card view) */}
      <div className="content-split">
        
        {/* Left Column: Clean List view (like the crypto list in reference) */}
        <div>
          <div className="section-subtitle">
            Monitored Stations
            <button className="pill-btn" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => onNavigateTab('weather')}>
              View All 
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '0 16px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>City</span>
            <span>Condition</span>
            <span>Temp</span>
            <span>Humidity</span>
          </div>

          <div className="station-list">
            {errors.weather ? (
              <p style={{ color: 'var(--status-critical)' }}>Weather Telemetry Service is unreachable.</p>
            ) : (
              weatherList.slice(0, 4).map((item) => (
                <div key={item.city} className="station-row" onClick={() => { onSelectCity(item.city); onNavigateTab('weather'); }}>
                  <div className="station-name">
                    <div className="station-name-icon">{item.city.charAt(0)}</div>
                    <div>
                      <div>{item.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Station</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.condition}</div>
                  <div style={{ fontWeight: 600, color: item.temperature >= 40 ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                    {item.temperature}°C
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>{item.humidity}%</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Dark Card (like the "Earn free crypto" card in reference) */}
        <div className="dark-card">
          <h3>Emergency Directives</h3>
          <p>Review active advisories and warnings generated by regional municipal systems.</p>
          
          <button className="pill-btn dark" onClick={() => onNavigateTab('alerts')} style={{ marginBottom: '24px' }}>
            View All Directives
          </button>

          {errors.alerts ? (
            <p style={{ color: '#f87171', fontSize: '0.9rem' }}>Alert Service unreachable.</p>
          ) : activeAlerts.length === 0 ? (
            <p style={{ color: '#a1a1aa' }}>No active emergency alerts registered.</p>
          ) : (
            <div>
              {activeAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id || alert.city} className="alert-item">
                  <div className="alert-header">
                    <span>{alert.city}</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#fca5a5' }}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="alert-text">{alert.advisory}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}