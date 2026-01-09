# AirWatch - Enhanced Air Quality Monitoring Platform

## Vision
A next-generation air quality monitoring web app that goes beyond AqiFind with:
- Interactive 3D globe visualization (Three.js)
- Real-time AQI data from AQICN API
- Weather integration
- Health recommendations
- Historical trends & forecasting
- City comparison tools

## Core Features (MVP)

### 1. 3D Globe Visualization
- Interactive Earth with pollution hotspots
- Color-coded markers (green→red based on AQI)
- Click markers to see station details
- Zoom to user's location on load
- Smooth camera transitions

### 2. City Search & Details
- Autocomplete city search
- Current AQI with pollutant breakdown (PM2.5, PM10, O3, NO2, SO2, CO)
- Weather conditions (temp, humidity, wind)
- Health recommendations based on AQI level
- "Add to favorites" functionality

### 3. Data Visualization
- AQI gauge/dial component
- Pollutant bar charts
- 7-day forecast graph
- Historical trend line chart
- AQI scale legend with health categories

### 4. Comparison Mode
- Compare 2-3 cities side by side
- Overlay trend lines
- Export comparison as image

### 5. Alerts & Personalization
- Set AQI threshold alerts
- Save favorite cities
- Dark/light theme
- Geolocation-based defaults

## Tech Stack Decision

### Frontend
- **React 18** + TypeScript
- **Vite** for build tooling
- **Three.js** + React Three Fiber for 3D globe
- **Recharts** for data visualization
- **TailwindCSS** + shadcn/ui for styling
- **Zustand** for state management
- **TanStack Query** for data fetching

### Backend (Light)
- **Next.js API routes** OR simple Express server
- Proxy for AQICN API (hide API key)
- Optional: cache layer (Redis/in-memory)

### External APIs
- **AQICN API** - Air quality data (https://aqicn.org/api/)
- **OpenWeatherMap** - Weather data (optional enhancement)

## Agent Strategy

For this build, the 3 most important agents are:

### Agent 1: Architecture Planner
- Design folder structure
- Define data flow
- Plan component hierarchy
- Establish coding conventions

### Agent 2: API & Data Contract Designer
- Map AQICN API endpoints needed
- Define TypeScript interfaces
- Plan caching strategy
- Design error handling

### Agent 3: UI Component Architect
- Design component library
- Define Tailwind tokens
- Plan responsive breakpoints
- Create component specifications

## Implementation Phases

### Phase 1: Foundation (Core)
- [ ] Project scaffolding (Vite + React + TS)
- [ ] Tailwind + shadcn setup
- [ ] Basic routing (React Router)
- [ ] API proxy setup
- [ ] Core types/interfaces

### Phase 2: Globe & Map
- [ ] Three.js globe component
- [ ] Station markers on globe
- [ ] Camera controls
- [ ] Click-to-select interaction
- [ ] Loading states

### Phase 3: Data & Search
- [ ] City search with autocomplete
- [ ] AQI data fetching
- [ ] Pollutant breakdown display
- [ ] Weather integration
- [ ] Error handling

### Phase 4: Visualizations
- [ ] AQI gauge component
- [ ] Pollutant charts
- [ ] Trend graphs
- [ ] Forecast display

### Phase 5: Polish
- [ ] Favorites system
- [ ] Theme toggle
- [ ] Mobile responsive
- [ ] Performance optimization
- [ ] Animations

## Success Metrics
- First Contentful Paint < 1.5s
- Globe loads within 3s
- Search autocomplete < 200ms
- Smooth 60fps globe rotation
- Mobile-friendly layout

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| AQICN rate limits | Implement caching, batch requests |
| 3D performance on mobile | Use LOD, reduce polygon count |
| Large bundle size | Code splitting, lazy load 3D |
| API key exposure | Use backend proxy |
