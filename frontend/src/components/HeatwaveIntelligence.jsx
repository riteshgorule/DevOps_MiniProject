import React, { useEffect, useState } from 'react';
import { getEndpoints, CITIES } from '../config/api';

export default function HeatwaveIntelligence({ currentMode, selectedCity, onSelectCity }) {
  const [prediction, setPrediction] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);
  const [hotspotError, setHotspotError] = useState(null);

  // Simulation form states
  const [simCity, setSimCity] = useState('Pune');
  const [simTemp, setSimTemp] = useState('43');
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const fetchIntelligenceData = async (city) => {
    setLoading(true);
    setPredictionError(null);
    setHotspotError(null);
    const endpoints = getEndpoints(currentMode);

    // 1. Fetch Prediction for selected city (Port 5002)
    try {
      const predUrl = endpoints.predictionCity(city);
      const res = await fetch(predUrl, { signal: AbortSignal.timeout(3500) });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Prediction not available for ${city}`);
      }
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error('Prediction fetch error:', err);
      setPredictionError(
        err.name === 'TimeoutError' || err.message.includes('Failed to fetch')
          ? `Prediction Node Offline (:5002). Fault isolation guarantees Weather & Hotspots remain online!`
          : err.message
      );
      setPrediction(null);
    }

    // 2. Fetch Hotspots (Port 5003)
    try {
      const hotUrl = endpoints.hotspotsAll;
      const res = await fetch(hotUrl, { signal: AbortSignal.timeout(3500) });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Hotspots not available`);
      }
      const data = await res.json();
      setHotspots(data);
    } catch (err) {
      console.error('Hotspot fetch error:', err);
      setHotspotError(
        err.name === 'TimeoutError' || err.message.includes('Failed to fetch')
          ? `Hotspot Node Offline (:5003).`
          : err.message
      );
      setHotspots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    setSimLoading(true);
    const endpoints = getEndpoints(currentMode);

    try {
      const res = await fetch(endpoints.predictionPost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: simCity, temperature: parseFloat(simTemp) }),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSimResult(data);
    } catch (err) {
      alert(`Simulation failed: Prediction Node (:5002) is offline or unreachable.`);
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligenceData(selectedCity);
  }, [selectedCity, currentMode]);

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Section Header */}
      <div className="section-header-block">
        <div>
          <h2 className="section-title">Predictive Intelligence & Rule Engine</h2>
          <p className="section-desc">
            Deterministic rule-based mathematical inference from <code>prediction-service</code> (:5002)
          </p>
        </div>

        {/* Target Zone Selector & Recalculate */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            id="intel-city-select"
            className="pill-select"
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
          >
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button 
            id="btn-refresh-intel"
            className="pill-btn"
            onClick={() => fetchIntelligenceData(selectedCity)}
            disabled={loading}
          >
            <span>🔄</span> {loading ? 'Computing...' : 'Recalculate'}
          </button>
        </div>
      </div>

      {/* Error Callouts if Nodes are Offline */}
      {predictionError && (
        <div className="error-banner" id="prediction-service-error">
          <div>⚠️ {predictionError}</div>
          <button 
            className="pill-btn" 
            style={{ background: 'white', color: '#991b1b' }}
            onClick={() => fetchIntelligenceData(selectedCity)}
          >
            Retry
          </button>
        </div>
      )}
      {hotspotError && (
        <div className="error-banner">
          <div>⚠️ {hotspotError}</div>
          <button 
            className="pill-btn" 
            style={{ background: 'white', color: '#991b1b' }}
            onClick={() => fetchIntelligenceData(selectedCity)}
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Pastel Metric Cards */}
      <div className="metrics-grid">
        {/* Card 1: Computed Risk Score (Wide / Purple) */}
        <div className="metric-card card-purple">
          <div className="metric-header">
            {selectedCity} Peak Risk
            <span className="metric-badge" style={{ background: 'var(--text-primary)', color: 'white' }}>
              {prediction?.severity || 'HIGH'}
            </span>
          </div>
          <div>
            <div className="metric-value">
              {prediction ? `${prediction.riskScore} / 100` : '—'}
            </div>
            <div className="metric-sub">
              {prediction ? `Inference Severity Tier: ${prediction.severity}` : 'Prediction node offline'}
            </div>
          </div>
        </div>

        {/* Card 2: Diurnal Peak Temp */}
        <div className="metric-card card-blue">
          <div className="metric-header">
            Diurnal Peak
            <span className="metric-badge" style={{ background: 'var(--accent-blue)' }}>
              Model
            </span>
          </div>
          <div>
            <div className="metric-value">
              {prediction ? `${prediction.predictedTemperature}°C` : '—'}
            </div>
            <div className="metric-sub">
              {prediction ? `Baseline: ${prediction.temperature}°C (+diurnal delta)` : 'Node offline'}
            </div>
          </div>
        </div>

        {/* Card 3: Heatwave Detection */}
        <div className="metric-card card-green">
          <div className="metric-header">
            Heatwave Flag
            <span className="metric-badge" style={{ background: 'var(--accent-green)' }}>
              Threshold
            </span>
          </div>
          <div>
            <div className="metric-value" style={{ fontSize: '1.65rem' }}>
              {!prediction ? '—' : prediction.heatwave ? 'ACTIVE' : 'NORMAL'}
            </div>
            <div className="metric-sub">Criteria: Temp &ge; 40°C</div>
          </div>
        </div>

        {/* Card 4: Hotspots Identified */}
        <div className="metric-card card-yellow">
          <div className="metric-header">
            Hotspots
            <span className="metric-badge" style={{ background: 'var(--accent-yellow)' }}>
              Geospatial
            </span>
          </div>
          <div>
            <div className="metric-value">
              {hotspots.length} Zones
            </div>
            <div className="metric-sub">Observed in Cluster (:5003)</div>
          </div>
        </div>
      </div>

      {/* Content Split: Regional Hotspots vs Dark Card Playground */}
      <div className="content-split">
        {/* Left Column: Regional Hotspots List */}
        <div>
          <div className="section-subtitle">
            Regional Thermal Hotspots (Port 5003)
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {hotspots.length} Active Hotspots
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '0 16px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Location</span>
            <span>Coordinates</span>
            <span>Temp</span>
            <span>Severity</span>
          </div>

          <div className="station-list">
            {hotspotError ? (
              <p style={{ color: 'var(--status-critical)' }}>Hotspot Service is unreachable.</p>
            ) : hotspots.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No active thermal hotspots registered.</p>
            ) : (
              hotspots.map((h) => (
                <div 
                  key={h.city} 
                  className="station-row"
                  style={{
                    gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                    background: h.city === selectedCity ? 'var(--pastel-purple)' : undefined
                  }}
                  onClick={() => onSelectCity(h.city)}
                >
                  <div className="station-name">
                    <div className="station-name-icon" style={{ background: '#7c3aed' }}>
                      {h.city.charAt(0)}
                    </div>
                    <div>
                      <div>{h.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{h.status}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {h.latitude.toFixed(2)}°N, {h.longitude.toFixed(2)}°E
                  </div>
                  <div style={{ fontWeight: 600, color: h.temperature >= 40 ? 'var(--status-critical)' : 'var(--text-primary)' }}>
                    {h.temperature}°C
                  </div>
                  <div>
                    <span className={`severity-pill ${h.severity.toLowerCase()}`}>
                      {h.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Dark Card Developer Rule-Engine Playground */}
        <div className="dark-card">
          <h3>Rule-Engine Playground</h3>
          <p>
            Dispatch simulation request to <code>POST /api/prediction</code> (:5002) to evaluate deterministic formulas.
          </p>

          <form onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label className="dark-label">Target Simulation City:</label>
              <input 
                id="input-sim-city"
                className="dark-input"
                type="text" 
                value={simCity} 
                onChange={(e) => setSimCity(e.target.value)} 
                required
              />
            </div>

            <div>
              <label className="dark-label">Hypothetical Surface Temp (°C):</label>
              <input 
                id="input-sim-temp"
                className="dark-input"
                type="number" 
                step="0.5" 
                min="20" 
                max="55" 
                value={simTemp} 
                onChange={(e) => setSimTemp(e.target.value)} 
                required
              />
            </div>

            <button 
              id="btn-run-sim"
              type="submit" 
              className="pill-btn dark" 
              disabled={simLoading}
              style={{ justifyContent: 'center' }}
            >
              {simLoading ? 'Simulating...' : '⚡ Dispatch Request (POST)'}
            </button>
          </form>

          {simResult && (
            <div className="alert-item" style={{ borderLeftColor: '#10b981' }}>
              <div className="alert-header">
                <span>Inference Output (200 OK)</span>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>SUCCESS</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', marginTop: '6px' }}>
                <div>Predicted: <strong style={{ color: 'white' }}>{simResult.predictedTemperature}°C</strong></div>
                <div>Risk Index: <strong style={{ color: 'white' }}>{simResult.riskScore}/100</strong></div>
                <div>Heatwave: <strong style={{ color: simResult.heatwave ? '#f87171' : '#34d399' }}>{simResult.heatwave ? 'TRUE' : 'FALSE'}</strong></div>
                <div>Severity: <strong style={{ color: 'white' }}>{simResult.severity}</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
