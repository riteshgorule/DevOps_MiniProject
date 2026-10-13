import React, { useState } from 'react';
import Header from './components/Header';
import ServiceStatusBar from './components/ServiceStatusBar';
import Dashboard from './components/Dashboard';
import WeatherMonitoring from './components/WeatherMonitoring';
import HeatwaveIntelligence from './components/HeatwaveIntelligence';
import AlertsAdvisory from './components/AlertsAdvisory';
import ArchitectureGuide from './components/ArchitectureGuide';
import { API_MODES } from './config/api';
import './App.css';

export default function App() {
  const [currentMode, setCurrentMode] = useState(API_MODES.MICROSERVICES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCity, setSelectedCity] = useState('Nagpur');

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentMode={currentMode} 
        setCurrentMode={setCurrentMode} 
      />

      {/* Service Health Monitoring Strip */}
      <ServiceStatusBar currentMode={currentMode} />

      {/* Main Tab Content */}
      <main className="main-content" id="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            currentMode={currentMode} 
            onSelectCity={setSelectedCity} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'weather' && (
          <WeatherMonitoring 
            currentMode={currentMode} 
            selectedCity={selectedCity} 
            onSelectCity={setSelectedCity} 
          />
        )}

        {activeTab === 'prediction' && (
          <HeatwaveIntelligence 
            currentMode={currentMode} 
            selectedCity={selectedCity} 
            onSelectCity={setSelectedCity} 
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsAdvisory 
            currentMode={currentMode} 
            selectedCity={selectedCity} 
            onSelectCity={setSelectedCity} 
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer-clean">
        <p>
          <strong>DevOps Mini-Project:</strong> Climate Intelligence for Heatwave Monitoring, Prediction, and Early Warning
        </p>
        <p style={{ marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
          Demonstrates Monolithic (Port 5000) &bull; 3-Tier Layered (Port 5010) &bull; Microservices (Ports 5001 - 5004)
        </p>
      </footer>
    </div>
  );
}
