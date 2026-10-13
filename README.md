# 🌍 Climate Intelligence for Heatwave Monitoring, Prediction, and Early Warning
> **DevOps Lab Mini-Project** demonstrating the architectural evolution from **Monolithic** to **3-Tier** to **Microservices**.

---

## 📌 Project Overview
This project demonstrates three software architecture paradigms for a real-world Climate Intelligence application that monitors temperatures, predicts heatwave risk levels, identifies regional thermal hotspots, and issues emergency citizen advisories across key cities in Maharashtra (Mumbai, Pune, Nagpur, Nashik, Aurangabad).

### 🎯 Faculty Evaluation Objectives
1. **Monolithic Architecture (`/monolith`)**: Demonstrates a unified single-process backend where all functional routes reside in one application.
2. **3-Tier Architecture (`/three-tier`)**: Demonstrates clean logical separation of concerns across Presentation (Tier 1), Business Logic (Tier 2), and Data Access (Tier 3).
3. **Microservice Architecture (`/microservices`)**: Demonstrates complete process isolation, independent failure domains, and distributed execution across 4 distinct microservices.
4. **Fault Isolation Demonstration**: Demonstrates that if one microservice (e.g., Prediction Service) fails, the remaining microservices (Weather, Hotspots, Alerts) continue to operate normally without taking down the system.

---

## 📊 Architectural Comparison Matrix

| Architecture | Backend Structure | Deployment Model | Failure Isolation | Project Folder |
| :--- | :--- | :--- | :--- | :--- |
| **Monolithic** | All 4 functional modules (Weather, Prediction, Hotspots, Alerts) in a single Express server | Single command / single process (`node server.js` on **Port 5000**) | ❌ **Zero Isolation** — If any module crashes or hangs, the entire system is down | `/monolith/backend` |
| **3-Tier Layered** | Decoupled into Presentation (React), Business/Application Logic (Controllers + Services), and Data Access (Repositories + JSON) | Single backend process (**Port 5010**) with structural code separation | ⚠️ **Logical Layer Separation** — Business logic is decoupled from data storage, but shares one runtime process | `/three-tier/backend` |
| **Microservices** | 4 independently running Node.js/Express services communicating via REST APIs | 4 independent processes on separate ports (**5001, 5002, 5003, 5004**) | ✅ **Full Process Isolation** — Crash of one service does not affect the availability of other services | `/microservices/*` |

---

## 📐 Architecture Diagrams (ASCII)

### 1. Monolithic Architecture
```
+-------------------------------------------------------+
|                 React Frontend (Vite)                 |
+-------------------------------------------------------+
                           │ HTTP REST (Port 5000)
                           ▼
+-------------------------------------------------------+
|                 Single Express Backend                |
|                                                       |
|   ┌─────────────┐  ┌──────────────┐  ┌────────────┐   |
|   │   Weather   │  │  Prediction  │  │  Hotspots  │   |
|   │   Routes    │  │    Routes    │  │   Routes   │   |
|   └─────────────┘  └──────────────┘  └────────────┘   |
|                   ┌──────────────┐                    |
|                   │    Alerts    │                    |
|                   │    Routes    │                    |
|                   └──────────────┘                    |
+-------------------------------------------------------+
                           │ File I/O
                           ▼
+-------------------------------------------------------+
|             Single Data Directory (JSON)              |
|   weather.json   predictions.json   hotspots.json     |
+-------------------------------------------------------+
```

### 2. 3-Tier Layered Architecture
```
+-------------------------------------------------------+
|         TIER 1: Presentation Layer (React + Vite)     |
+-------------------------------------------------------+
                           │ HTTP REST (Port 5010)
                           ▼
+-------------------------------------------------------+
|     TIER 2: Business & Application Logic Layer        |
|                                                       |
|  Controllers: weatherController, predictionController |
|               hotspotController, alertController      |
|                                                       |
|  Services:    predictionService, hotspotService       |
|               alertService, weatherService            |
|  (Contains deterministic calculations & advisory rules|
+-------------------------------------------------------+
                           │ Internal Method Invocations
                           ▼
+-------------------------------------------------------+
|             TIER 3: Data Access Layer (DAL)           |
|                                                       |
|  Repositories: weatherRepo, predictionRepo            |
|                hotspotRepo, alertRepo                 |
|                                                       |
|  Data Store:   weather.json, predictions.json, etc.   |
+-------------------------------------------------------+
```

### 3. Microservices Architecture (4 Microservices)
```
+---------------------------------------------------------------------------------+
|                              React Frontend (Vite)                              |
+---------------------------------------------------------------------------------+
        │ Port 5001            │ Port 5002            │ Port 5003       │ Port 5004
        ▼                      ▼                      ▼                 ▼
+---------------+      +----------------+     +---------------+  +----------------+
|  Weather      |      |   Prediction   |     |   Hotspot     |  | Alert &        |
|  Service      |      |   Service      |     |   Service     |  | Advisory Svc   |
+---------------+      +----------------+     +---------------+  +----------------+
        │                      │                      │                 │
        ▼                      ▼                      ▼                 ▼
[ weather.json ]      [predictions.json]     [ hotspots.json ]  [ alerts.json ]
```

---

## 🛠️ Technology Stack & Constraints

- **Frontend**: React 19 + Vite (Vanilla CSS design system with modern climate dark theme and glassmorphic cards)
- **Backend**: Node.js + Express.js
- **Data Storage**: Local JSON files (`weather.json`, `predictions.json`, `hotspots.json`, `alerts.json`)
- **Communication**: REST APIs over HTTP (CORS enabled)
- **Zero Heavy Infrastructure**: No Docker, Kubernetes, Jenkins, MongoDB, MySQL, Redis, or Kafka needed. Runs natively on Windows using standard `node` and `npm` commands.

---

## 🧩 The 3 Major Functional Modules

### Module 1: Weather Monitoring
- Displays City, Temperature (°C), Humidity (%), Weather Condition, and Last Updated Time.
- Monitored cities: **Mumbai, Pune, Nagpur, Nashik, Aurangabad**.
- Interactive city selector with static JSON data persistence.

### Module 2: Heatwave Intelligence & Prediction
- Displays Current Temperature, Diurnal Predicted Peak, Heatwave Active/Inactive status, Severity, and Risk Score (0-100).
- **Deterministic Rule Logic**:
  - `Temperature < 35°C` &rarr; `heatwave: false`, `Severity: LOW`, Risk Score: ~25
  - `35°C <= Temperature <= 39°C` &rarr; `heatwave: false`, `Severity: MODERATE`, Risk Score: ~55
  - `40°C <= Temperature <= 44°C` &rarr; `heatwave: true`, `Severity: HIGH`, Risk Score: ~82
  - `Temperature >= 45°C` &rarr; `heatwave: true`, `Severity: EXTREME`, Risk Score: ~96
- Thermal Hotspots with geographical coordinates and high-risk classification.
- Includes an interactive **"What-If Heatwave Simulator"** allowing custom temperature testing via `POST /api/prediction`.

### Module 3: Alerts & Citizen Advisory
- Active heatwave warning bulletins with severity badges, affected cities, and municipal directives.
- Predefined rule-based citizen advisory templates:
  - **HIGH**: *"High heat conditions expected. Stay hydrated and avoid prolonged outdoor exposure between 12:00 PM and 3:00 PM."*
  - **EXTREME**: *"Extreme heat conditions detected. Avoid unnecessary outdoor activity, stay hydrated, keep vulnerable individuals indoors, and take immediate cooling precautions."*
- Interactive form to broadcast custom alerts via `POST /api/alerts`.

---

## 🚀 Running the Project

### Option A: Running the Microservices Architecture (Recommended Lab Demo)

Open 5 separate terminal tabs or windows:

#### Terminal 1: Weather Service (Port 5001)
```powershell
cd microservices/weather-service
node server.js
```

#### Terminal 2: Prediction Service (Port 5002)
```powershell
cd microservices/prediction-service
node server.js
```

#### Terminal 3: Hotspot Service (Port 5003)
```powershell
cd microservices/hotspot-service
node server.js
```

#### Terminal 4: Alert & Advisory Service (Port 5004)
```powershell
cd microservices/alert-service
node server.js
```

#### Terminal 5: Frontend Application (Port 5173)
```powershell
cd frontend
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

### Option B: Running the Monolithic Architecture

#### Terminal 1: Monolith Backend (Port 5000)
```powershell
cd monolith/backend
node server.js
```

#### Terminal 2: Frontend
```powershell
cd frontend
npm run dev
```
In the web UI header, switch the **Architecture Mode** dropdown to **Monolith (Port 5000)**.

---

### Option C: Running the 3-Tier Layered Architecture

#### Terminal 1: 3-Tier Backend (Port 5010)
```powershell
cd three-tier/backend
node server.js
```

#### Terminal 2: Frontend
```powershell
cd frontend
npm run dev
```
In the web UI header, switch the **Architecture Mode** dropdown to **3-Tier Layered (Port 5010)**.

---

## 🔬 How to Demonstrate Microservice Fault Isolation to Faculty

Follow these exact steps during your lab demonstration:

1. **Verify All Services Running**:
   - Ensure all 4 microservices are active on Ports 5001, 5002, 5003, and 5004.
   - Open `http://localhost:5173`.
   - Observe the green status indicators at the top:
     - 🟢 Weather (`:5001`)
     - 🟢 Prediction (`:5002`)
     - 🟢 Hotspots (`:5003`)
     - 🟢 Alerts (`:5004`)

2. **Simulate a Component Failure**:
   - Go to **Terminal 2** (Prediction Service) and press **`Ctrl + C`** to stop the process.

3. **Demonstrate System Resilience**:
   - Go back to the browser and click **🔄 Check Ports**.
   - Show the examiner:
     - 🔴 **Prediction (`:5002`)** turns red and displays: *"Prediction Service Unavailable (Port 5002 offline)"*.
     - 🟢 **Weather Monitoring tab** still loads city temperatures and humidity without any issue!
     - 🟢 **Hotspots table** and **Alerts & Advisory tab** continue to function 100% normally!
   - **Explain**: *"In a microservice architecture, each service runs in an isolated process. A crash in the prediction engine does not bring down our weather monitoring or alert notification infrastructure."*

4. **Contrast with Monolith**:
   - Explain to the examiner that in the Monolithic version on Port 5000, if an unhandled exception crashes the process, **all four features (Weather, Prediction, Hotspots, Alerts) instantly crash together**.

---

## 📡 REST API Reference

### Microservices Mode
| Service | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Weather (5001)** | `/api/weather` | `GET` | Get all weather records |
| **Weather (5001)** | `/api/weather/:city` | `GET` | Get weather for specific city |
| **Prediction (5002)**| `/api/prediction/:city` | `GET` | Get rule-based prediction for city |
| **Prediction (5002)**| `/api/prediction` | `POST` | Calculate prediction dynamically for custom temp |
| **Hotspot (5003)** | `/api/hotspots` | `GET` | Get all thermal hotspot locations |
| **Hotspot (5003)** | `/api/hotspots/high-risk` | `GET` | Filter only HIGH and EXTREME risk hotspots |
| **Alert (5004)** | `/api/alerts` | `GET` | Get all alerts |
| **Alert (5004)** | `/api/alerts/active` | `GET` | Get active alerts only |
| **Alert (5004)** | `/api/advisory/:city` | `GET` | Get citizen advisory directive for city |
| **Alert (5004)** | `/api/alerts` | `POST` | Broadcast new emergency alert |

---

## 🎓 DevOps Lab Viva Q&A Cheat-Sheet

**Q1: What is the key structural difference between Monolithic and 3-Tier architecture?**
> *Answer*: A Monolith puts all routes, logic, and data handling into a single application without strict layer boundaries. A 3-Tier architecture cleanly separates Presentation (React), Business Logic (Controllers & Services), and Data Access (Repositories) into distinct layers with clear responsibilities, making code more maintainable and testable.

**Q2: What is the main advantage of Microservices demonstrated in this lab?**
> *Answer*: **Fault Isolation and Independent Deployability**. Each service runs as an independent process on its own port. If one service fails or requires an update, other services continue serving traffic without downtime.

**Q3: How do the microservices communicate with the frontend?**
> *Answer*: Through asynchronous HTTP REST APIs using JSON payloads. The frontend holds a central configuration file (`api.js`) pointing to each dedicated service port.

**Q4: Why wasn't an API Gateway used in this prototype?**
> *Answer*: To keep the college lab prototype simple, minimal, and transparent. The frontend connects directly to each microservice's port, making it easy to observe individual port traffic and verify service isolation without gateway abstraction.
