# CRAI Public Frontend

The public CRAI web interface is a modular React/Vite application for crop observation, field awareness, risk intelligence and agricultural advisory workflows.

## UI Modules

- **Overview** — system and crop intelligence at a glance
- **Observe** — crop observation and image-analysis workflow
- **Intelligence** — risk-oriented intelligence and AI insights
- **Sensors** — field-sensor observations and device state
- **History** — previous observations and analysis
- **Reports** — structured review and reporting
- **Settings** — application configuration

## Frontend Architecture

- `src/App.jsx` — application composition and navigation
- `src/hooks/useCRAI.js` — frontend CRAI workflow orchestration
- `src/services/api.js` — REST API client
- `src/components/common/UI.jsx` — reusable interface primitives
- `src/components/layout/Shell.jsx` — application navigation shell
- `src/components/map/FarmMap.jsx` — interactive field/zone visualization
- `src/pages/*` — product modules
- `src/utils/crai.js` — shared formatting and intelligence helpers

## Backend Integration

The frontend communicates with the CRAI FastAPI service through a configurable API base URL.

Example:

```env
VITE_API_URL=http://127.0.0.1:8000