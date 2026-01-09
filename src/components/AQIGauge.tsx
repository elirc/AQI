import { useMemo } from 'react'
import { getAQILevel, AQI_RANGES } from '../types'

interface AQIGaugeProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
}

export default function AQIGauge({ value, size = 'md' }: AQIGaugeProps) {
  const level = useMemo(() => getAQILevel(value), [value])

  const sizes = {
    sm: { width: 120, height: 80, fontSize: 24, labelSize: 10 },
    md: { width: 200, height: 120, fontSize: 40, labelSize: 14 },
    lg: { width: 280, height: 160, fontSize: 56, labelSize: 18 },
  }

  const s = sizes[size]
  const centerX = s.width / 2
  const centerY = s.height - 10
  const radius = s.width / 2 - 20

  // Calculate angle for the needle (0 AQI = left, 500 AQI = right)
  const normalizedValue = Math.min(value, 500) / 500
  const angle = Math.PI * (1 - normalizedValue) // From π to 0

  const needleX = centerX + radius * 0.7 * Math.cos(angle)
  const needleY = centerY - radius * 0.7 * Math.sin(angle)

  return (
    <div className="flex flex-col items-center">
      <svg width={s.width} height={s.height} viewBox={`0 0 ${s.width} ${s.height}`}>
        {/* Background arc segments */}
        {AQI_RANGES.map((range, i) => {
          const startAngle = Math.PI * (1 - range.min / 500)
          const endAngle = Math.PI * (1 - Math.min(range.max, 500) / 500)

          const x1 = centerX + radius * Math.cos(startAngle)
          const y1 = centerY - radius * Math.sin(startAngle)
          const x2 = centerX + radius * Math.cos(endAngle)
          const y2 = centerY - radius * Math.sin(endAngle)

          const largeArc = Math.abs(startAngle - endAngle) > Math.PI ? 1 : 0

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
              stroke={range.color}
              strokeWidth={12}
              fill="none"
              strokeLinecap="round"
            />
          )
        })}

        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={centerX} cy={centerY} r={6} fill="currentColor" />

        {/* Value text */}
        <text
          x={centerX}
          y={centerY - 25}
          textAnchor="middle"
          fontSize={s.fontSize}
          fontWeight="bold"
          fill="currentColor"
        >
          {value}
        </text>
      </svg>

      {/* Label */}
      <div
        className="px-3 py-1 rounded-full font-medium mt-2"
        style={{
          backgroundColor: level.color,
          color: level.textColor,
          fontSize: s.labelSize,
        }}
      >
        {level.label}
      </div>
    </div>
  )
}
