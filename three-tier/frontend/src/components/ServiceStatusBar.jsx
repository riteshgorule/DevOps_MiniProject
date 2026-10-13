import React, { useEffect, useState } from 'react';
import { API_MODES, getEndpoints, SERVICE_PORTS } from '../config/api';

export default function ServiceStatusBar({ currentMode }) {
  const [healthStatus, setHealthStatus] = useState({
    weather: false,
    prediction: false,
    hotspots: false,
    alerts: false,
    singleBackend: false
  });
  const [latencies, setLatencies] = useState({});
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    const endpoints = getEndpoints(currentMode);

    if (currentMode === API_MODES.MICROSERVICES) {
      const pingNode = async (url) => {
        const start = performance.now();
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
          const latency = Math.round(performance.now() - start);
          return { ok: res.ok, latency: `${latency}ms` };
        } catch {
          return { ok: false, latency: 'offline' };
        }
      };

      const [w, p, h, a] = await Promise.all([
        pingNode(endpoints.weatherHealth),
        pingNode(endpoints.predictionHealth),
        pingNode(endpoints.hotspotsHealth),
        pingNode(endpoints.alertsHealth)
      ]);

      setHealthStatus({
        weather: w.ok,
        prediction: p.ok,
        hotspots: h.ok,
        alerts: a.ok,
        singleBackend: false
      });
      setLatencies({
        weather: w.latency,
        prediction: p.latency,
        hotspots: h.latency,
        alerts: a.latency
      });
    } else {
      const start = performance.now();
      try {
        const res = await fetch(endpoints.systemHealth, { signal: AbortSignal.timeout(1500) });
        const latency = `${Math.round(performance.now() - start)}ms`;
        const isUp = res.ok;
        setHealthStatus({
          weather: isUp,
          prediction: isUp,
          hotspots: isUp,
          alerts: isUp,
          singleBackend: isUp
        });
        setLatencies({ single: latency });
      } catch {
        setHealthStatus({
          weather: false,
          prediction: false,
          hotspots: false,
          alerts: false,
          singleBackend: false
        });
        setLatencies({ single: 'err' });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, [currentMode]);

  const allHealthy = currentMode === API_MODES.MICROSERVICES
    ? (healthStatus.weather && healthStatus.prediction && healthStatus.hotspots && healthStatus.alerts)
    : healthStatus.singleBackend;

  return (
    <div className="status-bar-shell">
      <div className="status-bar-card">
        <div className="status-nodes-group">
          <span className="status-nodes-title">
            {currentMode === API_MODES.MICROSERVICES ? 'Service Mesh Cluster:' : 'Backend Runtime:'}
          </span>

          {currentMode === API_MODES.MICROSERVICES ? (
            <>
              <div className="status-node-pill" title="Port 5001">
                <span className={`status-dot-pulse ${healthStatus.weather ? 'online' : 'offline'}`} />
                <span>Weather <strong>(:{SERVICE_PORTS.weather})</strong></span>
                <span className="latency-badge">{healthStatus.weather ? latencies.weather : 'offline'}</span>
              </div>

              <div className="status-node-pill" title="Port 5002">
                <span className={`status-dot-pulse ${healthStatus.prediction ? 'online' : 'offline'}`} />
                <span>Prediction <strong>(:{SERVICE_PORTS.prediction})</strong></span>
                <span className="latency-badge">{healthStatus.prediction ? latencies.prediction : 'offline'}</span>
              </div>

              <div className="status-node-pill" title="Port 5003">
                <span className={`status-dot-pulse ${healthStatus.hotspots ? 'online' : 'offline'}`} />
                <span>Hotspots <strong>(:{SERVICE_PORTS.hotspots})</strong></span>
                <span className="latency-badge">{healthStatus.hotspots ? latencies.hotspots : 'offline'}</span>
              </div>

              <div className="status-node-pill" title="Port 5004">
                <span className={`status-dot-pulse ${healthStatus.alerts ? 'online' : 'offline'}`} />
                <span>Alerts <strong>(:{SERVICE_PORTS.alerts})</strong></span>
                <span className="latency-badge">{healthStatus.alerts ? latencies.alerts : 'offline'}</span>
              </div>
            </>
          ) : (
            <div className="status-node-pill">
              <span className={`status-dot-pulse ${healthStatus.singleBackend ? 'online' : 'offline'}`} />
              <span>
                {currentMode === API_MODES.MONOLITH 
                  ? `Monolith Server (:${SERVICE_PORTS.monolith})` 
                  : `3-Tier Layered Server (:${SERVICE_PORTS.threeTier})`}
                {' '}&bull; {healthStatus.singleBackend ? 'Healthy' : 'Offline'}
              </span>
              <span className="latency-badge">{latencies.single || '0ms'}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            color: allHealthy ? 'var(--status-positive)' : 'var(--status-critical)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {allHealthy ? '● All Nodes Operational' : '▲ Degraded Service Detected'}
          </span>
          <button 
            id="btn-refresh-health"
            className="pill-btn" 
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            onClick={checkHealth}
            disabled={loading}
          >
            {loading ? 'Pinging...' : '⚡ Ping Cluster'}
          </button>
        </div>
      </div>
    </div>
  );
}
