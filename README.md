<div align="center">

# ðŸŒ± CRAI â€” Crop Risk AI

### Intelligent Crop-Risk Monitoring & Agricultural Decision Support

**Computer Vision Â· IoT Â· Environmental Intelligence Â· Risk Analytics Â· AI Advisory**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-AI%2FML-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![ESP32](https://img.shields.io/badge/Edge-ESP32-E7352C?style=flat-square&logo=espressif&logoColor=white)](https://www.espressif.com/)

<br/>

> **CRAI turns crop observations and field evidence into structured crop-risk intelligence that can be understood and acted upon.**

</div>

---

## ðŸŒ¾ Project Overview

**CRAI (Crop Risk AI)** is a smart-agriculture platform for observing crop conditions, combining multiple evidence sources, and presenting risk-oriented insights through a modern web dashboard.

The platform follows a simple principle:

> **Observe â†’ Understand â†’ Correlate â†’ Advise**

Instead of treating a crop image, sensor reading, or environmental signal as an isolated event, CRAI brings available evidence together into a unified decision-support workflow.

### Intelligence Layers

| Layer | Role |
|---|---|
| ðŸŒ¿ **Crop Vision** | Analyze crop images for potential disease or abnormal conditions |
| ðŸŒ¡ï¸ **Field Sensing** | Capture environmental and field observations |
| ðŸ§© **Evidence Intelligence** | Correlate available observations before forming a broader risk view |
| ðŸ§  **Risk Intelligence** | Translate evidence into a structured crop-risk state |
| ðŸ’¬ **AI Advisory** | Convert technical analysis into understandable agricultural guidance |
| ðŸ“Š **Monitoring Platform** | Present observations and intelligence through one dashboard |

---

## âœ¨ Core Capabilities

| Capability | Description |
|---|---|
| ðŸŒ¿ **Crop Image Intelligence** | AI-assisted crop image analysis for potential disease-related conditions |
| ðŸŒ¡ï¸ **Field & Environmental Awareness** | Sensor observations add context around crop conditions |
| ðŸ§© **Multi-Source Intelligence** | Combines different evidence types into a broader crop-risk view |
| ðŸ”Ž **Evidence-Aware Workflow** | Additional evidence can be requested when available information is insufficient |
| ðŸ§  **AI Advisory** | LLM-assisted layer converts analysis into human-readable guidance |
| ðŸ“¡ **Live Monitoring** | Live observation, sensor status and system health |
| ðŸ•˜ **History** | Review previous observations and analysis |
| ðŸ“‘ **Reports** | Structured reporting and review |
| âš™ï¸ **System Controls** | Application and system configuration |

---

## ðŸ§  System Architecture

```mermaid
flowchart LR
    A[Crop Image] --> B[Computer Vision AI]
    C[Field Sensors] --> D[Evidence Processing]
    E[Environmental Context] --> D
    B --> D

    D --> F[Risk Intelligence]
    F --> G{Evidence Sufficient?}

    G -->|Yes| H[Risk State]
    G -->|Additional Evidence| I[Evidence Acquisition]

    I --> D
    H --> J[AI Advisory]
    J --> K[CRAI Dashboard]
    K --> L[Farmer / Operator Insights]
```

### End-to-End Flow

**Crop / Field â†’ Observation â†’ Evidence Processing â†’ Risk Intelligence â†’ Advisory â†’ Dashboard**

The public repository documents the architecture at a conceptual level. Private decision rules, model artifacts, unpublished thresholds, prompts and research implementation remain outside this showcase repository.

---

## ðŸ—ï¸ Application Modules

| Module | Purpose |
|---|---|
| **Overview** | High-level crop and system status |
| **Observe** | Crop observation and image-analysis workflow |
| **Intelligence** | Risk-oriented analysis and AI insights |
| **Sensors** | Field-sensor observations and device status |
| **History** | Previous observations and analysis |
| **Reports** | Structured reporting and review |
| **Settings** | Application and system configuration |

---

## ðŸ› ï¸ Technology Stack

### Frontend
- React 18
- Vite
- JavaScript / ES Modules
- React Hooks
- Fetch API
- Local Storage
- Responsive SaaS-style dashboard UI

### Backend
- Python 3
- FastAPI
- Uvicorn
- Pydantic / Pydantic Settings
- SQLAlchemy
- SQLite for local engineering workflows
- REST API architecture

### AI / ML
- PyTorch
- TorchVision
- Computer Vision
- Image preprocessing
- ML-based risk modelling components
- Local LLM-assisted advisory
- Data and model evaluation workflows

### Edge / IoT
- ESP32
- Environmental sensing
- Device-to-application communication
- Real vs. simulated observation handling
- Field evidence acquisition

### Engineering
- Git & GitHub
- VS Code
- npm
- Python virtual environments
- PowerShell
- HTTP/API testing
- GitHub Actions

---

## ðŸ”Œ Integration Surface

The public frontend is structured around a REST integration layer with capabilities including:

| Endpoint | Purpose |
|---|---|
| `/api/health` | System health |
| `/api/ai/status` | AI service status |
| `/api/observations` | Observation retrieval |
| `/api/live/latest` | Latest live observation |
| `/api/live/image` | Latest live image |
| `/api/field-sensors/readings` | Sensor observations |
| `/api/field-sensors/requests/pending` | Evidence acquisition requests |
| `/api/field-sensors/requests` | Create sensor/evidence requests |
| `/api/analysis/image` | Crop image analysis |

> **Public-repository boundary:** private model weights, datasets, credentials, internal prompts, unpublished thresholds and proprietary decision logic are intentionally excluded.

---

## ðŸ“ Repository Structure

```text
CRAI-Crop-Risk-AI/
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ utils/
â”‚   â”œâ”€â”€ package.json
â”‚   â”œâ”€â”€ package-lock.json
â”‚   â””â”€â”€ vite.config.js
â”‚
â”œâ”€â”€ backend/
â”‚   â””â”€â”€ requirements.txt
â”‚
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ ARCHITECTURE.md
â”‚   â”œâ”€â”€ TECH-STACK.md
â”‚   â””â”€â”€ DEMO.md
â”‚
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”‚       â””â”€â”€ frontend-build.yml
â”‚
â”œâ”€â”€ CONTRIBUTING.md
â”œâ”€â”€ SECURITY.md
â”œâ”€â”€ LICENSE
â””â”€â”€ README.md
```

---

## ðŸš€ Run the Public Frontend

### Prerequisites

- Node.js 20+ recommended
- npm

### Install

```bash
cd frontend
npm install
```

### Configure the API

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

Set the backend URL when connecting to a running CRAI backend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Start

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

### Production build

```bash
npm run build
```

> The complete engineering backend and AI implementation is maintained separately from this public showcase.

---

## ðŸ§ª Engineering Philosophy

### Evidence before assumption
Available observations should be considered before forming a broader risk interpretation.

### Decision before decoration
The interface prioritizes useful system state and decision context over unnecessary visual complexity.

### Explainable intelligence
AI outputs should be understandable enough for a human to review.

### Human-in-the-loop agriculture
CRAI is designed as a decision-support platform, not a replacement for agricultural expertise.

---

## ðŸ” Public Showcase & Intellectual Property

This repository is the **public product showcase** for CRAI.

The complete engineering implementation is maintained separately. The public repository deliberately excludes:

- Private model weights
- Private datasets
- Credentials and secrets
- Internal prompts
- Proprietary decision rules
- Internal thresholds
- Unpublished research artifacts
- Sensitive experimental data

See [SECURITY.md](SECURITY.md) for repository handling guidelines.

---

## ðŸ“Œ Project Status

**Active development / prototype**

Current engineering focus:

- Crop image intelligence
- Field-sensor integration
- Multi-source crop-risk intelligence
- AI-assisted agricultural advisory
- Live monitoring
- Reliability and demo readiness
- Dashboard and reporting refinement

---

## ðŸ“š Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Technology Stack](docs/TECH-STACK.md)
- [Demo Guide](docs/DEMO.md)
- [Security](SECURITY.md)
- [Contributing](CONTRIBUTING.md)

---

<div align="center">

### ðŸŒ± CRAI â€” From Field Evidence to Crop Intelligence

**Observe. Correlate. Understand. Act.**

</div>
