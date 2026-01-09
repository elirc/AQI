# AirWatch Architecture Report

**Version:** 1.0
**Date:** 2026-01-08
**Status:** Blueprint

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Component Hierarchy](#3-component-hierarchy)
4. [Data Flow Diagram](#4-data-flow-diagram)
5. [State Management Plan](#5-state-management-plan)
6. [File Naming Conventions](#6-file-naming-conventions)
7. [Key Technical Decisions](#7-key-technical-decisions)
8. [API Design](#8-api-design)
9. [Type Definitions](#9-type-definitions)
10. [Development Phases](#10-development-phases)

---

## 1. Project Overview

**AirWatch** is a real-time air quality monitoring web application featuring an interactive 3D globe visualization. Users can explore air quality data globally, view detailed city-level information, and track historical trends.

### Tech Stack Summary

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| 3D Graphics | Three.js via React Three Fiber | 8.x |
| Styling | TailwindCSS + shadcn/ui | 3.x |
| State Management | Zustand | 4.x |
| Data Fetching | TanStack Query | 5.x |
| Charts | Recharts | 2.x |
| Backend | Express.js (API Proxy) | 4.x |

---

## 2. Folder Structure

```
airwatch/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
│
├── docs/
│   └── claude/
│       ├── 01-architecture-report.md # This document
│       ├── 02-component-specs.md     # Detailed component specifications
│       └── 03-api-documentation.md   # API endpoint documentation
│
├── public/
│   ├── textures/
│   │   ├── earth-day.jpg            # Earth texture for day mode
│   │   ├── earth-night.jpg          # Earth texture for night mode
│   │   └── earth-bump.jpg           # Bump map for terrain
│   ├── favicon.ico
│   └── robots.txt
│
├── server/                          # Express API Proxy
│   ├── src/
│   │   ├── index.ts                 # Server entry point
│   │   ├── routes/
│   │   │   ├── index.ts             # Route aggregator
│   │   │   ├── air-quality.ts       # /api/air-quality endpoints
│   │   │   └── geocoding.ts         # /api/geocoding endpoints
│   │   ├── middleware/
│   │   │   ├── rate-limiter.ts      # Rate limiting middleware
│   │   │   ├── cache.ts             # Response caching
│   │   │   └── error-handler.ts     # Global error handler
│   │   ├── services/
│   │   │   ├── openaq.service.ts    # OpenAQ API integration
│   │   │   ├── waqi.service.ts      # WAQI API integration
│   │   │   └── geocoding.service.ts # Geocoding service
│   │   ├── utils/
│   │   │   └── api-client.ts        # HTTP client wrapper
│   │   └── types/
│   │       └── index.ts             # Server-side types
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── src/                             # React Frontend
│   ├── main.tsx                     # Application entry point
│   ├── App.tsx                      # Root component with providers
│   ├── vite-env.d.ts               # Vite type declarations
│   │
│   ├── assets/
│   │   ├── icons/
│   │   │   └── aqi-markers/        # AQI level marker icons
│   │   └── images/
│   │       └── logo.svg            # App logo
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Top navigation bar
│   │   │   ├── Sidebar.tsx          # Left sidebar with controls
│   │   │   ├── Footer.tsx           # Footer with attribution
│   │   │   └── MainLayout.tsx       # Layout wrapper component
│   │   │
│   │   ├── globe/
│   │   │   ├── Globe.tsx            # Main 3D globe component
│   │   │   ├── GlobeCanvas.tsx      # R3F Canvas wrapper
│   │   │   ├── GlobeControls.tsx    # Orbit controls + interactions
│   │   │   ├── GlobeLighting.tsx    # Scene lighting setup
│   │   │   ├── EarthMesh.tsx        # Earth sphere with textures
│   │   │   ├── AtmosphereShader.tsx # Atmospheric glow effect
│   │   │   ├── AqiMarker.tsx        # Single AQI data point marker
│   │   │   ├── AqiMarkerCluster.tsx # Clustered markers for zoom
│   │   │   ├── AqiHeatmap.tsx       # Optional heatmap overlay
│   │   │   └── CameraController.tsx # Camera position/animation
│   │   │
│   │   ├── panels/
│   │   │   ├── InfoPanel.tsx        # Main info panel container
│   │   │   ├── CityDetails.tsx      # Selected city details view
│   │   │   ├── PollutantBreakdown.tsx # Individual pollutant cards
│   │   │   ├── HealthRecommendations.tsx # Health advice based on AQI
│   │   │   └── ComparisonPanel.tsx  # City comparison view
│   │   │
│   │   ├── charts/
│   │   │   ├── AqiTrendChart.tsx    # Historical AQI line chart
│   │   │   ├── PollutantBarChart.tsx # Pollutant comparison bars
│   │   │   ├── DailyPatternChart.tsx # 24-hour pattern visualization
│   │   │   └── ChartTooltip.tsx     # Custom chart tooltips
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.tsx        # Main search input
│   │   │   ├── SearchResults.tsx    # Search results dropdown
│   │   │   ├── RecentSearches.tsx   # Recent search history
│   │   │   └── LocationSuggestion.tsx # Single suggestion item
│   │   │
│   │   ├── filters/
│   │   │   ├── FilterBar.tsx        # Filter controls container
│   │   │   ├── AqiRangeFilter.tsx   # AQI range slider
│   │   │   ├── PollutantFilter.tsx  # Pollutant type selector
│   │   │   ├── TimeRangeFilter.tsx  # Date/time range picker
│   │   │   └── RegionFilter.tsx     # Country/region selector
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.tsx   # Loading indicator
│   │       ├── ErrorBoundary.tsx    # Error boundary wrapper
│   │       ├── ErrorFallback.tsx    # Error display component
│   │       ├── AqiIndicator.tsx     # AQI level badge/indicator
│   │       ├── PollutantIcon.tsx    # Pollutant type icons
│   │       └── EmptyState.tsx       # No data placeholder
│   │
│   ├── hooks/
│   │   ├── useAirQuality.ts         # TanStack Query hook for AQ data
│   │   ├── useGeoLocation.ts        # Browser geolocation hook
│   │   ├── useGlobeCamera.ts        # Globe camera controls hook
│   │   ├── useSearchLocations.ts    # Location search hook
│   │   ├── useHistoricalData.ts     # Historical data fetching
│   │   ├── useDebounce.ts           # Debounce utility hook
│   │   ├── useMediaQuery.ts         # Responsive breakpoint hook
│   │   └── useLocalStorage.ts       # Local storage persistence
│   │
│   ├── stores/
│   │   ├── index.ts                 # Store exports
│   │   ├── useGlobeStore.ts         # Globe state (camera, markers)
│   │   ├── useFilterStore.ts        # Filter/query state
│   │   ├── useSelectionStore.ts     # Selected city/region state
│   │   ├── useComparisonStore.ts    # City comparison state
│   │   └── useUIStore.ts            # UI state (panels, modals)
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts            # Axios/fetch client setup
│   │   │   ├── air-quality.api.ts   # AQ endpoint functions
│   │   │   ├── geocoding.api.ts     # Geocoding endpoint functions
│   │   │   └── types.ts             # API response types
│   │   └── queryClient.ts           # TanStack Query client config
│   │
│   ├── lib/
│   │   ├── utils.ts                 # shadcn/ui utility (cn function)
│   │   ├── constants.ts             # App-wide constants
│   │   ├── aqi-utils.ts             # AQI calculation utilities
│   │   ├── geo-utils.ts             # Geographic calculations
│   │   ├── color-scales.ts          # AQI color mappings
│   │   └── formatters.ts            # Date/number formatters
│   │
│   ├── types/
│   │   ├── index.ts                 # Type exports
│   │   ├── air-quality.types.ts     # AQ data types
│   │   ├── location.types.ts        # Location/geo types
│   │   ├── filter.types.ts          # Filter state types
│   │   └── globe.types.ts           # Globe/3D related types
│   │
│   └── styles/
│       ├── globals.css              # Global styles + Tailwind
│       └── globe.css                # Globe-specific styles
│
├── tests/
│   ├── setup.ts                     # Test setup file
│   ├── components/
│   │   └── Globe.test.tsx           # Component tests
│   ├── hooks/
│   │   └── useAirQuality.test.ts    # Hook tests
│   └── utils/
│       └── aqi-utils.test.ts        # Utility tests
│
├── .env.example                     # Environment variables template
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore                       # Git ignore patterns
├── .prettierrc                      # Prettier configuration
├── components.json                  # shadcn/ui configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # Node TypeScript config
└── vite.config.ts                   # Vite configuration
```

### Folder Explanations

| Folder | Purpose |
|--------|---------|
| `server/` | Express.js API proxy to secure API keys and add caching |
| `src/components/ui/` | Auto-generated shadcn/ui primitives |
| `src/components/globe/` | All 3D globe-related React Three Fiber components |
| `src/components/panels/` | Information display panels and detail views |
| `src/components/charts/` | Recharts-based data visualization components |
| `src/stores/` | Zustand state stores, split by domain |
| `src/services/` | API client and TanStack Query configuration |
| `src/lib/` | Pure utility functions and constants |
| `src/types/` | TypeScript type definitions |

---

## 3. Component Hierarchy

```
App.tsx
├── QueryClientProvider (TanStack Query)
│   └── MainLayout.tsx
│       ├── Header.tsx
│       │   ├── Logo
│       │   ├── SearchBar.tsx
│       │   │   ├── Input (shadcn)
│       │   │   └── SearchResults.tsx
│       │   │       └── LocationSuggestion.tsx (×n)
│       │   └── ThemeToggle
│       │
│       ├── Sidebar.tsx
│       │   ├── FilterBar.tsx
│       │   │   ├── AqiRangeFilter.tsx
│       │   │   │   └── Slider (shadcn)
│       │   │   ├── PollutantFilter.tsx
│       │   │   │   └── Select (shadcn)
│       │   │   ├── TimeRangeFilter.tsx
│       │   │   └── RegionFilter.tsx
│       │   │       └── DropdownMenu (shadcn)
│       │   └── RecentSearches.tsx
│       │
│       ├── main (content area)
│       │   ├── GlobeCanvas.tsx
│       │   │   └── Canvas (R3F)
│       │   │       ├── GlobeLighting.tsx
│       │   │       │   ├── AmbientLight
│       │   │       │   └── DirectionalLight
│       │   │       ├── Globe.tsx
│       │   │       │   ├── EarthMesh.tsx
│       │   │       │   ├── AtmosphereShader.tsx
│       │   │       │   └── AqiMarkerCluster.tsx
│       │   │       │       └── AqiMarker.tsx (×n)
│       │   │       ├── GlobeControls.tsx
│       │   │       └── CameraController.tsx
│       │   │
│       │   └── InfoPanel.tsx (conditional)
│       │       ├── CityDetails.tsx
│       │       │   ├── AqiIndicator.tsx
│       │       │   └── HealthRecommendations.tsx
│       │       ├── PollutantBreakdown.tsx
│       │       │   └── Card (shadcn) (×n)
│       │       └── Tabs (shadcn)
│       │           ├── AqiTrendChart.tsx
│       │           ├── PollutantBarChart.tsx
│       │           └── DailyPatternChart.tsx
│       │
│       ├── ComparisonPanel.tsx (Sheet - shadcn)
│       │   └── City comparison cards
│       │
│       └── Footer.tsx
│
└── Toaster (shadcn) - Global notifications
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `App.tsx` | Provider setup, global error boundary |
| `MainLayout.tsx` | Grid layout, responsive breakpoints |
| `Header.tsx` | Navigation, search, theme toggle |
| `Sidebar.tsx` | Filters, saved locations |
| `GlobeCanvas.tsx` | R3F Canvas setup, WebGL context |
| `Globe.tsx` | Globe composition, marker data |
| `EarthMesh.tsx` | Textured sphere geometry |
| `AqiMarker.tsx` | Individual 3D marker with AQI data |
| `InfoPanel.tsx` | Detail panel orchestration |
| `CityDetails.tsx` | Selected location info display |

---

## 4. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERACTIONS                               │
└─────────────────────────────────────────────────────────────────────────────┘
        │                    │                    │                    │
        ▼                    ▼                    ▼                    ▼
   ┌─────────┐         ┌──────────┐        ┌──────────┐        ┌──────────┐
   │ Search  │         │  Filter  │        │  Globe   │        │   Map    │
   │ Input   │         │ Controls │        │  Click   │        │ Navigate │
   └────┬────┘         └────┬─────┘        └────┬─────┘        └────┬─────┘
        │                   │                   │                   │
        ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ZUSTAND STORES                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │ filterStore  │  │ selectionStore│ │   globeStore   │  │    uiStore    │  │
│  │              │  │              │  │                │  │               │  │
│  │ - aqiRange   │  │ - selectedId │  │ - cameraPos    │  │ - panelOpen   │  │
│  │ - pollutants │  │ - compareIds │  │ - zoomLevel    │  │ - activeTab   │  │
│  │ - timeRange  │  │ - hoveredId  │  │ - rotation     │  │ - theme       │  │
│  │ - region     │  │              │  │                │  │               │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  └───────┬───────┘  │
└─────────┼─────────────────┼──────────────────┼───────────────────┼──────────┘
          │                 │                  │                   │
          ▼                 ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TANSTACK QUERY LAYER                                 │
│                                                                              │
│  useQuery('air-quality', { filters }) ──────────────────────────────────┐   │
│  useQuery('location-details', { id }) ──────────────────────────────────┤   │
│  useQuery('historical', { id, range }) ─────────────────────────────────┤   │
│  useQuery('search', { query }) ─────────────────────────────────────────┤   │
│                                                                         │   │
│  Features:                                                              │   │
│  - Automatic background refetch                                         │   │
│  - Stale-while-revalidate                                              │   │
│  - Request deduplication                                                │   │
│  - Cache persistence                                                    │   │
└─────────────────────────────────────────────────────────────────────────┼───┘
                                                                          │
                                                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API SERVICE LAYER                                  │
│                                                                              │
│  src/services/api/                                                          │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ air-quality.api │    │  geocoding.api  │    │    client.ts    │         │
│  │                 │    │                 │    │                 │         │
│  │ getStations()   │    │ searchPlaces()  │    │ axios instance  │         │
│  │ getByCoords()   │    │ reverseGeocode()│    │ interceptors    │         │
│  │ getHistorical() │    │                 │    │ error handling  │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
└───────────┼──────────────────────┼──────────────────────┼───────────────────┘
            │                      │                      │
            └──────────────────────┴──────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS API PROXY (server/)                          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          Middleware Stack                            │    │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐       │    │
│  │  │   CORS   │ -> │  Rate    │ -> │  Cache   │ -> │  Error   │       │    │
│  │  │          │    │  Limiter │    │          │    │  Handler │       │    │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Routes:                                                                     │
│  GET  /api/air-quality/stations    -> OpenAQ/WAQI                           │
│  GET  /api/air-quality/:id         -> Station details                        │
│  GET  /api/air-quality/historical  -> Historical data                        │
│  GET  /api/geocoding/search        -> Location search                        │
│  GET  /api/geocoding/reverse       -> Reverse geocoding                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL APIs (with API Keys)                        │
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │     OpenAQ      │    │      WAQI       │    │   Nominatim/    │          │
│  │   (Primary)     │    │   (Secondary)   │    │   Mapbox Geo    │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

1. **User Action** -> Updates Zustand store (immediate UI feedback)
2. **Store Change** -> Triggers TanStack Query refetch (if needed)
3. **Query** -> Calls API service function
4. **API Service** -> Makes request to Express proxy
5. **Express Proxy** -> Adds API key, caches, rate-limits
6. **External API** -> Returns data
7. **Response bubbles up** -> Query cache updates -> Components re-render

---

## 5. State Management Plan

### State Distribution Matrix

| State | Location | Rationale |
|-------|----------|-----------|
| **Air quality data** | TanStack Query cache | Server state, needs caching/refetching |
| **Search results** | TanStack Query cache | Server state, debounced queries |
| **Historical data** | TanStack Query cache | Large datasets, cache important |
| **Camera position** | `useGlobeStore` (Zustand) | Shared across components, no persistence |
| **Selected location** | `useSelectionStore` (Zustand) | Shared, triggers panel/queries |
| **Compared cities** | `useComparisonStore` (Zustand) | Multi-select state |
| **Active filters** | `useFilterStore` (Zustand) | Shared, persisted to URL |
| **Panel open/closed** | `useUIStore` (Zustand) | UI state, shared |
| **Theme (dark/light)** | `useUIStore` + localStorage | Persistent preference |
| **Form inputs** | Local component state | Isolated, no sharing needed |
| **Hover states** | Local component state | Ephemeral, performance |
| **Animation states** | Local/R3F useFrame | Frame-specific, high frequency |

### Zustand Store Definitions

```typescript
// useGlobeStore.ts
interface GlobeState {
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  zoomLevel: number;
  isAnimating: boolean;
  autoRotate: boolean;

  // Actions
  setCameraPosition: (pos: [number, number, number]) => void;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  resetView: () => void;
  setAutoRotate: (rotate: boolean) => void;
}

// useSelectionStore.ts
interface SelectionState {
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
  comparisonIds: string[];

  // Actions
  selectLocation: (id: string | null) => void;
  hoverLocation: (id: string | null) => void;
  addToComparison: (id: string) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
}

// useFilterStore.ts
interface FilterState {
  aqiRange: [number, number];
  pollutants: PollutantType[];
  timeRange: { start: Date; end: Date } | null;
  regions: string[];

  // Actions
  setAqiRange: (range: [number, number]) => void;
  togglePollutant: (pollutant: PollutantType) => void;
  setTimeRange: (range: { start: Date; end: Date } | null) => void;
  setRegions: (regions: string[]) => void;
  resetFilters: () => void;
}

// useUIStore.ts
interface UIState {
  infoPanelOpen: boolean;
  comparisonPanelOpen: boolean;
  activeInfoTab: 'overview' | 'history' | 'pollutants';
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';

  // Actions
  setInfoPanelOpen: (open: boolean) => void;
  setComparisonPanelOpen: (open: boolean) => void;
  setActiveInfoTab: (tab: string) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

### URL State (via URLSearchParams)

Persisted to URL for shareability:
- `?lat=40.7128&lng=-74.0060` - Camera position
- `?location=abc123` - Selected location ID
- `?aqi=0-100` - AQI filter range
- `?pollutants=pm25,o3` - Active pollutants
- `?compare=id1,id2,id3` - Comparison list

---

## 6. File Naming Conventions

### Components

| Pattern | Example | Usage |
|---------|---------|-------|
| `PascalCase.tsx` | `GlobeCanvas.tsx` | React components |
| `PascalCase.test.tsx` | `GlobeCanvas.test.tsx` | Component tests |
| `use[Name].ts` | `useAirQuality.ts` | Custom hooks |
| `use[Name]Store.ts` | `useGlobeStore.ts` | Zustand stores |

### Utilities and Services

| Pattern | Example | Usage |
|---------|---------|-------|
| `kebab-case.ts` | `aqi-utils.ts` | Utility modules |
| `[domain].api.ts` | `air-quality.api.ts` | API service files |
| `[domain].types.ts` | `air-quality.types.ts` | Type definition files |
| `[domain].service.ts` | `openaq.service.ts` | Backend services |

### Directories

| Pattern | Example | Usage |
|---------|---------|-------|
| `kebab-case/` | `air-quality/` | Feature folders |
| `lowercase/` | `components/` | Standard folders |

### File Organization Rules

1. **One component per file** - No multiple exports of components
2. **Co-locate tests** - Tests in `tests/` mirror `src/` structure
3. **Index files for barrels** - Use `index.ts` only for store/type exports
4. **Types with implementations** - Keep types close to usage

### Import Aliases (tsconfig paths)

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@components/*": ["./src/components/*"],
    "@hooks/*": ["./src/hooks/*"],
    "@stores/*": ["./src/stores/*"],
    "@services/*": ["./src/services/*"],
    "@lib/*": ["./src/lib/*"],
    "@types/*": ["./src/types/*"]
  }
}
```

---

## 7. Key Technical Decisions

### Decision 1: React Three Fiber over vanilla Three.js

**Choice:** Use `@react-three/fiber` and `@react-three/drei`

**Rationale:**
- Declarative 3D scenes match React mental model
- Automatic cleanup/disposal of Three.js objects
- Easy integration with React state and lifecycle
- Rich ecosystem of helpers (drei)
- Better TypeScript support

**Trade-offs:**
- Slight performance overhead vs vanilla
- Learning curve for R3F-specific patterns
- Some Three.js features require escape hatches

### Decision 2: Zustand over Redux/Context

**Choice:** Zustand for global state management

**Rationale:**
- Minimal boilerplate (no actions/reducers)
- No provider wrapper needed (except for devtools)
- Built-in TypeScript support
- Easy store slicing by domain
- Works well outside React components
- Small bundle size (~1KB)

**Trade-offs:**
- Less structured than Redux
- No built-in dev tools (need middleware)
- Less community tooling

### Decision 3: TanStack Query for Server State

**Choice:** Separate server state from client state

**Rationale:**
- Automatic background refetching
- Built-in cache management
- Request deduplication
- Optimistic updates support
- Stale-while-revalidate strategy
- DevTools for debugging

**Trade-offs:**
- Additional library to learn
- Must be careful about cache invalidation
- Can conflict with other state if not careful

### Decision 4: Express Proxy over Next.js API Routes

**Choice:** Separate Express.js server for API proxy

**Rationale:**
- Clear separation of concerns
- Can deploy independently
- Better for rate limiting/caching at scale
- Easier to add WebSocket support later
- No Vercel cold starts

**Trade-offs:**
- Additional deployment target
- More complex local dev setup
- Needs its own hosting

### Decision 5: shadcn/ui over other component libraries

**Choice:** shadcn/ui with Radix primitives

**Rationale:**
- Copy-paste ownership (not a dependency)
- Fully customizable
- Accessible by default (Radix)
- Tailwind-native styling
- No version conflicts

**Trade-offs:**
- More initial setup
- Must maintain copied components
- No automatic updates

### Decision 6: Texture-based Globe over Vector Tiles

**Choice:** Pre-rendered earth textures for globe

**Rationale:**
- Better visual quality at zoom-out
- Simpler implementation
- Lower runtime computation
- Consistent look across devices

**Trade-offs:**
- Limited zoom detail (need LOD system for close-up)
- Larger initial download
- No dynamic map features

### Decision 7: Marker Clustering Strategy

**Choice:** Client-side clustering with LOD

**Rationale:**
- Handles thousands of markers
- Smooth zoom transitions
- No server round-trips for clustering
- Can customize cluster appearance

**Implementation:**
```typescript
// Cluster markers based on zoom level
const clusterRadius = interpolate(zoomLevel, [1, 5, 10], [50, 20, 5]);
const clusters = supercluster.getClusters(bbox, zoomLevel);
```

---

## 8. API Design

### Frontend API Client Endpoints

```typescript
// src/services/api/air-quality.api.ts

// Get all stations with optional filters
getStations(filters?: {
  bounds?: { north: number; south: number; east: number; west: number };
  aqiMin?: number;
  aqiMax?: number;
  pollutants?: PollutantType[];
}): Promise<Station[]>

// Get single station details
getStation(id: string): Promise<StationDetails>

// Get historical data for a station
getHistoricalData(id: string, options: {
  start: Date;
  end: Date;
  resolution: 'hour' | 'day' | 'week';
}): Promise<HistoricalData[]>

// Get nearby stations
getNearbyStations(lat: number, lng: number, radiusKm: number): Promise<Station[]>
```

### Express Proxy Routes

```
GET /api/v1/air-quality/stations
  Query: bounds, aqiMin, aqiMax, pollutants
  Response: { data: Station[], meta: { total, cached } }

GET /api/v1/air-quality/stations/:id
  Response: { data: StationDetails }

GET /api/v1/air-quality/stations/:id/history
  Query: start, end, resolution
  Response: { data: HistoricalData[] }

GET /api/v1/geocoding/search
  Query: q (query string)
  Response: { data: Location[] }

GET /api/v1/geocoding/reverse
  Query: lat, lng
  Response: { data: Location }
```

---

## 9. Type Definitions

### Core Types

```typescript
// src/types/air-quality.types.ts

export type PollutantType = 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co';

export type AqiLevel = 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

export interface AqiReading {
  value: number;
  level: AqiLevel;
  pollutant: PollutantType;
  timestamp: Date;
}

export interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    city?: string;
    country: string;
  };
  currentAqi: AqiReading;
  pollutants: Record<PollutantType, number | null>;
  lastUpdated: Date;
}

export interface StationDetails extends Station {
  description?: string;
  operator?: string;
  elevation?: number;
  timezone: string;
  historicalAverage: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface HistoricalData {
  timestamp: Date;
  aqi: number;
  pollutants: Record<PollutantType, number | null>;
}
```

### Location Types

```typescript
// src/types/location.types.ts

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  name: string;
  displayName: string;
  coordinates: GeoCoordinates;
  type: 'city' | 'region' | 'country' | 'station';
  country: string;
  countryCode: string;
  population?: number;
}

export interface SearchResult {
  locations: Location[];
  query: string;
  totalResults: number;
}
```

### Globe Types

```typescript
// src/types/globe.types.ts

export interface GlobeMarker {
  id: string;
  position: [number, number, number]; // 3D position on sphere
  coordinates: GeoCoordinates;        // Lat/lng
  aqi: number;
  level: AqiLevel;
  size: number;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface GlobeConfig {
  radius: number;
  segments: number;
  markerScale: number;
  atmosphereOpacity: number;
}
```

---

## 10. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project scaffolding with Vite
- [ ] TypeScript configuration
- [ ] TailwindCSS + shadcn/ui setup
- [ ] Basic folder structure
- [ ] ESLint/Prettier configuration

### Phase 2: Globe Core (Week 2)
- [ ] React Three Fiber setup
- [ ] Basic globe mesh with textures
- [ ] Camera controls
- [ ] Atmosphere shader
- [ ] Responsive canvas

### Phase 3: Data Layer (Week 3)
- [ ] Express proxy server
- [ ] OpenAQ/WAQI integration
- [ ] TanStack Query setup
- [ ] Zustand stores
- [ ] API error handling

### Phase 4: Markers & Interaction (Week 4)
- [ ] AQI markers on globe
- [ ] Marker clustering
- [ ] Click/hover interactions
- [ ] Camera fly-to animations
- [ ] Info panel

### Phase 5: Visualization (Week 5)
- [ ] Recharts integration
- [ ] Historical trend charts
- [ ] Pollutant breakdown
- [ ] City comparison view

### Phase 6: Polish (Week 6)
- [ ] Search functionality
- [ ] Filter controls
- [ ] Loading states
- [ ] Error boundaries
- [ ] Accessibility audit
- [ ] Performance optimization

---

## Appendix A: Environment Variables

```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001/api/v1

# Backend (server/.env)
PORT=3001
NODE_ENV=development

# API Keys (server only - never expose to frontend)
OPENAQ_API_KEY=your_openaq_key
WAQI_API_TOKEN=your_waqi_token
MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Cache settings
CACHE_TTL_SECONDS=300
RATE_LIMIT_PER_MINUTE=100
```

---

## Appendix B: Package Dependencies

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "three": "^0.158.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "recharts": "^2.9.0",
    "axios": "^1.6.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slider": "^1.1.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "supercluster": "^8.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/three": "^0.158.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0"
  }
}
```

### Backend (server/package.json)

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.0",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.0",
    "node-cache": "^5.1.0",
    "axios": "^1.6.0",
    "dotenv": "^16.3.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsx": "^4.6.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/node": "^20.10.0",
    "nodemon": "^3.0.0"
  }
}
```

---

*This architecture report serves as the foundation for AirWatch development. All implementation should reference this document for consistency.*
