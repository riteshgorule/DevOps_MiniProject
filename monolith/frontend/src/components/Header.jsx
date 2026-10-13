import React from 'react';
import { API_MODES } from '../config/api';

export default function Header({ activeTab, setActiveTab, currentMode, setCurrentMode }) {
  return (
    <header className="header-shell">
      <div className="header-main-card">
        {/* Top Branding & Architecture Selector */}
        <div className="header-top-row">
          <div className="brand-section">
            <div className="brand-icon-box">🌡️</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="brand-title">ClimateIntel</h1>
                <span className="brand-badge">DevOps Lab SaaS</span>
              </div>
              <p className="brand-subtitle">
                Climate Intelligence for Heatwave Monitoring & Early Warning
              </p>
            </div>
          </div>

          <div className="arch-mode-pill-box">
            <span className="arch-mode-label">Architecture:</span>
            <select 
              id="architecture-mode-select"
              className="arch-mode-select"
              value={currentMode}
              onChange={(e) => setCurrentMode(e.target.value)}
            >
              <option value={API_MODES.MICROSERVICES}>⚡ Microservices (Ports 5001 - 5004)</option>
              <option value={API_MODES.THREE_TIER}>🏛️ 3-Tier Layered (Port 5010)</option>
              <option value={API_MODES.MONOLITH}>📦 Monolithic (Port 5000)</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs (Pill Buttons) */}
        <nav className="nav-pills-row" aria-label="Main Navigation">
          <button
            id="tab-dashboard"
            className={`nav-pill-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span>📊</span> Overview
          </button>
          <button
            id="tab-weather"
            className={`nav-pill-btn ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => setActiveTab('weather')}
          >
            <span>🌤️</span> Weather Telemetry
          </button>
          <button
            id="tab-prediction"
            className={`nav-pill-btn ${activeTab === 'prediction' ? 'active' : ''}`}
            onClick={() => setActiveTab('prediction')}
          >
            <span>🔮</span> Predictive Intelligence
          </button>
          <button
            id="tab-alerts"
            className={`nav-pill-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <span>🚨</span> Incident Alerts
            <span className="nav-pill-badge">3</span>
          </button>
          <button
            id="tab-architecture"
            className={`nav-pill-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <span>📐</span> Architecture & Viva
          </button>
        </nav>
      </div>
    </header>
  );
}
