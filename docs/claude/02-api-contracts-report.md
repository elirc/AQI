# AirWatch - API & Data Contracts Report

> **Agent**: API & Data Contract Designer
> **Version**: 1.0.0
> **Date**: 2025-01-08
> **Status**: Complete

---

## Table of Contents

1. [External API Overview](#1-external-api-overview)
2. [TypeScript Interfaces](#2-typescript-interfaces)
3. [Backend Proxy Design](#3-backend-proxy-design)
4. [API Endpoints Specification](#4-api-endpoints-specification)
5. [Error Handling](#5-error-handling)
6. [TanStack Query Hooks](#6-tanstack-query-hooks)
7. [Caching Strategy](#7-caching-strategy)
8. [Example Responses](#8-example-responses)

---

## 1. External API Overview

### 1.1 AQICN API (Primary)

**Base URL**: `https://api.waqi.info`
**Documentation**: https://aqicn.org/json-api/doc/
**Authentication**: Token-based (query parameter `token`)

#### Available Endpoints:

| Endpoint | Purpose | Rate Limit |
|----------|---------|------------|
| `/feed/:city/` | Get AQI for specific city | 1000/day |
| `/feed/geo::lat;:lng/` | Get AQI by coordinates | 1000/day |
| `/search/?keyword=:query` | Search for stations | 1000/day |
| `/map/bounds/?latlng=:bounds` | Get stations in map bounds | 1000/day |

### 1.2 OpenWeatherMap API (Optional)

**Base URL**: `https://api.openweathermap.org/data/2.5`
**Authentication**: API key (query parameter `appid`)

#### Available Endpoints:

| Endpoint | Purpose |
|----------|---------|
| `/weather` | Current weather by city/coords |
| `/forecast` | 5-day forecast |
| `/air_pollution` | Air pollution data |

---

## 2. TypeScript Interfaces

### 2.1 Core AQI Types

```typescript
// src/types/aqi.ts

/**
 * AQI Level categories based on EPA standards
 */
export type AQILevel =
  | 'good'           // 0-50
  | 'moderate'       // 51-100
  | 'unhealthy-sg'   // 101-150 (Sensitive Groups)
  | 'unhealthy'      // 151-200
  | 'very-unhealthy' // 201-300
  | 'hazardous';     // 301+

/**
 * Pollutant types tracked by AQICN
 */
export type PollutantType = 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co';

/**
 * Individual pollutant measurement
 */
export interface Pollutant {
  /** Pollutant identifier */
  type: PollutantType;
  /** Current value (AQI scale) */
  value: number;
  /** Display name */
  name: string;
  /** Unit of measurement */
  unit: string;
}

/**
 * Time information from API
 */
export interface AQITime {
  /** Timestamp string (ISO 8601) */
  s: string;
  /** Timezone identifier */
  tz: string;
  /** Unix timestamp (seconds) */
  v: number;
  /** ISO formatted datetime */
  iso: string;
}

/**
 * Station location information
 */
export interface StationLocation {
  /** Latitude */
  lat: number;
  /** Longitude */
  lng: number;
}

/**
 * Attribution/source information
 */
export interface Attribution {
  /** Source URL */
  url: string;
  /** Source name */
  name: string;
  /** Logo URL (optional) */
  logo?: string;
}

/**
 * Daily forecast data point
 */
export interface ForecastDay {
  /** Date (YYYY-MM-DD) */
  day: string;
  /** Average value */
  avg: number;
  /** Maximum value */
  max: number;
  /** Minimum value */
  min: number;
}

/**
 * Forecast data by pollutant
 */
export interface Forecast {
  pm25?: ForecastDay[];
  pm10?: ForecastDay[];
  o3?: ForecastDay[];
  no2?: ForecastDay[];
  so2?: ForecastDay[];
  co?: ForecastDay[];
  uvi?: ForecastDay[];
}

/**
 * Individual Air Quality Index values by pollutant
 */
export interface IAQIData {
  pm25?: { v: number };
  pm10?: { v: number };
  o3?: { v: number };
  no2?: { v: number };
  so2?: { v: number };
  co?: { v: number };
  t?: { v: number };     // Temperature
  w?: { v: number };     // Wind speed
  h?: { v: number };     // Humidity
  p?: { v: number };     // Pressure
  wg?: { v: number };    // Wind gust
  dew?: { v: number };   // Dew point
}

/**
 * Debug/metadata information
 */
export interface DebugInfo {
  sync: string;
}

/**
 * City information
 */
export interface CityInfo {
  /** City/Station name */
  name: string;
  /** City URL on AQICN */
  url: string;
  /** Geographic coordinates */
  geo: [number, number]; // [lat, lng]
  /** Location string (optional) */
  location?: string;
}

/**
 * Complete station data from AQICN feed endpoint
 */
export interface AQIStationData {
  /** Unique station identifier */
  idx: number;
  /** Overall AQI value */
  aqi: number | string; // Can be "-" if no data
  /** Time of measurement */
  time: AQITime;
  /** City information */
  city: CityInfo;
  /** Dominant pollutant */
  dominentpol?: string;
  /** Individual pollutant AQI values */
  iaqi: IAQIData;
  /** Data attributions */
  attributions: Attribution[];
  /** Forecast data */
  forecast?: {
    daily: Forecast;
  };
  /** Debug information */
  debug?: DebugInfo;
}

/**
 * AQICN API response wrapper
 */
export interface AQICNResponse<T> {
  /** Response status */
  status: 'ok' | 'error';
  /** Response data */
  data: T;
  /** Error message (when status is 'error') */
  message?: string;
}

/**
 * Search result item
 */
export interface SearchResult {
  /** Unique station identifier */
  uid: number;
  /** AQI value */
  aqi: string;
  /** Station time */
  time: AQITime;
  /** Station info */
  station: {
    name: string;
    geo: [number, number];
    url: string;
    country?: string;
  };
}

/**
 * Map bounds query result
 */
export interface MapStation {
  /** Latitude */
  lat: number;
  /** Longitude */
  lon: number;
  /** Unique identifier */
  uid: number;
  /** Current AQI */
  aqi: string;
  /** Station name */
  station: {
    name: string;
    time: string;
  };
}
```

### 2.2 Processed/Normalized Types

```typescript
// src/types/processed.ts

import type { AQILevel, PollutantType, Forecast } from './aqi';

/**
 * Normalized station data for UI consumption
 */
export interface Station {
  /** Unique identifier */
  id: number;
  /** Station/City name */
  name: string;
  /** Location coordinates */
  coordinates: {
    lat: number;
    lng: number;
  };
  /** Current AQI value */
  aqi: number;
  /** AQI category level */
  level: AQILevel;
  /** Dominant pollutant */
  dominantPollutant: PollutantType | null;
  /** Last update timestamp */
  lastUpdated: Date;
  /** Timezone */
  timezone: string;
}

/**
 * Detailed station data with all pollutants
 */
export interface StationDetails extends Station {
  /** Individual pollutant readings */
  pollutants: PollutantReading[];
  /** Weather data (if available) */
  weather: WeatherData | null;
  /** Forecast data */
  forecast: ProcessedForecast | null;
  /** Data sources */
  attributions: Attribution[];
  /** Health recommendation */
  healthRecommendation: HealthRecommendation;
}

/**
 * Pollutant reading with metadata
 */
export interface PollutantReading {
  type: PollutantType;
  value: number;
  name: string;
  description: string;
  unit: string;
  level: AQILevel;
  percentage: number; // 0-100 relative to scale
}

/**
 * Weather data
 */
export interface WeatherData {
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windGust: number | null;
  pressure: number | null;
  dewPoint: number | null;
}

/**
 * Processed forecast for charts
 */
export interface ProcessedForecast {
  dates: string[];
  pm25: ForecastValues | null;
  pm10: ForecastValues | null;
  o3: ForecastValues | null;
}

export interface ForecastValues {
  avg: number[];
  min: number[];
  max: number[];
}

/**
 * Health recommendation based on AQI
 */
export interface HealthRecommendation {
  level: AQILevel;
  headline: string;
  description: string;
  outdoorActivity: 'safe' | 'caution' | 'reduced' | 'avoid' | 'dangerous';
  sensitiveGroups: string[];
  generalAdvice: string[];
}

/**
 * Favorite city stored in local storage
 */
export interface FavoriteCity {
  id: number;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  addedAt: Date;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  alertThreshold: number; // AQI level to trigger alert
  favorites: FavoriteCity[];
  defaultLocation: {
    lat: number;
    lng: number;
  } | null;
  units: {
    temperature: 'celsius' | 'fahrenheit';
  };
}
```

### 2.3 Comparison Types

```typescript
// src/types/comparison.ts

import type { Station, StationDetails, ProcessedForecast } from './processed';

/**
 * City comparison data
 */
export interface ComparisonData {
  cities: StationDetails[];
  metrics: ComparisonMetric[];
  chartData: ComparisonChartData;
}

/**
 * Single comparison metric
 */
export interface ComparisonMetric {
  name: string;
  values: (number | null)[];
  unit: string;
  winner: number | null; // Index of best value
}

/**
 * Chart data for comparison visualization
 */
export interface ComparisonChartData {
  labels: string[]; // City names
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

/**
 * Comparison session state
 */
export interface ComparisonState {
  cities: Station[];
  maxCities: 3;
  isComparing: boolean;
}
```

### 2.4 Globe/Map Types

```typescript
// src/types/globe.ts

import type { MapStation } from './aqi';
import type { AQILevel } from './aqi';

/**
 * Map bounds for querying stations
 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Marker for 3D globe visualization
 */
export interface GlobeMarker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  level: AQILevel;
  color: string;
  size: number;
}

/**
 * Camera position for globe
 */
export interface CameraPosition {
  lat: number;
  lng: number;
  altitude: number; // Distance from surface
}

/**
 * Globe interaction state
 */
export interface GlobeState {
  isRotating: boolean;
  selectedMarkerId: number | null;
  cameraPosition: CameraPosition;
  markers: GlobeMarker[];
  isLoading: boolean;
}
```

### 2.5 OpenWeatherMap Types (Optional)

```typescript
// src/types/weather.ts

/**
 * OpenWeatherMap current weather response
 */
export interface OWMWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

/**
 * OpenWeatherMap air pollution response
 */
export interface OWMAirPollutionResponse {
  coord: {
    lon: number;
    lat: number;
  };
  list: {
    main: {
      aqi: 1 | 2 | 3 | 4 | 5; // 1=Good, 5=Very Poor
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }[];
}
```

---

## 3. Backend Proxy Design

### 3.1 Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React App     │────▶│   Express/Next   │────▶│   AQICN API     │
│   (Frontend)    │     │   API Routes     │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   Cache Layer    │
                        │   (Memory/Redis) │
                        └──────────────────┘
```

### 3.2 Express Server Structure

```typescript
// src/server/index.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { aqiRouter } from './routes/aqi';
import { weatherRouter } from './routes/weather';
import { errorHandler } from './middleware/errorHandler';
import { cacheMiddleware } from './middleware/cache';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api', limiter);

// Routes
app.use('/api/aqi', cacheMiddleware, aqiRouter);
app.use('/api/weather', cacheMiddleware, weatherRouter);

// Error handling
app.use(errorHandler);

export default app;
```

### 3.3 Route Implementations

```typescript
// src/server/routes/aqi.ts

import { Router } from 'express';
import { aqiService } from '../services/aqiService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateQuery, validateParams } from '../middleware/validation';
import { searchSchema, boundsSchema, citySchema, geoSchema } from '../schemas/aqi';

const router = Router();

/**
 * GET /api/aqi/city/:city
 * Get AQI data for a specific city
 */
router.get(
  '/city/:city',
  validateParams(citySchema),
  asyncHandler(async (req, res) => {
    const { city } = req.params;
    const data = await aqiService.getCityFeed(city);
    res.json(data);
  })
);

/**
 * GET /api/aqi/geo
 * Get AQI data by coordinates
 */
router.get(
  '/geo',
  validateQuery(geoSchema),
  asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;
    const data = await aqiService.getGeoFeed(
      parseFloat(lat as string),
      parseFloat(lng as string)
    );
    res.json(data);
  })
);

/**
 * GET /api/aqi/search
 * Search for stations by keyword
 */
router.get(
  '/search',
  validateQuery(searchSchema),
  asyncHandler(async (req, res) => {
    const { q } = req.query;
    const data = await aqiService.search(q as string);
    res.json(data);
  })
);

/**
 * GET /api/aqi/map/bounds
 * Get all stations within map bounds
 */
router.get(
  '/map/bounds',
  validateQuery(boundsSchema),
  asyncHandler(async (req, res) => {
    const { north, south, east, west } = req.query;
    const data = await aqiService.getMapBounds({
      north: parseFloat(north as string),
      south: parseFloat(south as string),
      east: parseFloat(east as string),
      west: parseFloat(west as string)
    });
    res.json(data);
  })
);

/**
 * GET /api/aqi/station/:id
 * Get specific station by ID
 */
router.get(
  '/station/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await aqiService.getStationById(parseInt(id, 10));
    res.json(data);
  })
);

export { router as aqiRouter };
```

### 3.4 Service Layer

```typescript
// src/server/services/aqiService.ts

import axios, { AxiosInstance } from 'axios';
import { Cache } from '../utils/cache';
import type {
  AQICNResponse,
  AQIStationData,
  SearchResult,
  MapStation,
  MapBounds
} from '../../types/aqi';
import { AQIError, APIErrorCode } from '../errors';

const AQICN_BASE_URL = 'https://api.waqi.info';
const AQICN_TOKEN = process.env.AQICN_API_TOKEN;

class AQIService {
  private client: AxiosInstance;
  private cache: Cache;

  constructor() {
    if (!AQICN_TOKEN) {
      throw new Error('AQICN_API_TOKEN environment variable is required');
    }

    this.client = axios.create({
      baseURL: AQICN_BASE_URL,
      timeout: 10000,
      params: {
        token: AQICN_TOKEN
      }
    });

    this.cache = new Cache();
  }

  /**
   * Get AQI feed for a city
   */
  async getCityFeed(city: string): Promise<AQIStationData> {
    const cacheKey = `city:${city.toLowerCase()}`;
    const cached = this.cache.get<AQIStationData>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<AQICNResponse<AQIStationData>>(
      `/feed/${encodeURIComponent(city)}/`
    );

    this.validateResponse(response.data);
    this.cache.set(cacheKey, response.data.data, 300); // 5 min TTL
    return response.data.data;
  }

  /**
   * Get AQI feed by geo coordinates
   */
  async getGeoFeed(lat: number, lng: number): Promise<AQIStationData> {
    const cacheKey = `geo:${lat.toFixed(4)},${lng.toFixed(4)}`;
    const cached = this.cache.get<AQIStationData>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<AQICNResponse<AQIStationData>>(
      `/feed/geo:${lat};${lng}/`
    );

    this.validateResponse(response.data);
    this.cache.set(cacheKey, response.data.data, 300);
    return response.data.data;
  }

  /**
   * Search for stations by keyword
   */
  async search(keyword: string): Promise<SearchResult[]> {
    const cacheKey = `search:${keyword.toLowerCase()}`;
    const cached = this.cache.get<SearchResult[]>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<AQICNResponse<SearchResult[]>>(
      '/search/',
      { params: { keyword } }
    );

    this.validateResponse(response.data);
    this.cache.set(cacheKey, response.data.data, 600); // 10 min TTL
    return response.data.data;
  }

  /**
   * Get stations within map bounds
   */
  async getMapBounds(bounds: MapBounds): Promise<MapStation[]> {
    const { north, south, east, west } = bounds;
    const cacheKey = `bounds:${north},${south},${east},${west}`;
    const cached = this.cache.get<MapStation[]>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<AQICNResponse<MapStation[]>>(
      '/map/bounds/',
      {
        params: {
          latlng: `${north},${south},${east},${west}`
        }
      }
    );

    this.validateResponse(response.data);
    this.cache.set(cacheKey, response.data.data, 300);
    return response.data.data;
  }

  /**
   * Get station by ID (uses feed/@stationId)
   */
  async getStationById(id: number): Promise<AQIStationData> {
    const cacheKey = `station:${id}`;
    const cached = this.cache.get<AQIStationData>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<AQICNResponse<AQIStationData>>(
      `/feed/@${id}/`
    );

    this.validateResponse(response.data);
    this.cache.set(cacheKey, response.data.data, 300);
    return response.data.data;
  }

  /**
   * Validate API response
   */
  private validateResponse<T>(response: AQICNResponse<T>): void {
    if (response.status === 'error') {
      throw new AQIError(
        response.message || 'Unknown API error',
        APIErrorCode.EXTERNAL_API_ERROR
      );
    }
  }
}

export const aqiService = new AQIService();
```

### 3.5 Cache Implementation

```typescript
// src/server/utils/cache.ts

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class Cache {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(cleanupIntervalMs: number = 60000) {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupIntervalMs);
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiry) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}
```

---

## 4. API Endpoints Specification

### 4.1 Backend API Routes

| Method | Path | Description | Request | Response |
|--------|------|-------------|---------|----------|
| GET | `/api/aqi/city/:city` | Get AQI for city | `city: string` (path) | `StationDetails` |
| GET | `/api/aqi/geo` | Get AQI by coords | `lat, lng: number` (query) | `StationDetails` |
| GET | `/api/aqi/search` | Search stations | `q: string` (query) | `SearchResult[]` |
| GET | `/api/aqi/map/bounds` | Get stations in bounds | `north,south,east,west: number` (query) | `MapStation[]` |
| GET | `/api/aqi/station/:id` | Get station by ID | `id: number` (path) | `StationDetails` |
| GET | `/api/weather/current` | Get weather | `lat, lng: number` (query) | `WeatherData` |
| GET | `/api/health` | Health check | - | `{ status: 'ok' }` |

### 4.2 Detailed Endpoint Specifications

#### GET /api/aqi/city/:city

```typescript
// Request
interface CityRequest {
  city: string; // URL encoded city name, e.g., "new-york", "beijing"
}

// Response
interface CityResponse {
  success: true;
  data: StationDetails;
  cached: boolean;
  timestamp: string;
}

// Example
// GET /api/aqi/city/london
{
  "success": true,
  "data": {
    "id": 5724,
    "name": "London",
    "coordinates": { "lat": 51.5074, "lng": -0.1278 },
    "aqi": 42,
    "level": "good",
    "dominantPollutant": "pm25",
    "lastUpdated": "2025-01-08T14:00:00Z",
    "timezone": "+00:00",
    "pollutants": [...],
    "weather": {...},
    "forecast": {...},
    "healthRecommendation": {...}
  },
  "cached": false,
  "timestamp": "2025-01-08T14:05:32Z"
}
```

#### GET /api/aqi/geo

```typescript
// Request
interface GeoRequest {
  lat: number;  // Latitude (-90 to 90)
  lng: number;  // Longitude (-180 to 180)
}

// Response: Same as CityResponse

// Example
// GET /api/aqi/geo?lat=40.7128&lng=-74.006
```

#### GET /api/aqi/search

```typescript
// Request
interface SearchRequest {
  q: string;  // Search query (min 2 chars)
}

// Response
interface SearchResponse {
  success: true;
  data: Array<{
    id: number;
    name: string;
    aqi: number | null;
    coordinates: { lat: number; lng: number };
    country?: string;
  }>;
  count: number;
  timestamp: string;
}

// Example
// GET /api/aqi/search?q=tokyo
{
  "success": true,
  "data": [
    {
      "id": 1437,
      "name": "Tokyo, Japan",
      "aqi": 38,
      "coordinates": { "lat": 35.6762, "lng": 139.6503 }
    },
    // ... more results
  ],
  "count": 15,
  "timestamp": "2025-01-08T14:10:00Z"
}
```

#### GET /api/aqi/map/bounds

```typescript
// Request
interface BoundsRequest {
  north: number;  // Northern latitude
  south: number;  // Southern latitude
  east: number;   // Eastern longitude
  west: number;   // Western longitude
}

// Response
interface BoundsResponse {
  success: true;
  data: Array<{
    id: number;
    lat: number;
    lng: number;
    aqi: number;
    name: string;
    level: AQILevel;
  }>;
  count: number;
  bounds: BoundsRequest;
  timestamp: string;
}

// Example
// GET /api/aqi/map/bounds?north=52&south=48&east=2&west=-2
```

---

## 5. Error Handling

### 5.1 Error Types

```typescript
// src/types/errors.ts

/**
 * API Error codes
 */
export enum APIErrorCode {
  // Client errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  TIMEOUT = 'TIMEOUT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  OFFLINE = 'OFFLINE'
}

/**
 * Standardized API error response
 */
export interface APIError {
  success: false;
  error: {
    code: APIErrorCode;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Custom error class for API errors
 */
export class AQIError extends Error {
  constructor(
    message: string,
    public code: APIErrorCode,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AQIError';
  }
}

/**
 * Error mapping for HTTP status codes
 */
export const errorStatusMap: Record<APIErrorCode, number> = {
  [APIErrorCode.BAD_REQUEST]: 400,
  [APIErrorCode.UNAUTHORIZED]: 401,
  [APIErrorCode.FORBIDDEN]: 403,
  [APIErrorCode.NOT_FOUND]: 404,
  [APIErrorCode.RATE_LIMITED]: 429,
  [APIErrorCode.VALIDATION_ERROR]: 422,
  [APIErrorCode.INTERNAL_ERROR]: 500,
  [APIErrorCode.EXTERNAL_API_ERROR]: 502,
  [APIErrorCode.TIMEOUT]: 504,
  [APIErrorCode.SERVICE_UNAVAILABLE]: 503,
  [APIErrorCode.NETWORK_ERROR]: 503,
  [APIErrorCode.OFFLINE]: 503
};
```

### 5.2 Error Handler Middleware

```typescript
// src/server/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { AQIError, APIError, APIErrorCode, errorStatusMap } from '../../types/errors';
import { v4 as uuidv4 } from 'uuid';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = uuidv4();

  console.error(`[${requestId}] Error:`, err);

  // Handle known AQI errors
  if (err instanceof AQIError) {
    const response: APIError = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
        requestId
      }
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Axios errors (from external API calls)
  if (err.name === 'AxiosError') {
    const axiosErr = err as any;
    const code = axiosErr.response?.status === 429
      ? APIErrorCode.RATE_LIMITED
      : APIErrorCode.EXTERNAL_API_ERROR;

    const response: APIError = {
      success: false,
      error: {
        code,
        message: 'External API request failed',
        timestamp: new Date().toISOString(),
        requestId
      }
    };
    res.status(errorStatusMap[code]).json(response);
    return;
  }

  // Handle validation errors (from Zod/Joi)
  if (err.name === 'ZodError' || err.name === 'ValidationError') {
    const response: APIError = {
      success: false,
      error: {
        code: APIErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: { errors: (err as any).errors || err.message },
        timestamp: new Date().toISOString(),
        requestId
      }
    };
    res.status(422).json(response);
    return;
  }

  // Generic error
  const response: APIError = {
    success: false,
    error: {
      code: APIErrorCode.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
      timestamp: new Date().toISOString(),
      requestId
    }
  };
  res.status(500).json(response);
}
```

### 5.3 Frontend Error Handling

```typescript
// src/lib/api/errorHandler.ts

import { APIError, APIErrorCode } from '@/types/errors';

/**
 * User-friendly error messages
 */
export const errorMessages: Record<APIErrorCode, string> = {
  [APIErrorCode.BAD_REQUEST]: 'Invalid request. Please check your input.',
  [APIErrorCode.UNAUTHORIZED]: 'Authentication required.',
  [APIErrorCode.FORBIDDEN]: 'You do not have permission to access this resource.',
  [APIErrorCode.NOT_FOUND]: 'The requested data was not found.',
  [APIErrorCode.RATE_LIMITED]: 'Too many requests. Please wait a moment.',
  [APIErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
  [APIErrorCode.INTERNAL_ERROR]: 'Something went wrong. Please try again.',
  [APIErrorCode.EXTERNAL_API_ERROR]: 'Unable to fetch air quality data. Please try again.',
  [APIErrorCode.TIMEOUT]: 'Request timed out. Please try again.',
  [APIErrorCode.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable.',
  [APIErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [APIErrorCode.OFFLINE]: 'You appear to be offline.'
};

/**
 * Parse and normalize API errors
 */
export function parseAPIError(error: unknown): {
  code: APIErrorCode;
  message: string;
  isRetryable: boolean;
} {
  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      code: navigator.onLine ? APIErrorCode.NETWORK_ERROR : APIErrorCode.OFFLINE,
      message: navigator.onLine
        ? errorMessages[APIErrorCode.NETWORK_ERROR]
        : errorMessages[APIErrorCode.OFFLINE],
      isRetryable: true
    };
  }

  // Handle API error responses
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const apiError = (error as { error: APIError['error'] }).error;
    return {
      code: apiError.code,
      message: errorMessages[apiError.code] || apiError.message,
      isRetryable: isRetryableError(apiError.code)
    };
  }

  // Default error
  return {
    code: APIErrorCode.INTERNAL_ERROR,
    message: errorMessages[APIErrorCode.INTERNAL_ERROR],
    isRetryable: true
  };
}

/**
 * Determine if error is retryable
 */
function isRetryableError(code: APIErrorCode): boolean {
  return [
    APIErrorCode.TIMEOUT,
    APIErrorCode.NETWORK_ERROR,
    APIErrorCode.EXTERNAL_API_ERROR,
    APIErrorCode.SERVICE_UNAVAILABLE,
    APIErrorCode.RATE_LIMITED
  ].includes(code);
}
```

---

## 6. TanStack Query Hooks

### 6.1 Query Keys

```typescript
// src/lib/queries/queryKeys.ts

/**
 * Centralized query key factory
 */
export const queryKeys = {
  // AQI queries
  aqi: {
    all: ['aqi'] as const,
    cities: () => [...queryKeys.aqi.all, 'city'] as const,
    city: (city: string) => [...queryKeys.aqi.cities(), city] as const,
    geo: (lat: number, lng: number) =>
      [...queryKeys.aqi.all, 'geo', { lat, lng }] as const,
    search: (query: string) =>
      [...queryKeys.aqi.all, 'search', query] as const,
    bounds: (bounds: { north: number; south: number; east: number; west: number }) =>
      [...queryKeys.aqi.all, 'bounds', bounds] as const,
    station: (id: number) =>
      [...queryKeys.aqi.all, 'station', id] as const,
  },

  // Weather queries
  weather: {
    all: ['weather'] as const,
    current: (lat: number, lng: number) =>
      [...queryKeys.weather.all, 'current', { lat, lng }] as const,
    forecast: (lat: number, lng: number) =>
      [...queryKeys.weather.all, 'forecast', { lat, lng }] as const,
  },

  // User data
  user: {
    all: ['user'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
    favorites: () => [...queryKeys.user.all, 'favorites'] as const,
  },

  // Comparison
  comparison: {
    all: ['comparison'] as const,
    cities: (ids: number[]) =>
      [...queryKeys.comparison.all, 'cities', ids.sort()] as const,
  }
} as const;
```

### 6.2 API Client

```typescript
// src/lib/api/client.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

/**
 * Base API client with error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...init } = options;

  // Build URL with query params
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw data;
  }

  return data.data;
}

export const api = {
  get: <T>(endpoint: string, params?: RequestOptions['params']) =>
    request<T>(endpoint, { method: 'GET', params }),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
};
```

### 6.3 Query Hooks

```typescript
// src/lib/queries/useAQI.ts

import {
  useQuery,
  useQueries,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';
import { api } from '../api/client';
import { queryKeys } from './queryKeys';
import type { StationDetails, SearchResult, MapStation } from '@/types';

/**
 * Hook to fetch AQI data for a specific city
 */
export function useAQICity(
  city: string,
  options?: Omit<UseQueryOptions<StationDetails, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<StationDetails, Error> {
  return useQuery({
    queryKey: queryKeys.aqi.city(city),
    queryFn: () => api.get<StationDetails>(`/aqi/city/${encodeURIComponent(city)}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

/**
 * Hook to fetch AQI data by coordinates
 */
export function useAQIGeo(
  lat: number | undefined,
  lng: number | undefined,
  options?: Omit<UseQueryOptions<StationDetails, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<StationDetails, Error> {
  return useQuery({
    queryKey: queryKeys.aqi.geo(lat!, lng!),
    queryFn: () => api.get<StationDetails>('/aqi/geo', { lat, lng }),
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 3,
    ...options,
  });
}

/**
 * Hook to search for AQI stations
 */
export function useAQISearch(
  query: string,
  options?: Omit<UseQueryOptions<SearchResult[], Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<SearchResult[], Error> {
  return useQuery({
    queryKey: queryKeys.aqi.search(query),
    queryFn: () => api.get<SearchResult[]>('/aqi/search', { q: query }),
    enabled: query.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    placeholderData: [],
    ...options,
  });
}

/**
 * Hook to fetch stations within map bounds
 */
export function useAQIMapBounds(
  bounds: { north: number; south: number; east: number; west: number } | null,
  options?: Omit<UseQueryOptions<MapStation[], Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<MapStation[], Error> {
  return useQuery({
    queryKey: queryKeys.aqi.bounds(bounds!),
    queryFn: () => api.get<MapStation[]>('/aqi/map/bounds', bounds!),
    enabled: bounds !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch a specific station by ID
 */
export function useAQIStation(
  id: number | null,
  options?: Omit<UseQueryOptions<StationDetails, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<StationDetails, Error> {
  return useQuery({
    queryKey: queryKeys.aqi.station(id!),
    queryFn: () => api.get<StationDetails>(`/aqi/station/${id}`),
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch multiple stations for comparison
 */
export function useAQIComparison(
  ids: number[],
  options?: Omit<UseQueryOptions<StationDetails, Error>, 'queryKey' | 'queryFn'>
) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.aqi.station(id),
      queryFn: () => api.get<StationDetails>(`/aqi/station/${id}`),
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      ...options,
    })),
    combine: (results) => {
      return {
        data: results.map(r => r.data).filter(Boolean) as StationDetails[],
        isLoading: results.some(r => r.isLoading),
        isError: results.some(r => r.isError),
        errors: results.map(r => r.error).filter(Boolean),
      };
    },
  });
}
```

### 6.4 Prefetching Utilities

```typescript
// src/lib/queries/prefetch.ts

import { QueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { queryKeys } from './queryKeys';
import type { StationDetails, SearchResult } from '@/types';

/**
 * Prefetch city data on hover (for better UX)
 */
export function prefetchCity(queryClient: QueryClient, city: string): void {
  queryClient.prefetchQuery({
    queryKey: queryKeys.aqi.city(city),
    queryFn: () => api.get<StationDetails>(`/aqi/city/${encodeURIComponent(city)}`),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Prefetch station data
 */
export function prefetchStation(queryClient: QueryClient, id: number): void {
  queryClient.prefetchQuery({
    queryKey: queryKeys.aqi.station(id),
    queryFn: () => api.get<StationDetails>(`/aqi/station/${id}`),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Prefetch search results (debounced)
 */
export function prefetchSearch(queryClient: QueryClient, query: string): void {
  if (query.length < 2) return;

  queryClient.prefetchQuery({
    queryKey: queryKeys.aqi.search(query),
    queryFn: () => api.get<SearchResult[]>('/aqi/search', { q: query }),
    staleTime: 10 * 60 * 1000,
  });
}
```

### 6.5 Mutation Hooks

```typescript
// src/lib/queries/useFavorites.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import type { FavoriteCity } from '@/types';

/**
 * Hook to manage favorite cities (local storage)
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  const addFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, 'addedAt'>) => {
      const favorites = getFavoritesFromStorage();
      const newFavorite: FavoriteCity = {
        ...city,
        addedAt: new Date(),
      };
      favorites.push(newFavorite);
      saveFavoritesToStorage(favorites);
      return newFavorite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.favorites() });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (cityId: number) => {
      const favorites = getFavoritesFromStorage();
      const filtered = favorites.filter(f => f.id !== cityId);
      saveFavoritesToStorage(filtered);
      return cityId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.favorites() });
    },
  });

  return { addFavorite, removeFavorite };
}

// Storage helpers
function getFavoritesFromStorage(): FavoriteCity[] {
  try {
    const stored = localStorage.getItem('airwatch_favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavoritesToStorage(favorites: FavoriteCity[]): void {
  localStorage.setItem('airwatch_favorites', JSON.stringify(favorites));
}
```

---

## 7. Caching Strategy

### 7.1 Cache Layers Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  TanStack Query Cache                                           │
│  ├── staleTime: How long data is considered fresh               │
│  ├── gcTime: How long inactive data stays in cache              │
│  └── In-memory, per-session                                     │
├─────────────────────────────────────────────────────────────────┤
│  Local Storage                                                  │
│  ├── User preferences                                           │
│  ├── Favorites list                                             │
│  └── Last viewed cities                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Server)                            │
├─────────────────────────────────────────────────────────────────┤
│  In-Memory Cache (or Redis)                                     │
│  ├── TTL-based expiration                                       │
│  ├── Reduces external API calls                                 │
│  └── Key-based invalidation                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External APIs                               │
│  ├── AQICN (rate limited: 1000 req/day)                         │
│  └── OpenWeatherMap (if used)                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Cache TTL Configuration

| Data Type | Backend TTL | Frontend staleTime | Frontend gcTime | Rationale |
|-----------|-------------|-------------------|-----------------|-----------|
| City AQI | 5 min | 5 min | 30 min | AQI updates hourly, but we want reasonably fresh data |
| Geo AQI | 5 min | 5 min | 30 min | Same as city |
| Search Results | 10 min | 10 min | 60 min | Station lists don't change often |
| Map Bounds | 5 min | 5 min | 30 min | Many markers, needs to stay fresh |
| Weather Data | 10 min | 10 min | 30 min | Weather changes gradually |
| Forecast | 30 min | 30 min | 2 hours | Forecasts update less frequently |

### 7.3 Cache Key Strategies

```typescript
// src/lib/cache/keys.ts

/**
 * Generate consistent cache keys for backend
 */
export const cacheKeys = {
  city: (name: string) => `city:${name.toLowerCase().trim()}`,
  geo: (lat: number, lng: number) => `geo:${lat.toFixed(4)},${lng.toFixed(4)}`,
  search: (query: string) => `search:${query.toLowerCase().trim()}`,
  bounds: (n: number, s: number, e: number, w: number) =>
    `bounds:${n.toFixed(2)},${s.toFixed(2)},${e.toFixed(2)},${w.toFixed(2)}`,
  station: (id: number) => `station:${id}`,
  weather: (lat: number, lng: number) => `weather:${lat.toFixed(4)},${lng.toFixed(4)}`,
};
```

### 7.4 Query Client Configuration

```typescript
// src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus for AQI data (too frequent)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Refetch interval: 5 minutes for active queries
      refetchInterval: 5 * 60 * 1000,
      // Disable refetch interval when window is hidden
      refetchIntervalInBackground: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});
```

### 7.5 Offline Support Strategy

```typescript
// src/lib/offline/persistence.ts

import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { queryClient } from '../queryClient';

/**
 * Enable offline persistence for critical data
 */
export function setupOfflinePersistence(): void {
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'airwatch-query-cache',
    // Don't persist error states or loading states
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  });

  persistQueryClient({
    queryClient,
    persister,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // Only persist certain query types
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        // Persist favorites and recently viewed cities
        const key = query.queryKey;
        if (Array.isArray(key)) {
          return key[0] === 'user' ||
                 (key[0] === 'aqi' && key[1] === 'city');
        }
        return false;
      },
    },
  });
}
```

---

## 8. Example Responses

### 8.1 AQICN City Feed Response

```json
{
  "status": "ok",
  "data": {
    "aqi": 58,
    "idx": 1437,
    "attributions": [
      {
        "url": "http://www.kankyo.metro.tokyo.jp/",
        "name": "Tokyo Environment",
        "logo": "Japan-Tokyo.png"
      },
      {
        "url": "https://waqi.info/",
        "name": "World Air Quality Index Project"
      }
    ],
    "city": {
      "geo": [35.6762, 139.6503],
      "name": "Tokyo, Japan",
      "url": "https://aqicn.org/city/tokyo",
      "location": ""
    },
    "dominentpol": "pm25",
    "iaqi": {
      "co": { "v": 2.3 },
      "h": { "v": 57 },
      "no2": { "v": 12.4 },
      "o3": { "v": 32.8 },
      "p": { "v": 1013 },
      "pm10": { "v": 21 },
      "pm25": { "v": 58 },
      "so2": { "v": 1.8 },
      "t": { "v": 18.5 },
      "w": { "v": 3.2 }
    },
    "time": {
      "s": "2025-01-08 15:00:00",
      "tz": "+09:00",
      "v": 1736337600,
      "iso": "2025-01-08T15:00:00+09:00"
    },
    "forecast": {
      "daily": {
        "o3": [
          { "avg": 30, "day": "2025-01-08", "max": 45, "min": 15 },
          { "avg": 28, "day": "2025-01-09", "max": 42, "min": 14 },
          { "avg": 32, "day": "2025-01-10", "max": 48, "min": 18 }
        ],
        "pm10": [
          { "avg": 22, "day": "2025-01-08", "max": 35, "min": 12 },
          { "avg": 25, "day": "2025-01-09", "max": 40, "min": 15 },
          { "avg": 20, "day": "2025-01-10", "max": 32, "min": 10 }
        ],
        "pm25": [
          { "avg": 55, "day": "2025-01-08", "max": 75, "min": 35 },
          { "avg": 60, "day": "2025-01-09", "max": 85, "min": 40 },
          { "avg": 50, "day": "2025-01-10", "max": 70, "min": 30 }
        ],
        "uvi": [
          { "avg": 2, "day": "2025-01-08", "max": 4, "min": 0 },
          { "avg": 2, "day": "2025-01-09", "max": 4, "min": 0 }
        ]
      }
    },
    "debug": {
      "sync": "2025-01-08T06:15:32+00:00"
    }
  }
}
```

### 8.2 AQICN Search Response

```json
{
  "status": "ok",
  "data": [
    {
      "uid": 1437,
      "aqi": "58",
      "time": {
        "tz": "+09:00",
        "stime": "2025-01-08 15:00:00",
        "vtime": 1736337600
      },
      "station": {
        "name": "Tokyo, Japan",
        "geo": [35.6762, 139.6503],
        "url": "tokyo"
      }
    },
    {
      "uid": 7890,
      "aqi": "42",
      "time": {
        "tz": "+09:00",
        "stime": "2025-01-08 15:00:00",
        "vtime": 1736337600
      },
      "station": {
        "name": "Shinjuku, Tokyo, Japan",
        "geo": [35.6938, 139.7034],
        "url": "japan/tokyo/shinjuku"
      }
    }
  ]
}
```

### 8.3 AQICN Map Bounds Response

```json
{
  "status": "ok",
  "data": [
    {
      "lat": 35.6762,
      "lon": 139.6503,
      "uid": 1437,
      "aqi": "58",
      "station": {
        "name": "Tokyo",
        "time": "2025-01-08T15:00:00+09:00"
      }
    },
    {
      "lat": 35.4437,
      "lon": 139.638,
      "uid": 2456,
      "aqi": "45",
      "station": {
        "name": "Yokohama",
        "time": "2025-01-08T15:00:00+09:00"
      }
    }
  ]
}
```

### 8.4 Processed Response (from Backend)

```json
{
  "success": true,
  "data": {
    "id": 1437,
    "name": "Tokyo, Japan",
    "coordinates": {
      "lat": 35.6762,
      "lng": 139.6503
    },
    "aqi": 58,
    "level": "moderate",
    "dominantPollutant": "pm25",
    "lastUpdated": "2025-01-08T15:00:00+09:00",
    "timezone": "+09:00",
    "pollutants": [
      {
        "type": "pm25",
        "value": 58,
        "name": "PM2.5",
        "description": "Fine particulate matter",
        "unit": "µg/m³",
        "level": "moderate",
        "percentage": 58
      },
      {
        "type": "pm10",
        "value": 21,
        "name": "PM10",
        "description": "Coarse particulate matter",
        "unit": "µg/m³",
        "level": "good",
        "percentage": 21
      },
      {
        "type": "o3",
        "value": 33,
        "name": "Ozone",
        "description": "Ground-level ozone",
        "unit": "ppb",
        "level": "good",
        "percentage": 33
      },
      {
        "type": "no2",
        "value": 12,
        "name": "Nitrogen Dioxide",
        "description": "Nitrogen dioxide",
        "unit": "ppb",
        "level": "good",
        "percentage": 12
      }
    ],
    "weather": {
      "temperature": 18.5,
      "humidity": 57,
      "windSpeed": 3.2,
      "pressure": 1013,
      "windGust": null,
      "dewPoint": null
    },
    "forecast": {
      "dates": ["2025-01-08", "2025-01-09", "2025-01-10"],
      "pm25": {
        "avg": [55, 60, 50],
        "min": [35, 40, 30],
        "max": [75, 85, 70]
      },
      "pm10": {
        "avg": [22, 25, 20],
        "min": [12, 15, 10],
        "max": [35, 40, 32]
      },
      "o3": {
        "avg": [30, 28, 32],
        "min": [15, 14, 18],
        "max": [45, 42, 48]
      }
    },
    "attributions": [
      {
        "url": "http://www.kankyo.metro.tokyo.jp/",
        "name": "Tokyo Environment"
      }
    ],
    "healthRecommendation": {
      "level": "moderate",
      "headline": "Air quality is acceptable",
      "description": "Air quality is acceptable; however, there may be some health concern for a small number of people who are unusually sensitive to air pollution.",
      "outdoorActivity": "caution",
      "sensitiveGroups": [
        "People with respiratory disease",
        "Children and elderly",
        "People with heart disease"
      ],
      "generalAdvice": [
        "Sensitive individuals should consider reducing prolonged outdoor exertion",
        "Keep windows closed during high traffic hours",
        "Use air purifiers indoors if available"
      ]
    }
  },
  "cached": false,
  "timestamp": "2025-01-08T06:20:15Z"
}
```

### 8.5 Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "No station found for the specified location",
    "timestamp": "2025-01-08T06:25:00Z",
    "requestId": "req_abc123def456"
  }
}
```

---

## Appendix A: AQI Level Thresholds

| Level | AQI Range | Color | Health Implications |
|-------|-----------|-------|---------------------|
| Good | 0-50 | Green (#00e400) | Air quality is satisfactory |
| Moderate | 51-100 | Yellow (#ffff00) | Acceptable for most, some concern for sensitive groups |
| Unhealthy for Sensitive Groups | 101-150 | Orange (#ff7e00) | Members of sensitive groups may experience health effects |
| Unhealthy | 151-200 | Red (#ff0000) | Everyone may begin to experience health effects |
| Very Unhealthy | 201-300 | Purple (#8f3f97) | Health alert: everyone may experience serious effects |
| Hazardous | 301+ | Maroon (#7e0023) | Health warnings of emergency conditions |

---

## Appendix B: Pollutant Information

| Pollutant | Full Name | Unit | Good Range | Health Impact |
|-----------|-----------|------|------------|---------------|
| PM2.5 | Fine Particulate Matter | µg/m³ | 0-12 | Respiratory and cardiovascular issues |
| PM10 | Coarse Particulate Matter | µg/m³ | 0-54 | Respiratory irritation |
| O3 | Ozone | ppb | 0-54 | Breathing problems, lung damage |
| NO2 | Nitrogen Dioxide | ppb | 0-53 | Respiratory inflammation |
| SO2 | Sulfur Dioxide | ppb | 0-35 | Breathing difficulties |
| CO | Carbon Monoxide | ppm | 0-4.4 | Reduces oxygen in blood |

---

## Appendix C: Implementation Checklist

- [ ] Set up Express/Next.js API routes
- [ ] Implement cache layer (in-memory or Redis)
- [ ] Create TypeScript interfaces in `src/types/`
- [ ] Set up TanStack Query with proper configuration
- [ ] Implement all query hooks
- [ ] Add error handling middleware
- [ ] Set up environment variables for API keys
- [ ] Add request validation (Zod schemas)
- [ ] Implement rate limiting
- [ ] Add logging for debugging
- [ ] Set up offline persistence (optional)
- [ ] Write unit tests for services
- [ ] Add integration tests for API routes

---

*Report generated by API & Data Contract Designer Agent*
