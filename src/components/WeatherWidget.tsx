import { Thermometer, Droplets, Wind, Gauge } from 'lucide-react'
import type { CityAQI } from '../types'

interface WeatherWidgetProps {
  data: CityAQI['iaqi']
}

export default function WeatherWidget({ data }: WeatherWidgetProps) {
  const items = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: data.t?.v,
      unit: '°C',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: data.h?.v,
      unit: '%',
    },
    {
      icon: Wind,
      label: 'Wind',
      value: data.w?.v,
      unit: 'm/s',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: data.p?.v,
      unit: 'hPa',
    },
  ].filter((item) => item.value !== undefined)

  if (items.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
        >
          <item.icon className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="font-medium">
              {item.value}
              <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
