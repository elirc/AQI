import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, HeartOff, Plus, ExternalLink, Loader2, AlertTriangle } from 'lucide-react'
import { useCityAQI } from '../hooks/useAQI'
import { useStore } from '../store'
import { getAQILevel } from '../types'
import AQIGauge from '../components/AQIGauge'
import PollutantChart from '../components/PollutantChart'
import ForecastChart from '../components/ForecastChart'
import WeatherWidget from '../components/WeatherWidget'

export default function City() {
  const { cityId } = useParams<{ cityId: string }>()
  const { data, isLoading, error } = useCityAQI(cityId)
  const { favorites, addFavorite, removeFavorite, addToCompare, compareList } = useStore()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load data</h2>
        <p className="text-muted-foreground mb-4">Could not fetch air quality data for this location.</p>
        <Link to="/" className="text-primary hover:underline">
          ← Back to globe
        </Link>
      </div>
    )
  }

  const aqi = typeof data.aqi === 'number' ? data.aqi : 0
  const level = getAQILevel(aqi)
  const isFavorite = favorites.some((f) => f.uid === data.idx)
  const isInCompare = compareList.includes(data.idx)

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(data.idx)
    } else {
      addFavorite({
        uid: data.idx,
        name: data.city.name,
        lat: data.city.geo[0],
        lon: data.city.geo[1],
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to globe
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{data.city.name}</h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {data.time.s} ({data.time.tz})
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToggleFavorite}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <HeartOff className="w-5 h-5 text-red-500" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => addToCompare(data.idx)}
            disabled={isInCompare || compareList.length >= 3}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add to comparison"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main AQI Display */}
      <div
        className="rounded-xl p-6 mb-6 text-center"
        style={{ backgroundColor: level.color + '20' }}
      >
        <AQIGauge value={aqi} size="lg" />
        <p className="mt-4 text-lg max-w-md mx-auto">{level.advice}</p>
        {data.dominentpol && (
          <p className="mt-2 text-sm text-muted-foreground">
            Main pollutant: <span className="font-medium">{data.dominentpol.toUpperCase()}</span>
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pollutants */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold mb-4">Pollutant Levels</h2>
          <PollutantChart data={data.iaqi} />
        </div>

        {/* Weather */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold mb-4">Weather Conditions</h2>
          <WeatherWidget data={data.iaqi} />
        </div>

        {/* Forecast */}
        {data.forecast?.daily?.pm25 && (
          <div className="bg-card rounded-xl border border-border p-4 md:col-span-2">
            <h2 className="font-semibold mb-4">PM2.5 Forecast (7 days)</h2>
            <ForecastChart data={data.forecast.daily.pm25} pollutant="PM2.5" />
          </div>
        )}
      </div>

      {/* Attributions */}
      {data.attributions && data.attributions.length > 0 && (
        <div className="mt-6 text-sm text-muted-foreground">
          <p className="mb-2">Data sources:</p>
          <div className="flex flex-wrap gap-2">
            {data.attributions.map((attr, i) => (
              <a
                key={i}
                href={attr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                {attr.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
