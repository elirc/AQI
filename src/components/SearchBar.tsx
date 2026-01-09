import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { useSearch } from '../hooks/useAQI'
import { cn } from '../lib/utils'
import { getAQIColor } from '../types'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { data: results, isLoading } = useSearch(query)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (uid: number) => {
    navigate(`/city/${uid}`)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cities..."
          className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {results && results.length > 0 ? (
            <ul>
              {results.map((result) => {
                const aqi = parseInt(result.aqi) || 0
                return (
                  <li key={result.uid}>
                    <button
                      onClick={() => handleSelect(result.uid)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.station.name}</p>
                        {result.station.country && (
                          <p className="text-xs text-muted-foreground">{result.station.country}</p>
                        )}
                      </div>
                      {aqi > 0 && (
                        <span
                          className="px-2 py-1 rounded text-xs font-bold"
                          style={{
                            backgroundColor: getAQIColor(aqi),
                            color: aqi > 150 ? '#fff' : '#000',
                          }}
                        >
                          {aqi}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : !isLoading ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No results found</p>
          ) : null}
        </div>
      )}
    </div>
  )
}
