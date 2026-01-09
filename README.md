# AirWatch - Global Air Quality Monitor

A real-time air quality monitoring web application with an interactive 3D globe visualization.

![AirWatch](https://img.shields.io/badge/AirWatch-v1.0.0-blue)

## Features

- **Interactive 3D Globe** - Visualize air quality stations worldwide with color-coded markers
- **Real-time AQI Data** - Powered by AQICN API
- **City Search** - Find and explore air quality for any city
- **Detailed Analytics** - Pollutant breakdowns, weather conditions, and forecasts
- **City Comparison** - Compare up to 3 cities side by side
- **Favorites** - Save cities for quick access
- **Dark/Light Theme** - Eye-friendly viewing options

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **3D Visualization**: Three.js, React Three Fiber
- **Charts**: Recharts
- **Styling**: TailwindCSS
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Backend**: Express.js (API proxy)

## Getting Started

### Prerequisites

- Node.js 18+
- AQICN API token (get one at https://aqicn.org/data-platform/token/)

### Installation

```bash
# Install dependencies
npm install

# Set your API token
export AQICN_TOKEN=your_token_here

# Start the backend server
npm run server

# In another terminal, start the frontend
npm run dev
```

### Development

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/feed/:city` | Get AQI data for a city |
| `GET /api/search?keyword=` | Search for cities |
| `GET /api/map/bounds` | Get all stations in bounds |
| `GET /api/health` | Health check |

## AQI Scale

| AQI | Level | Color |
|-----|-------|-------|
| 0-50 | Good | Green |
| 51-100 | Moderate | Yellow |
| 101-150 | Unhealthy for Sensitive | Orange |
| 151-200 | Unhealthy | Red |
| 201-300 | Very Unhealthy | Purple |
| 300+ | Hazardous | Maroon |

## License

MIT
