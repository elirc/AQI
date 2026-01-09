import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { CityAQI } from '../types'

interface PollutantChartProps {
  data: CityAQI['iaqi']
}

const POLLUTANT_INFO: Record<string, { label: string; unit: string; thresholds: number[] }> = {
  pm25: { label: 'PM2.5', unit: 'μg/m³', thresholds: [12, 35, 55, 150, 250] },
  pm10: { label: 'PM10', unit: 'μg/m³', thresholds: [54, 154, 254, 354, 424] },
  o3: { label: 'O₃', unit: 'ppb', thresholds: [54, 70, 85, 105, 200] },
  no2: { label: 'NO₂', unit: 'ppb', thresholds: [53, 100, 360, 649, 1249] },
  so2: { label: 'SO₂', unit: 'ppb', thresholds: [35, 75, 185, 304, 604] },
  co: { label: 'CO', unit: 'ppm', thresholds: [4.4, 9.4, 12.4, 15.4, 30.4] },
}

function getBarColor(value: number, thresholds: number[]): string {
  if (value <= thresholds[0]) return '#00e400'
  if (value <= thresholds[1]) return '#ffff00'
  if (value <= thresholds[2]) return '#ff7e00'
  if (value <= thresholds[3]) return '#ff0000'
  if (value <= thresholds[4]) return '#8f3f97'
  return '#7e0023'
}

export default function PollutantChart({ data }: PollutantChartProps) {
  const chartData = Object.entries(POLLUTANT_INFO)
    .map(([key, info]) => {
      const pollutantData = data[key as keyof typeof data]
      if (!pollutantData) return null
      return {
        name: info.label,
        value: pollutantData.v,
        unit: info.unit,
        thresholds: info.thresholds,
      }
    })
    .filter(Boolean) as Array<{
      name: string
      value: number
      unit: string
      thresholds: number[]
    }>

  if (chartData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No pollutant data available
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 50, right: 20 }}>
          <XAxis type="number" stroke="currentColor" opacity={0.5} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="currentColor"
            opacity={0.5}
            width={50}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const item = payload[0].payload
              return (
                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm">
                    {item.value} {item.unit}
                  </p>
                </div>
              )
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={getBarColor(entry.value, entry.thresholds)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
