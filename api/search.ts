import type { VercelRequest, VercelResponse } from '@vercel/node'

const AQICN_TOKEN = process.env.AQICN_TOKEN || 'demo'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { keyword } = req.query

  if (!keyword) {
    return res.status(400).json({ status: 'error', message: 'Keyword required' })
  }

  try {
    const response = await fetch(
      `https://api.waqi.info/search/?keyword=${keyword}&token=${AQICN_TOKEN}`
    )
    const data = await response.json()

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Search failed' })
  }
}
