import { Link } from 'react-router-dom'
import { X, Plus, BarChart3 } from 'lucide-react'
import { useStore } from '../store'
import { useCityAQI } from '../hooks/useAQI'
import { getAQILevel, getAQIColor } from '../types'
import AQIGauge from '../components/AQIGauge'

function CompareCard({ cityId, onRemove }: { cityId: number; onRemove: () => void }) {
  const { data, isLoading, error } = useCityAQI(cityId)

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-4 animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4 mb-4" />
        <div className="h-32 bg-muted rounded" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-muted-foreground">Failed to load</p>
        <button onClick={onRemove} className="text-red-500 text-sm mt-2">
          Remove
        </button>
      </div>
    )
  }

  const aqi = typeof data.aqi === 'number' ? data.aqi : 0
  const level = getAQILevel(aqi)

  return (
    <div className="bg-card rounded-xl border border-border p-4 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
      >
        <X className="w-4 h-4" />
      </button>

      <h3 className="font-semibold pr-8 mb-4 truncate">{data.city.name}</h3>

      <div className="flex justify-center mb-4">
        <AQIGauge value={aqi} size="sm" />
      </div>

      <div className="space-y-2 text-sm">
        {data.iaqi.pm25 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">PM2.5</span>
            <span>{data.iaqi.pm25.v}</span>
          </div>
        )}
        {data.iaqi.pm10 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">PM10</span>
            <span>{data.iaqi.pm10.v}</span>
          </div>
        )}
        {data.iaqi.o3 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">O₃</span>
            <span>{data.iaqi.o3.v}</span>
          </div>
        )}
        {data.iaqi.t && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Temp</span>
            <span>{data.iaqi.t.v}°C</span>
          </div>
        )}
      </div>

      <Link
        to={`/city/${cityId}`}
        className="block mt-4 text-center text-sm text-primary hover:underline"
      >
        View details →
      </Link>
    </div>
  )
}

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useStore()

  return (
    <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Compare Cities
          </h1>
          <p className="text-muted-foreground text-sm">
            Compare up to 3 cities side by side
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-sm text-red-500 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {compareList.length === 0 ? (
        <div className="text-center py-16">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold mb-2">No cities to compare</h2>
          <p className="text-muted-foreground mb-4">
            Search for cities and click the + button to add them here
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add cities from the globe
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {compareList.map((cityId) => (
            <CompareCard
              key={cityId}
              cityId={cityId}
              onRemove={() => removeFromCompare(cityId)}
            />
          ))}

          {compareList.length < 3 && (
            <Link
              to="/"
              className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] hover:border-primary hover:bg-muted/50 transition-colors"
            >
              <Plus className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Add another city</p>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
