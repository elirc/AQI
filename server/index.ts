import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000

// AQICN API token - get yours at https://aqicn.org/data-platform/token/
const AQICN_TOKEN = process.env.AQICN_TOKEN || 'demo'

const aqicnApi = axios.create({
  baseURL: 'https://api.waqi.info',
})

app.use(cors())
app.use(express.json())

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key: string) {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data
  }
  return null
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() })
}

// Proxy endpoint for city feed
app.get('/api/feed/:city', async (req, res) => {
  try {
    const { city } = req.params
    const cacheKey = `feed:${city}`

    const cached = getCached(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    const { data } = await aqicnApi.get(`/feed/${city}/?token=${AQICN_TOKEN}`)
    setCache(cacheKey, data)
    res.json(data)
  } catch (error) {
    console.error('Feed error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch data' })
  }
})

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { keyword } = req.query
    if (!keyword) {
      return res.status(400).json({ status: 'error', message: 'Keyword required' })
    }

    const cacheKey = `search:${keyword}`
    const cached = getCached(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    const { data } = await aqicnApi.get(`/search/?keyword=${keyword}&token=${AQICN_TOKEN}`)
    setCache(cacheKey, data)
    res.json(data)
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ status: 'error', message: 'Search failed' })
  }
})

// Map bounds endpoint
app.get('/api/map/bounds', async (req, res) => {
  try {
    const { lat1 = -90, lng1 = -180, lat2 = 90, lng2 = 180 } = req.query
    const cacheKey = `map:${lat1}:${lng1}:${lat2}:${lng2}`

    const cached = getCached(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    const { data } = await aqicnApi.get(
      `/map/bounds/?latlng=${lat1},${lng1},${lat2},${lng2}&token=${AQICN_TOKEN}`
    )
    setCache(cacheKey, data)
    res.json(data)
  } catch (error) {
    console.error('Map error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch map data' })
  }
})

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`
  🌍 AirWatch API Server running at http://localhost:${PORT}

  Endpoints:
    GET /api/feed/:city    - Get AQI for a city
    GET /api/search?keyword= - Search cities
    GET /api/map/bounds    - Get stations in bounds
    GET /api/health        - Health check
  `)
})
