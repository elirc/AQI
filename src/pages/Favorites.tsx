import { Link } from 'react-router-dom'
import { Heart, Trash2, MapPin, Loader2 } from 'lucide-react'
import { useStore } from '../store'
import { useCityAQI } from '../hooks/useAQI'
import { getAQIColor } from '../types'

function FavoriteCard({ uid, name, onRemove }: { uid: number; name: string; onRemove: () => void }) {
  const { data, isLoading } = useCityAQI(uid)

  const aqi = data && typeof data.aqi === 'number' ? data.aqi : null

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
        style={{
          backgroundColor: aqi ? getAQIColor(aqi) : 'hsl(var(--muted))',
          color: aqi && aqi > 150 ? '#fff' : '#000',
        }}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : aqi ? (
          aqi
        ) : (
          '?'
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link
          to={`/city/${uid}`}
          className="font-semibold hover:text-primary truncate block"
        >
          {name}
        </Link>
        {data?.dominentpol && (
          <p className="text-xs text-muted-foreground">
            Main: {data.dominentpol.toUpperCase()}
          </p>
        )}
      </div>

      <button
        onClick={onRemove}
        className="p-2 rounded-lg hover:bg-muted text-red-500 transition-colors"
        title="Remove from favorites"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function Favorites() {
  const { favorites, removeFavorite } = useStore()

  return (
    <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Favorite Cities
        </h1>
        <p className="text-muted-foreground text-sm">
          Your saved locations for quick access
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-4">
            Save cities to quickly check their air quality
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <MapPin className="w-4 h-4" />
            Explore the globe
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((city) => (
            <FavoriteCard
              key={city.uid}
              uid={city.uid}
              name={city.name}
              onRemove={() => removeFavorite(city.uid)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
