import React, { useEffect, useState } from 'react';
import { getEndpoints, CITIES } from '../config/api';

export default function WeatherMonitoring({ currentMode, selectedCity, onSelectCity }) {
  const [cityData, setCityData] = useState(null);
  const [allCitiesData, setAllCitiesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchWeather = async (city) => {
    setLoading(true);
    setErrorMessage(null);
    const endpoints = getEndpoints(currentMode);

    try {
      const cityUrl = endpoints.weatherCity(city);
      const res = await fetch(cityUrl, { signal: AbortSignal.timeout(3500) });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Station '${city}' not found in telemetry registry.`);
        }
        throw new Error(`Weather telemetry node returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setCityData(data);

      const allRes = await fetch(endpoints.weatherAll, { signal: AbortSignal.timeout(3500) });
      if (allRes.ok) {
        const allData = await allRes.json();
        setAllCitiesData(allData);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setErrorMessage(
        err.name === 'TimeoutError' || err.message.includes('Failed to fetch')
          ? `Weather Service Unavailable! Ensure node is listening on ${endpoints.weatherAll}`
          : err.message
      );
      setCityData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity, currentMode]);

  const filteredStations = allCitiesData.filter(item => 
    item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Section Header */}
      <div className="section-header-block">
        <div>
          <h2 className="section-title">Weather Telemetry & Stations</h2>
          <p className="section-desc">
            Direct feed from <code>weather-service</code> node (:5001) via HTTP REST
          </p>
        </div>

        {/* Station Selector & Sync */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            id="weather-city-select"
            className="pill-select"
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
          >
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button 
            id="btn-refresh-weather"
            className="pill-btn"
            onClick={() => fetchWeather(selectedCity)}
            disabled={loading}
          >
            <span>🔄</span> {loading ? 'Querying...' : 'Sync Station'}
          </button>
        </div>
      </div>

      {/* Error Callout if Weather Service is down */}
      {errorMessage && (
        <div className="error-banner" id="weather-service-error">
          <div>⚠️ {errorMessage}</div>
          <button 
            className="pill-btn" 
            style={{ background: 'white', color: '#991b1b' }}
            onClick={() => fetchWeather(selectedCity)}
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Pastel Metric Cards */}
      <div className="metrics-grid">
        {/* Card 1: Observed Temp */}
        <div className="metric-card card-blue">
          <div className="metric-header">
            {cityData?.city || selectedCity} Surface Temp
            <span className="metric-badge" style={{ background: 'var(--text-primary)', color: 'white' }}>
              Station Ground
            </span>
          </div>
          <div>
            <div className="metric-value">
              {cityData ? `${cityData.temperature}°C` : '—'}
            </div>
            <div className="metric-sub">
              {cityData ? `${cityData.condition} • Observed` : 'Telemetry offline'}
            </div>
          </div>
        </div>

        {/* Card 2: Relative Humidity */}
        <div className="metric-card card-purple">
          <div className="metric-header">
            Relative Humidity
            <span className="metric-badge" style={{ background: 'var(--accent-purple)' }}>
              Moisture
            </span>
          </div>
          <div>
            <div className="metric-value">
              {cityData ? `${cityData.humidity}%` : '—'}
            </div>
            <div className="metric-sub">Dew Point & Moisture Index</div>
          </div>
        </div>

        {/* Card 3: Heat Classification */}
        <div className="metric-card card-green">
          <div className="metric-header">
            Heat Tier
            <span className="metric-badge" style={{ background: 'var(--accent-green)' }}>
              Protocol
            </span>
          </div>
          <div>
            <div className="metric-value" style={{ fontSize: '1.65rem' }}>
              {!cityData ? '—' : cityData.temperature >= 45 ? 'Extreme Heat' : cityData.temperature >= 40 ? 'High Heat' : 'Moderate'}
            </div>
            <div className="metric-sub">Criteria: &ge;40°C threshold</div>
          </div>
        </div>

        {/* Card 4: Last Sync */}
        <div className="metric-card card-yellow">
          <div className="metric-header">
            Station Sync
            <span className="metric-badge" style={{ background: 'var(--accent-yellow)' }}>
              Local DAL
            </span>
          </div>
          <div>
            <div className="metric-value" style={{ fontSize: '1.65rem' }}>
              {cityData?.lastUpdated || '12:30 IST'}
            </div>
            <div className="metric-sub">weather.json Data Store</div>
          </div>
        </div>
      </div>

      {/* Content Split: Monitored Station Registry vs Dark Card Inspector */}
      <div className="content-split">
        {/* Left Column: Station Registry List */}
        <div>
          <div className="section-subtitle">
            Monitored Stations
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Filter stations..." 
                className="pill-input"
                style={{ padding: '6px 14px', fontSize: '0.82rem', width: '160px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {filteredStations.length} Nodes
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr', padding: '0 16px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Station</span>
            <span>Condition</span>
            <span>Observed</span>
            <span>Humidity</span>
            <span>Select</span>
          </div>

          <div className="station-list">
            {errorMessage ? (
              <p style={{ color: 'var(--status-critical)' }}>Weather Telemetry Service is unreachable.</p>
            ) : filteredStations.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No telemetry stations matching search filter.</p>
            ) : (
              filteredStations.map((item) => (
                <div 
                  key={item.city} 
                  className="station-row"
                  style={{
                    gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
                    background: item.city === selectedCity ? 'var(--pastel-blue)' : undefined
                  }}
                  onClick={() => onSelectCity(item.city)}
                >
                  <div className="station-name">
                    <div className="station-name-icon">{item.city.charAt(0)}</div>
                    <div>
                      <div>{item.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Ground Sensor</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.condition}</div>
                  <div style={{ fontWeight: 600, color: item.temperature >= 40 ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                    {item.temperature}°C
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>{item.humidity}% RH</div>
                  <div>
                    <button 
                      className="pill-btn" 
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      onClick={(e) => { e.stopPropagation(); onSelectCity(item.city); }}
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Dark Card Inspector */}
        <div className="dark-card">
          <h3>Station Inspector</h3>
          <p>Direct REST telemetry feed for municipal zone <strong>{selectedCity}</strong>.</p>

          {cityData ? (
            <div>
              <div className="alert-item" style={{ borderLeftColor: '#38bdf8' }}>
                <div className="alert-header">
                  <span>Ground Sensor: {cityData.city}</span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(56, 189, 248, 0.2)', borderRadius: '12px', color: '#7dd3fc' }}>
                    PORT 5001
                  </span>
                </div>
                <div className="alert-text">
                  Observed: <strong>{cityData.temperature}°C</strong> &bull; Humidity: <strong>{cityData.humidity}%</strong> &bull; Atmosphere: <strong>{cityData.condition}</strong>
                </div>
              </div>

              <div className="alert-item" style={{ borderLeftColor: '#a78bfa' }}>
                <div className="alert-header">
                  <span>Raw Telemetry Payload</span>
                  <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontFamily: 'monospace' }}>application/json</span>
                </div>
                <pre style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.78rem', 
                  color: '#e2e8f0', 
                  marginTop: '6px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '10px',
                  borderRadius: '8px',
                  overflowX: 'auto'
                }}>
{JSON.stringify(cityData, null, 2)}
                </pre>
              </div>

              <button 
                className="pill-btn dark" 
                style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                onClick={() => fetchWeather(selectedCity)}
              >
                Sync {selectedCity} Sensor
              </button>
            </div>
          ) : (
            <p style={{ color: '#a1a1aa' }}>No telemetry data loaded for {selectedCity}.</p>
          )}
        </div>
      </div>
    </div>
  );
}
