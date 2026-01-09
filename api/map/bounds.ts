import type { VercelRequest, VercelResponse } from '@vercel/node'

const AQICN_TOKEN = process.env.AQICN_TOKEN || 'demo'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lat1 = -90, lng1 = -180, lat2 = 90, lng2 = 180 } = req.query

  try {
    const response = await fetch(
      `https://api.waqi.info/map/bounds/?latlng=${lat1},${lng1},${lat2},${lng2}&token=${AQICN_TOKEN}`
    )
    const data = await response.json()

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch map data' })
  }
}
