import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts'
import type { ForecastDay } from '../types'

interface ForecastChartProps {
  data: ForecastDay[]
  pollutant: string
}

export default function ForecastChart({ data, pollutant }: ForecastChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No forecast data available
      </div>
    )
  }

  const chartData = data.map((d) => ({
    date: new Date(d.day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    avg: d.avg,
    min: d.min,
    max: d.max,
    range: [d.min, d.max],
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="currentColor"
            opacity={0.5}
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="currentColor" opacity={0.5} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const item = payload[0].payload
              return (
                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                  <p className="font-medium">{item.date}</p>
                  <p className="text-sm text-primary">Avg: {item.avg}</p>
                  <p className="text-xs text-muted-foreground">
                    Range: {item.min} - {item.max}
                  </p>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="max"
            stroke="transparent"
            fill="url(#colorRange)"
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#3b82f6"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#3b82f6"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
