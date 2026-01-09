import { Link, useLocation } from 'react-router-dom'
import { Globe, Search, Heart, BarChart3, Sun, Moon } from 'lucide-react'
import { useStore } from '../store'
import { cn } from '../lib/utils'
import SearchBar from './SearchBar'

const navItems = [
  { path: '/', icon: Globe, label: 'Globe' },
  { path: '/favorites', icon: Heart, label: 'Favorites' },
  { path: '/compare', icon: BarChart3, label: 'Compare' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { theme, toggleTheme } = useStore()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Globe className="w-6 h-6 text-primary" />
            <span className="hidden sm:inline">AirWatch</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Nav + Theme */}
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 text-xs',
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
