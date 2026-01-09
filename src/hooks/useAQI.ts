import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { CityAQI, SearchResult, AQIStation } from '../types'

const api = axios.create({
  baseURL: '/api',
})

// Fetch city AQI by ID
export function useCityAQI(cityId: string | number | undefined) {
  return useQuery({
    queryKey: ['city', cityId],
    queryFn: async () => {
      const { data } = await api.get<{ status: string; data: CityAQI }>(`/feed/@${cityId}`)
      if (data.status !== 'ok') throw new Error('Failed to fetch city data')
      return data.data
    },
    enabled: !!cityId,
  })
}

// Fetch city by name
export function useCityByName(name: string | undefined) {
  return useQuery({
    queryKey: ['city-name', name],
    queryFn: async () => {
      const { data } = await api.get<{ status: string; data: CityAQI }>(`/feed/${encodeURIComponent(name!)}`)
      if (data.status !== 'ok') throw new Error('Failed to fetch city data')
      return data.data
    },
    enabled: !!name,
  })
}

// Search cities
export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await api.get<{ status: string; data: SearchResult[] }>(`/search?keyword=${encodeURIComponent(query)}`)
      if (data.status !== 'ok') throw new Error('Search failed')
      return data.data
    },
    enabled: query.length >= 2,
  })
}

// Fetch all stations in bounds (for globe)
export function useMapStations(bounds?: { lat1: number; lng1: number; lat2: number; lng2: number }) {
  return useQuery({
    queryKey: ['map-stations', bounds],
    queryFn: async () => {
      const { data } = await api.get<{ status: string; data: AQIStation[] }>('/map/bounds', {
        params: bounds || { lat1: -90, lng1: -180, lat2: 90, lng2: 180 },
      })
      if (data.status !== 'ok') throw new Error('Failed to fetch stations')
      return data.data.filter(s => typeof s.aqi === 'number' && s.aqi > 0)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Fetch by geo location
export function useGeoAQI(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['geo', lat, lng],
    queryFn: async () => {
      const { data } = await api.get<{ status: string; data: CityAQI }>(`/feed/geo:${lat};${lng}`)
      if (data.status !== 'ok') throw new Error('Failed to fetch geo data')
      return data.data
    },
    enabled: lat !== undefined && lng !== undefined,
  })
}

// Get user's location
export function useUserLocation() {
  return useQuery({
    queryKey: ['user-location'],
    queryFn: () =>
      new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'))
          return
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(err),
          { timeout: 10000 }
        )
      }),
    staleTime: Infinity,
    retry: false,
  })
}
