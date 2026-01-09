// AQI Levels
export type AQILevel = 'good' | 'moderate' | 'unhealthySensitive' | 'unhealthy' | 'veryUnhealthy' | 'hazardous'

export interface AQIRange {
  min: number
  max: number
  level: AQILevel
  label: string
  color: string
  textColor: string
  advice: string
}

export const AQI_RANGES: AQIRange[] = [
  { min: 0, max: 50, level: 'good', label: 'Good', color: '#00e400', textColor: '#000', advice: 'Air quality is satisfactory.' },
  { min: 51, max: 100, level: 'moderate', label: 'Moderate', color: '#ffff00', textColor: '#000', advice: 'Acceptable; moderate health concern for sensitive people.' },
  { min: 101, max: 150, level: 'unhealthySensitive', label: 'Unhealthy for Sensitive', color: '#ff7e00', textColor: '#000', advice: 'Sensitive groups may experience health effects.' },
  { min: 151, max: 200, level: 'unhealthy', label: 'Unhealthy', color: '#ff0000', textColor: '#fff', advice: 'Everyone may begin to experience health effects.' },
  { min: 201, max: 300, level: 'veryUnhealthy', label: 'Very Unhealthy', color: '#8f3f97', textColor: '#fff', advice: 'Health alert: everyone may experience serious effects.' },
  { min: 301, max: 500, level: 'hazardous', label: 'Hazardous', color: '#7e0023', textColor: '#fff', advice: 'Health warning of emergency conditions.' },
]

// Pollutant types
export interface Pollutant {
  name: string
  value: number
  unit: string
}

// Station/City data from AQICN
export interface AQIStation {
  uid: number
  aqi: number | string
  lat: number
  lon: number
  station: {
    name: string
    time: string
  }
}

export interface CityAQI {
  idx: number
  aqi: number
  city: {
    name: string
    geo: [number, number]
    url: string
  }
  dominentpol: string
  iaqi: {
    pm25?: { v: number }
    pm10?: { v: number }
    o3?: { v: number }
    no2?: { v: number }
    so2?: { v: number }
    co?: { v: number }
    t?: { v: number }
    h?: { v: number }
    w?: { v: number }
    p?: { v: number }
  }
  time: {
    s: string
    tz: string
    v: number
    iso: string
  }
  forecast?: {
    daily: {
      pm25?: ForecastDay[]
      pm10?: ForecastDay[]
      o3?: ForecastDay[]
    }
  }
  attributions: Array<{
    name: string
    url: string
  }>
}

export interface ForecastDay {
  avg: number
  day: string
  max: number
  min: number
}

// Search result
export interface SearchResult {
  uid: number
  aqi: string
  time: { tz: string; stime: string; vtime: number }
  station: {
    name: string
    geo: [number, number]
    url: string
    country: string
  }
}

// Favorites
export interface FavoriteCity {
  uid: number
  name: string
  country?: string
  lat: number
  lon: number
}

// App state
export interface AppState {
  theme: 'dark' | 'light'
  favorites: FavoriteCity[]
  selectedCity: number | null
  compareList: number[]
  toggleTheme: () => void
  addFavorite: (city: FavoriteCity) => void
  removeFavorite: (uid: number) => void
  setSelectedCity: (uid: number | null) => void
  addToCompare: (uid: number) => void
  removeFromCompare: (uid: number) => void
  clearCompare: () => void
}

// Helper functions
export function getAQILevel(aqi: number): AQIRange {
  return AQI_RANGES.find(r => aqi >= r.min && aqi <= r.max) || AQI_RANGES[AQI_RANGES.length - 1]
}

export function getAQIColor(aqi: number): string {
  return getAQILevel(aqi).color
}
