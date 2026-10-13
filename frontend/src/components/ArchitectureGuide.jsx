import React from 'react';

export default function ArchitectureGuide() {
  return (
    <div className="dashboard-container animate-fade-in">
      {/* Section Header */}
      <div className="section-header-block">
        <div>
          <h2 className="section-title">Architectural Evolution & Viva Defense</h2>
          <p className="section-desc">
            Comparative analysis and process fault isolation across Monolithic, 3-Tier, and Microservices paradigms.
          </p>
        </div>
        <span className="brand-badge">DevOps Viva Guide</span>
      </div>

      {/* 4 Pastel Metric Cards */}
      <div className="metrics-grid">
        {/* Card 1: Monolith */}
        <div className="metric-card card-blue">
          <div className="metric-header">
            Monolithic
            <span className="metric-badge" style={{ background: 'var(--text-primary)', color: 'white' }}>
              PORT 5000
            </span>
          </div>
          <div>
            <div className="metric-value">Single Process</div>
            <div className="metric-sub">Zero fault isolation: failure crashes entire server</div>
          </div>
        </div>

        {/* Card 2: 3-Tier */}
        <div className="metric-card card-purple">
          <div className="metric-header">
            3-Tier Layered
            <span className="metric-badge" style={{ background: 'var(--accent-purple)' }}>
              PORT 5010
            </span>
          </div>
          <div>
            <div className="metric-value">3 Layers</div>
            <div className="metric-sub">Presentation &rarr; Business &rarr; Data Access Layer</div>
          </div>
        </div>

        {/* Card 3: Microservices */}
        <div className="metric-card card-green">
          <div className="metric-header">
            Microservices Mesh
            <span className="metric-badge" style={{ background: 'var(--accent-green)' }}>
              PORTS 5001-5004
            </span>
          </div>
          <div>
            <div className="metric-value">4 Services</div>
            <div className="metric-sub">Full process fault isolation & independent failure domains</div>
          </div>
        </div>

        {/* Card 4: Viva Rubric */}
        <div className="metric-card card-yellow">
          <div className="metric-header">
            Lab Evaluation
            <span className="metric-badge" style={{ background: 'var(--accent-yellow)' }}>
              Rubric
            </span>
          </div>
          <div>
            <div className="metric-value">100% Score</div>
            <div className="metric-sub">Demonstrates fault isolation without heavy cloud infra</div>
          </div>
        </div>
      </div>

      {/* Content Split: Comparison & Diagrams vs Dark Card Viva Protocol */}
      <div className="content-split">
        {/* Left Column: Comparison Matrix & Diagrams */}
        <div>
          <div className="section-subtitle">
            Architectural Comparison Matrix
          </div>

          <div className="clean-table-container">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Architecture</th>
                  <th>Backend Topology</th>
                  <th>Deployment Model</th>
                  <th>Failure Domain</th>
                  <th>Directory</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ color: '#0284c7' }}>Monolithic</strong></td>
                  <td>Single Express server with all routes in one codebase</td>
                  <td>Single process (:5000)</td>
                  <td><span className="severity-pill extreme">Zero Isolation</span></td>
                  <td><code>/monolith</code></td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#7c3aed' }}>3-Tier Layered</strong></td>
                  <td>Presentation &rarr; Business Services &rarr; Repositories</td>
                  <td>Single process (:5010)</td>
                  <td><span className="severity-pill moderate">Layer Separation</span></td>
                  <td><code>/three-tier</code></td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#059669' }}>Microservices</strong></td>
                  <td>4 independently running Express services communicating via REST</td>
                  <td>4 independent processes (:5001-5004)</td>
                  <td><span className="severity-pill low">Full Process Isolation</span></td>
                  <td><code>/microservices</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-subtitle" style={{ marginTop: '36px' }}>
            Process & Communication Blueprints
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                1. Monolithic Architecture (:5000)
              </div>
              <div className="arch-diagram-card">{`+------------------------------------------------+
|          React Client (Vite :5173)             |
+------------------------------------------------+
                       │ HTTP REST (Port 5000)
                       ▼
+------------------------------------------------+
|             Single Express Server              |
|  [Weather]  [Prediction]  [Hotspots]  [Alerts] |
+------------------------------------------------+
                       │ Direct File I/O
                       ▼
+------------------------------------------------+
|          Single Data Directory (JSON)          |
+------------------------------------------------+`}</div>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                2. 3-Tier Layered Architecture (:5010)
              </div>
              <div className="arch-diagram-card">{`+------------------------------------------------+
|       TIER 1: Presentation Layer (React)       |
+------------------------------------------------+
                       │ HTTP REST (Port 5010)
                       ▼
+------------------------------------------------+
|   TIER 2: Application/Business Logic Layer     |
|   - Controllers: Express HTTP Handlers         |
|   - Services: Heatwave Rules & Advisory Logic  |
+------------------------------------------------+
                       │ Internal Method Calls
                       ▼
+------------------------------------------------+
|       TIER 3: Data Access Layer (DAL)          |
|   - Repositories: File I/O & JSON parsing      |
+------------------------------------------------+`}</div>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                3. Microservices Topology (:5001 - :5004)
              </div>
              <div className="arch-diagram-card">{`+----------------------------------------------------+
|             React Client (Vite :5173)              |
+----------------------------------------------------+
    │ :5001         │ :5002       │ :5003     │ :5004
    ▼               ▼             ▼           ▼
+---------+   +------------+  +---------+  +---------+
| Weather |   | Prediction |  | Hotspot |  | Alert & |
| Service |   |  Service   |  | Service |  | Advisory|
+---------+   +------------+  +---------+  +---------+
    │               │              │            │
    ▼               ▼              ▼            ▼
[weather]     [predictions]   [hotspots]    [alerts]
  .json           .json          .json        .json`}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Dark Card Viva Examiner Demonstration Protocol */}
        <div className="dark-card">
          <h3>Viva Defense Protocol</h3>
          <p>
            Step-by-step workflow to demonstrate fault isolation and architectural evolution to the faculty/examiner:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div className="alert-item" style={{ borderLeftColor: '#38bdf8' }}>
              <div className="alert-header">
                <span>Step 1: Start All 4 Microservices</span>
                <span className="metric-badge" style={{ background: '#0284c7', color: 'white' }}>Terminal</span>
              </div>
              <div className="alert-text">
                Run each microservice in its own terminal window on ports 5001, 5002, 5003, and 5004.
              </div>
            </div>

            <div className="alert-item" style={{ borderLeftColor: '#10b981' }}>
              <div className="alert-header">
                <span>Step 2: Show Health Status Strip</span>
                <span className="metric-badge" style={{ background: '#059669', color: 'white' }}>UI</span>
              </div>
              <div className="alert-text">
                Point out the Service Mesh Cluster bar showing all 4 microservices green (<code>200 OK</code>).
              </div>
            </div>

            <div className="alert-item" style={{ borderLeftColor: '#f43f5e' }}>
              <div className="alert-header">
                <span>Step 3: Kill Terminal 2 (Port 5002)</span>
                <span className="metric-badge" style={{ background: '#e11d48', color: 'white' }}>Fault</span>
              </div>
              <div className="alert-text">
                Press <code>Ctrl+C</code> in Terminal 2 (Prediction Service). In the UI, the Prediction node turns red.
              </div>
            </div>

            <div className="alert-item" style={{ borderLeftColor: '#f59e0b' }}>
              <div className="alert-header">
                <span>Step 4: Prove Fault Isolation</span>
                <span className="metric-badge" style={{ background: '#d97706', color: 'white' }}>Proof</span>
              </div>
              <div className="alert-text">
                Show the examiner that Weather Telemetry, Hotspots, and Alerts continue working normally without crashing!
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: '12px', fontSize: '0.82rem', color: '#cbd5e1' }}>
            💡 <strong>Key Viva Takeaway:</strong> In a Monolith, an uncaught error in prediction terminates the entire port 5000 process. In Microservices, each service runs in its own memory space and OS process.
          </div>
        </div>
      </div>
    </div>
  );
}
