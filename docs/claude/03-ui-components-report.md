# AirWatch UI Components Report

## Table of Contents
1. [Component Inventory](#1-component-inventory)
2. [AQI Color Scale](#2-aqi-color-scale)
3. [Layout Specifications](#3-layout-specifications)
4. [shadcn Components to Use](#4-shadcn-components-to-use)
5. [Globe Component Spec](#5-globe-component-spec)
6. [Animation Patterns](#6-animation-patterns)
7. [Accessibility Requirements](#7-accessibility-requirements)

---

## 1. Component Inventory

### 1.1 Core Layout Components

#### `AppShell`
Main application wrapper with header, sidebar, and content area.

```tsx
interface AppShellProps {
  children: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}
```

**Tailwind Classes:**
```tsx
// Container
className="min-h-screen bg-background text-foreground"

// Main layout grid
className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]"

// Content area
className="flex-1 overflow-auto p-4 md:p-6 lg:p-8"
```

---

#### `Header`
Top navigation bar with logo, search, theme toggle, and user actions.

```tsx
interface HeaderProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
}
```

**Tailwind Classes:**
```tsx
className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"

// Inner container
className="container flex h-14 max-w-screen-2xl items-center px-4 md:h-16"

// Logo section
className="flex items-center gap-2 font-semibold text-lg"

// Actions section
className="flex items-center gap-2 ml-auto"
```

---

#### `Sidebar`
Left sidebar with favorites, recent searches, and navigation.

```tsx
interface SidebarProps {
  favorites: City[];
  recentSearches: City[];
  onCitySelect: (city: City) => void;
  onRemoveFavorite: (cityId: string) => void;
  isCollapsed?: boolean;
}
```

**Tailwind Classes:**
```tsx
// Desktop sidebar
className="hidden lg:flex lg:flex-col lg:w-[280px] xl:w-[320px] border-r border-border bg-muted/30"

// Mobile drawer
className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background shadow-xl lg:hidden"

// Section headers
className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"

// City list item
className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg mx-2 cursor-pointer transition-colors"
```

---

### 1.2 Globe & Map Components

#### `GlobeContainer`
Wrapper for the 3D globe with loading states and controls.

```tsx
interface GlobeContainerProps {
  stations: AQIStation[];
  selectedStation?: AQIStation | null;
  onStationSelect: (station: AQIStation) => void;
  onStationHover?: (station: AQIStation | null) => void;
  autoRotate?: boolean;
  initialPosition?: { lat: number; lng: number };
  zoom?: number;
}
```

**Tailwind Classes:**
```tsx
// Container
className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden bg-slate-950"

// Loading overlay
className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"

// Controls overlay
className="absolute bottom-4 right-4 flex flex-col gap-2 z-10"
```

---

#### `GlobeMarker`
Individual pollution marker on the globe (3D sprite).

```tsx
interface GlobeMarkerProps {
  position: [number, number, number]; // x, y, z
  aqi: number;
  stationId: string;
  cityName: string;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onHover?: (hovering: boolean) => void;
}
```

---

#### `GlobeControls`
Zoom, rotation, and reset controls for the globe.

```tsx
interface GlobeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleRotation: () => void;
  isRotating: boolean;
}
```

**Tailwind Classes:**
```tsx
// Control button
className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-accent transition-colors"

// Button group
className="flex flex-col gap-1 bg-background/60 backdrop-blur-sm rounded-xl p-1 border border-border/50"
```

---

#### `GlobeTooltip`
Hover tooltip showing station info.

```tsx
interface GlobeTooltipProps {
  station: AQIStation;
  position: { x: number; y: number };
  visible: boolean;
}
```

**Tailwind Classes:**
```tsx
className="absolute pointer-events-none z-50 px-3 py-2 rounded-lg bg-popover text-popover-foreground shadow-lg border border-border text-sm"
```

---

### 1.3 Search Components

#### `CitySearch`
Main search input with autocomplete dropdown.

```tsx
interface CitySearchProps {
  onSelect: (city: City) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  stationId?: string;
}
```

**Tailwind Classes:**
```tsx
// Search container
className="relative w-full max-w-md"

// Input wrapper
className="relative flex items-center"

// Input
className="w-full h-10 md:h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

// Search icon
className="absolute left-3 h-4 w-4 text-muted-foreground"

// Clear button
className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
```

---

#### `SearchDropdown`
Autocomplete suggestions list.

```tsx
interface SearchDropdownProps {
  results: City[];
  isLoading: boolean;
  onSelect: (city: City) => void;
  highlightedIndex: number;
  onHighlightChange: (index: number) => void;
}
```

**Tailwind Classes:**
```tsx
// Dropdown container
className="absolute top-full left-0 right-0 mt-2 max-h-[300px] overflow-auto rounded-xl border border-border bg-popover shadow-lg z-50"

// Result item
className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent transition-colors"

// Highlighted item
className="bg-accent"

// City name
className="font-medium text-foreground"

// Country
className="text-sm text-muted-foreground"

// No results
className="px-4 py-8 text-center text-muted-foreground"

// Loading state
className="px-4 py-8 flex items-center justify-center gap-2 text-muted-foreground"
```

---

### 1.4 AQI Display Components

#### `AQIGauge`
Circular gauge/dial showing current AQI value.

```tsx
interface AQIGaugeProps {
  value: number;
  maxValue?: number; // default 500
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showCategory?: boolean;
  animated?: boolean;
}
```

**Size Classes:**
```tsx
const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-40 h-40',
  xl: 'w-56 h-56',
};
```

**Implementation Notes:**
- Use SVG for the gauge arc
- Gradient stroke based on AQI value
- Center text for numeric value
- Category label below

```tsx
// Container
className="relative flex flex-col items-center"

// Gauge SVG wrapper
className={cn("relative", sizeClasses[size])}

// Center value
className="absolute inset-0 flex flex-col items-center justify-center"

// Value text (dynamic color based on AQI)
className="text-2xl md:text-3xl lg:text-4xl font-bold tabular-nums"

// Category label
className="text-xs md:text-sm font-medium mt-1"
```

---

#### `AQICard`
Card displaying AQI with category and health info.

```tsx
interface AQICardProps {
  aqi: number;
  cityName: string;
  stationName?: string;
  lastUpdated: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
}
```

**Tailwind Classes:**
```tsx
// Card
className="rounded-2xl border border-border bg-card p-6 shadow-sm"

// Header
className="flex items-start justify-between mb-4"

// City name
className="text-xl font-semibold text-card-foreground"

// Station name
className="text-sm text-muted-foreground mt-0.5"

// Last updated
className="text-xs text-muted-foreground"

// AQI section
className="flex items-center gap-6"

// Health message
className="mt-4 p-3 rounded-lg bg-muted/50"
```

---

#### `AQIBadge`
Inline badge showing AQI value with color.

```tsx
interface AQIBadgeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
```

**Tailwind Classes:**
```tsx
// Badge base
className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium"

// Size variants
const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};
```

---

#### `AQIScale`
Legend showing all AQI categories.

```tsx
interface AQIScaleProps {
  currentValue?: number;
  orientation?: 'horizontal' | 'vertical';
  showValues?: boolean;
  compact?: boolean;
}
```

**Tailwind Classes:**
```tsx
// Horizontal scale
className="flex items-stretch h-8 rounded-lg overflow-hidden"

// Vertical scale
className="flex flex-col w-8 rounded-lg overflow-hidden"

// Scale segment
className="flex-1 flex items-center justify-center text-xs font-medium text-white"

// Legend item
className="flex items-center gap-2 text-sm"

// Color dot
className="w-3 h-3 rounded-full"
```

---

### 1.5 Pollutant Components

#### `PollutantBreakdown`
Grid of individual pollutant values.

```tsx
interface PollutantBreakdownProps {
  pollutants: Pollutant[];
  layout?: 'grid' | 'list';
  showUnits?: boolean;
}

interface Pollutant {
  name: string; // PM2.5, PM10, O3, NO2, SO2, CO
  value: number;
  unit: string;
  aqi?: number;
}
```

**Tailwind Classes:**
```tsx
// Grid layout
className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"

// List layout
className="flex flex-col gap-2"

// Pollutant card
className="flex flex-col p-4 rounded-xl bg-muted/50 border border-border/50"

// Pollutant name
className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1"

// Pollutant value
className="text-2xl font-bold tabular-nums"

// Unit
className="text-sm text-muted-foreground"
```

---

#### `PollutantChart`
Bar chart comparing pollutant levels.

```tsx
interface PollutantChartProps {
  data: Pollutant[];
  height?: number;
  showLegend?: boolean;
  colorByAQI?: boolean;
}
```

**Tailwind Classes:**
```tsx
// Container
className="w-full"

// Chart wrapper
className="h-[200px] md:h-[250px]"

// Legend
className="flex flex-wrap gap-4 mt-4 justify-center"
```

---

### 1.6 Weather Components

#### `WeatherWidget`
Current weather conditions display.

```tsx
interface WeatherWidgetProps {
  weather: WeatherData;
  compact?: boolean;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  condition: string;
  icon: string;
}
```

**Tailwind Classes:**
```tsx
// Widget container
className="rounded-xl border border-border bg-card p-4"

// Compact layout
className="flex items-center gap-4"

// Full layout
className="grid grid-cols-2 gap-4"

// Weather icon
className="w-12 h-12 md:w-16 md:h-16"

// Temperature
className="text-3xl font-bold"

// Metric label
className="text-xs text-muted-foreground uppercase tracking-wider"

// Metric value
className="text-lg font-semibold"
```

---

### 1.7 Chart Components

#### `TrendChart`
Historical AQI trend line chart.

```tsx
interface TrendChartProps {
  data: TrendDataPoint[];
  timeRange: '24h' | '7d' | '30d' | '1y';
  onTimeRangeChange?: (range: string) => void;
  showPollutants?: boolean;
  height?: number;
}

interface TrendDataPoint {
  timestamp: Date;
  aqi: number;
  pollutants?: Record<string, number>;
}
```

**Tailwind Classes:**
```tsx
// Container
className="w-full rounded-xl border border-border bg-card p-4 md:p-6"

// Header
className="flex items-center justify-between mb-4"

// Title
className="text-lg font-semibold"

// Time range tabs
className="flex items-center gap-1 p-1 rounded-lg bg-muted"

// Tab button
className="px-3 py-1.5 text-sm rounded-md transition-colors"

// Active tab
className="bg-background shadow-sm"

// Chart area
className="h-[250px] md:h-[300px]"
```

---

#### `ForecastChart`
7-day AQI forecast display.

```tsx
interface ForecastChartProps {
  data: ForecastDataPoint[];
  showConfidenceInterval?: boolean;
}

interface ForecastDataPoint {
  date: Date;
  avgAqi: number;
  minAqi: number;
  maxAqi: number;
  dominantPollutant: string;
}
```

**Tailwind Classes:**
```tsx
// Container
className="w-full rounded-xl border border-border bg-card p-4 md:p-6"

// Day card (horizontal scroll on mobile)
className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:overflow-visible"

// Individual day
className="flex-shrink-0 w-[100px] md:w-auto flex flex-col items-center p-3 rounded-xl hover:bg-accent transition-colors"

// Day name
className="text-sm font-medium text-muted-foreground"

// AQI value
className="text-2xl font-bold my-2"

// Range
className="text-xs text-muted-foreground"
```

---

### 1.8 Comparison Components

#### `ComparisonView`
Side-by-side city comparison.

```tsx
interface ComparisonViewProps {
  cities: CityAQIData[];
  onAddCity: () => void;
  onRemoveCity: (cityId: string) => void;
  maxCities?: number; // default 3
}
```

**Tailwind Classes:**
```tsx
// Container
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"

// City card
className="rounded-2xl border border-border bg-card p-6"

// Add city card
className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors min-h-[300px]"

// Add icon
className="w-12 h-12 text-muted-foreground"

// Add text
className="text-sm text-muted-foreground"
```

---

#### `ComparisonChart`
Overlay chart comparing multiple cities.

```tsx
interface ComparisonChartProps {
  cities: {
    id: string;
    name: string;
    data: TrendDataPoint[];
    color: string;
  }[];
  metric: 'aqi' | 'pm25' | 'pm10' | 'o3' | 'no2';
  timeRange: '24h' | '7d' | '30d';
}
```

**Tailwind Classes:**
```tsx
// Container
className="w-full rounded-xl border border-border bg-card p-4 md:p-6"

// Legend
className="flex flex-wrap gap-4 mb-4"

// Legend item
className="flex items-center gap-2 text-sm"

// Legend color indicator
className="w-3 h-3 rounded-full"

// Chart area
className="h-[300px] md:h-[400px]"
```

---

### 1.9 Favorites Components

#### `FavoritesList`
List of saved favorite cities.

```tsx
interface FavoritesListProps {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (cityId: string) => void;
  onReorder?: (newOrder: FavoriteCity[]) => void;
  compact?: boolean;
}

interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  currentAqi?: number;
  lastUpdated?: Date;
}
```

**Tailwind Classes:**
```tsx
// List container
className="flex flex-col gap-2"

// Favorite item
className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors group"

// City info
className="flex-1 min-w-0"

// City name
className="font-medium truncate"

// Country
className="text-sm text-muted-foreground"

// AQI badge
className="flex-shrink-0"

// Remove button (appears on hover)
className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-destructive transition-opacity"

// Empty state
className="text-center py-8 text-muted-foreground"
```

---

#### `FavoriteButton`
Toggle button to add/remove from favorites.

```tsx
interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
```

**Tailwind Classes:**
```tsx
// Button base
className="inline-flex items-center gap-2 transition-colors"

// Unfavorited state
className="text-muted-foreground hover:text-yellow-500"

// Favorited state
className="text-yellow-500"

// Icon sizes
const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};
```

---

### 1.10 Theme Components

#### `ThemeToggle`
Dark/light theme switch.

```tsx
interface ThemeToggleProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  variant?: 'button' | 'dropdown' | 'switch';
}
```

**Tailwind Classes:**
```tsx
// Button variant
className="p-2 rounded-lg hover:bg-accent transition-colors"

// Icon
className="w-5 h-5"

// Dropdown trigger
className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent"

// Dropdown menu
className="w-36 p-1 rounded-lg border border-border bg-popover shadow-lg"

// Dropdown item
className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent cursor-pointer"
```

---

### 1.11 Alert Components

#### `AQIAlert`
Alert banner for high AQI levels.

```tsx
interface AQIAlertProps {
  severity: 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  message: string;
  onDismiss?: () => void;
  actions?: AlertAction[];
}
```

**Tailwind Classes:**
```tsx
// Alert base
className="flex items-start gap-3 p-4 rounded-xl border"

// Severity variants
const severityClasses = {
  moderate: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  unhealthy: 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400',
  'very-unhealthy': 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400',
  hazardous: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
};

// Icon
className="w-5 h-5 flex-shrink-0 mt-0.5"

// Content
className="flex-1"

// Title
className="font-medium"

// Message
className="text-sm opacity-90 mt-1"

// Actions
className="flex gap-2 mt-3"

// Dismiss button
className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
```

---

### 1.12 Loading & State Components

#### `Skeleton`
Loading placeholder components.

```tsx
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}
```

**Tailwind Classes:**
```tsx
// Base skeleton
className="animate-pulse bg-muted rounded"

// Text variant
className="h-4 rounded"

// Circular variant
className="rounded-full"

// Specific skeletons
// AQI Card skeleton
className="space-y-4 p-6 rounded-2xl border border-border"

// Gauge skeleton
className="w-32 h-32 rounded-full bg-muted animate-pulse"
```

---

#### `EmptyState`
Empty data state display.

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Tailwind Classes:**
```tsx
// Container
className="flex flex-col items-center justify-center py-12 px-4 text-center"

// Icon
className="w-16 h-16 text-muted-foreground/50 mb-4"

// Title
className="text-lg font-medium text-foreground"

// Description
className="text-sm text-muted-foreground mt-1 max-w-sm"

// Action button
className="mt-4"
```

---

#### `ErrorState`
Error display with retry option.

```tsx
interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  fullPage?: boolean;
}
```

**Tailwind Classes:**
```tsx
// Container
className="flex flex-col items-center justify-center py-12 px-4 text-center"

// Full page variant
className="min-h-[50vh]"

// Icon
className="w-12 h-12 text-destructive mb-4"

// Message
className="text-sm text-muted-foreground max-w-md"

// Retry button
className="mt-4"
```

---

## 2. AQI Color Scale

### 2.1 Color Definitions

| AQI Range | Category | Health Concern | Tailwind BG | Tailwind Text | Hex |
|-----------|----------|----------------|-------------|---------------|-----|
| 0-50 | Good | Minimal impact | `bg-emerald-500` | `text-emerald-500` | `#10B981` |
| 51-100 | Moderate | Acceptable | `bg-yellow-400` | `text-yellow-500` | `#FACC15` |
| 101-150 | Unhealthy (Sensitive) | Sensitive groups affected | `bg-orange-500` | `text-orange-500` | `#F97316` |
| 151-200 | Unhealthy | Everyone affected | `bg-red-500` | `text-red-500` | `#EF4444` |
| 201-300 | Very Unhealthy | Health alert | `bg-purple-600` | `text-purple-600` | `#9333EA` |
| 301-500 | Hazardous | Emergency | `bg-rose-900` | `text-rose-900` | `#881337` |

### 2.2 Color Utility Function

```tsx
// utils/aqi-colors.ts
export type AQICategory =
  | 'good'
  | 'moderate'
  | 'unhealthy-sensitive'
  | 'unhealthy'
  | 'very-unhealthy'
  | 'hazardous';

export interface AQITheme {
  category: AQICategory;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  ringClass: string;
  hex: string;
  gradient: string;
}

export function getAQITheme(aqi: number): AQITheme {
  if (aqi <= 50) {
    return {
      category: 'good',
      label: 'Good',
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-500',
      borderClass: 'border-emerald-500',
      ringClass: 'ring-emerald-500',
      hex: '#10B981',
      gradient: 'from-emerald-400 to-emerald-600',
    };
  }
  if (aqi <= 100) {
    return {
      category: 'moderate',
      label: 'Moderate',
      bgClass: 'bg-yellow-400',
      textClass: 'text-yellow-500',
      borderClass: 'border-yellow-400',
      ringClass: 'ring-yellow-400',
      hex: '#FACC15',
      gradient: 'from-yellow-300 to-yellow-500',
    };
  }
  if (aqi <= 150) {
    return {
      category: 'unhealthy-sensitive',
      label: 'Unhealthy for Sensitive Groups',
      bgClass: 'bg-orange-500',
      textClass: 'text-orange-500',
      borderClass: 'border-orange-500',
      ringClass: 'ring-orange-500',
      hex: '#F97316',
      gradient: 'from-orange-400 to-orange-600',
    };
  }
  if (aqi <= 200) {
    return {
      category: 'unhealthy',
      label: 'Unhealthy',
      bgClass: 'bg-red-500',
      textClass: 'text-red-500',
      borderClass: 'border-red-500',
      ringClass: 'ring-red-500',
      hex: '#EF4444',
      gradient: 'from-red-400 to-red-600',
    };
  }
  if (aqi <= 300) {
    return {
      category: 'very-unhealthy',
      label: 'Very Unhealthy',
      bgClass: 'bg-purple-600',
      textClass: 'text-purple-600',
      borderClass: 'border-purple-600',
      ringClass: 'ring-purple-600',
      hex: '#9333EA',
      gradient: 'from-purple-500 to-purple-700',
    };
  }
  return {
    category: 'hazardous',
    label: 'Hazardous',
    bgClass: 'bg-rose-900',
    textClass: 'text-rose-900',
    borderClass: 'border-rose-900',
    ringClass: 'ring-rose-900',
    hex: '#881337',
    gradient: 'from-rose-800 to-rose-950',
  };
}

// For dark mode compatible badge backgrounds
export function getAQIBadgeClasses(aqi: number): string {
  if (aqi <= 50) return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
  if (aqi <= 100) return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
  if (aqi <= 150) return 'bg-orange-500/20 text-orange-600 dark:text-orange-400';
  if (aqi <= 200) return 'bg-red-500/20 text-red-600 dark:text-red-400';
  if (aqi <= 300) return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
  return 'bg-rose-500/20 text-rose-600 dark:text-rose-400';
}
```

### 2.3 Health Messages

```tsx
export const healthMessages: Record<AQICategory, {
  short: string;
  long: string;
  advice: string;
}> = {
  good: {
    short: 'Air quality is satisfactory',
    long: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    advice: 'Enjoy outdoor activities.',
  },
  moderate: {
    short: 'Acceptable air quality',
    long: 'Air quality is acceptable. However, there may be a risk for some people who are unusually sensitive to air pollution.',
    advice: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.',
  },
  'unhealthy-sensitive': {
    short: 'Unhealthy for sensitive groups',
    long: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    advice: 'Active children and adults, and people with respiratory disease should limit prolonged outdoor exertion.',
  },
  unhealthy: {
    short: 'Unhealthy for everyone',
    long: 'Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.',
    advice: 'Active children and adults, and people with respiratory disease should avoid prolonged outdoor exertion.',
  },
  'very-unhealthy': {
    short: 'Health alert',
    long: 'Health alert: The risk of health effects is increased for everyone.',
    advice: 'Everyone should avoid prolonged outdoor exertion.',
  },
  hazardous: {
    short: 'Health emergency',
    long: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    advice: 'Everyone should avoid all outdoor physical activity.',
  },
};
```

---

## 3. Layout Specifications

### 3.1 Responsive Breakpoints

Following Tailwind's default breakpoints:

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### 3.2 Page Layout Patterns

#### Desktop Layout (lg+)
```
+------------------+--------------------------------+
|     Header (fixed, h-16)                         |
+------------------+--------------------------------+
|                  |                                |
|    Sidebar       |         Main Content           |
|    (280-320px)   |         (flex-1)               |
|    fixed         |         overflow-auto          |
|                  |                                |
+------------------+--------------------------------+
```

```tsx
// Desktop layout
<div className="min-h-screen bg-background">
  <Header className="fixed top-0 left-0 right-0 h-16 z-50" />
  <div className="flex pt-16">
    <Sidebar className="fixed left-0 top-16 bottom-0 w-[280px] xl:w-[320px] border-r" />
    <main className="flex-1 ml-[280px] xl:ml-[320px] p-6">
      {children}
    </main>
  </div>
</div>
```

#### Tablet Layout (md-lg)
```
+----------------------------------------+
|            Header (fixed)               |
+----------------------------------------+
|                                        |
|           Main Content                  |
|           (full width)                  |
|                                        |
+----------------------------------------+
|         Bottom Navigation?              |
+----------------------------------------+
```

#### Mobile Layout (< md)
```
+------------------------+
|  Header (hamburger)    |
+------------------------+
|                        |
|    Main Content        |
|    (full width)        |
|    p-4                 |
|                        |
+------------------------+
| Bottom Nav (optional)  |
+------------------------+
```

### 3.3 Content Area Layouts

#### Dashboard Grid
```tsx
// Main dashboard layout
<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
  {/* Globe section - spans full width on mobile, 8 cols on desktop */}
  <section className="lg:col-span-8 xl:col-span-9">
    <GlobeContainer />
  </section>

  {/* Side panel - below on mobile, 4 cols on desktop */}
  <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
    <CitySearch />
    <AQICard />
    <WeatherWidget />
  </aside>
</div>

{/* Charts section - full width */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
  <TrendChart />
  <ForecastChart />
</section>

{/* Pollutants section */}
<section className="mt-6">
  <PollutantBreakdown />
</section>
```

#### City Detail Page
```tsx
<div className="max-w-6xl mx-auto space-y-6">
  {/* Header with city name and favorite button */}
  <header className="flex items-start justify-between">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">{city.name}</h1>
      <p className="text-muted-foreground">{city.country}</p>
    </div>
    <FavoriteButton />
  </header>

  {/* Main AQI display */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-1">
      <AQIGauge value={aqi} size="xl" />
    </div>
    <div className="md:col-span-2">
      <PollutantBreakdown />
    </div>
  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <TrendChart />
    <ForecastChart />
  </div>

  {/* Weather */}
  <WeatherWidget />
</div>
```

#### Comparison Page
```tsx
<div className="space-y-6">
  <header className="flex items-center justify-between">
    <h1 className="text-2xl font-bold">Compare Cities</h1>
    <Button onClick={onAddCity}>Add City</Button>
  </header>

  {/* City cards grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {cities.map(city => (
      <CityComparisonCard key={city.id} city={city} />
    ))}
  </div>

  {/* Comparison chart - full width */}
  <ComparisonChart cities={cities} />
</div>
```

### 3.4 Spacing System

Using Tailwind's default spacing scale:

| Usage | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| Page padding | `p-4` | `p-6` | `p-8` |
| Card padding | `p-4` | `p-5` | `p-6` |
| Section gap | `gap-4` | `gap-6` | `gap-6` |
| Element gap (tight) | `gap-2` | `gap-2` | `gap-3` |
| Element gap (loose) | `gap-4` | `gap-4` | `gap-6` |

### 3.5 Container Widths

```tsx
// Max widths for different contexts
const containerWidths = {
  full: 'max-w-none',
  content: 'max-w-6xl', // 1152px - main content
  narrow: 'max-w-3xl', // 768px - text-heavy pages
  wide: 'max-w-7xl', // 1280px - dashboard
};
```

---

## 4. shadcn Components to Use

### 4.1 Core Components

| Component | Usage | Customizations |
|-----------|-------|----------------|
| `Button` | All interactive buttons | Add AQI color variants |
| `Card` | Content containers | Custom border-radius (2xl) |
| `Input` | Search, forms | Larger touch targets |
| `Badge` | AQI badges, tags | AQI color variants |
| `Skeleton` | Loading states | - |
| `Tooltip` | Info hints | - |
| `Dialog` | Modals, confirmations | - |
| `Dropdown Menu` | Context menus | - |
| `Command` | Search autocomplete | City search implementation |
| `Popover` | Floating content | Globe tooltips |
| `Tabs` | Time range selection | Chart controls |
| `Toggle` | Theme switch | - |
| `Slider` | Optional controls | - |
| `Alert` | AQI warnings | Custom severity colors |
| `Toast` | Notifications | - |
| `Separator` | Visual dividers | - |
| `ScrollArea` | Scrollable lists | Favorites, search results |

### 4.2 Button Variants

```tsx
// components/ui/button.tsx - extended variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // AQI variants
        "aqi-good": "bg-emerald-500 text-white hover:bg-emerald-600",
        "aqi-moderate": "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
        "aqi-unhealthy": "bg-red-500 text-white hover:bg-red-600",
        "aqi-hazardous": "bg-rose-900 text-white hover:bg-rose-950",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 4.3 Card Customization

```tsx
// components/ui/card.tsx - extended
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'border bg-card',
    elevated: 'bg-card shadow-lg',
    outlined: 'border-2 bg-transparent',
    glass: 'bg-background/60 backdrop-blur-md border border-border/50',
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl text-card-foreground",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
```

### 4.4 Command (Search) Customization

```tsx
// For city search autocomplete
<Command className="rounded-xl border shadow-lg">
  <CommandInput
    placeholder="Search cities..."
    className="h-11"
  />
  <CommandList className="max-h-[300px]">
    <CommandEmpty>No cities found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      {cities.map((city) => (
        <CommandItem
          key={city.id}
          value={city.name}
          onSelect={() => onSelect(city)}
          className="flex items-center gap-3 py-3"
        >
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium">{city.name}</p>
            <p className="text-sm text-muted-foreground">{city.country}</p>
          </div>
          {city.currentAqi && (
            <AQIBadge value={city.currentAqi} size="sm" />
          )}
        </CommandItem>
      ))}
    </CommandGroup>
  </CommandList>
</Command>
```

### 4.5 Custom Alert for AQI

```tsx
// components/ui/aqi-alert.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const aqiAlertVariants = {
  moderate: {
    container: "border-yellow-500/50 bg-yellow-500/10",
    icon: "text-yellow-600 dark:text-yellow-400",
    title: "text-yellow-800 dark:text-yellow-200",
  },
  unhealthy: {
    container: "border-orange-500/50 bg-orange-500/10",
    icon: "text-orange-600 dark:text-orange-400",
    title: "text-orange-800 dark:text-orange-200",
  },
  "very-unhealthy": {
    container: "border-purple-500/50 bg-purple-500/10",
    icon: "text-purple-600 dark:text-purple-400",
    title: "text-purple-800 dark:text-purple-200",
  },
  hazardous: {
    container: "border-rose-500/50 bg-rose-500/10",
    icon: "text-rose-600 dark:text-rose-400",
    title: "text-rose-800 dark:text-rose-200",
  },
};

export function AQIAlert({ severity, title, children }) {
  const variant = aqiAlertVariants[severity];

  return (
    <Alert className={cn("rounded-xl", variant.container)}>
      <AlertCircle className={cn("h-5 w-5", variant.icon)} />
      <AlertTitle className={variant.title}>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
```

---

## 5. Globe Component Spec

### 5.1 Technology Stack

- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers (OrbitControls, Html, etc.)
- **three** - Core Three.js library
- **three-globe** - Globe visualization library (optional alternative)

### 5.2 Globe Component Architecture

```
GlobeContainer/
  GlobeScene/
    Globe (sphere mesh)
    Atmosphere (glow effect)
    Markers (instanced meshes)
    Camera
    Lights
    OrbitControls
  GlobeControls (UI overlay)
  GlobeTooltip (hover info)
  GlobeLoading (suspense fallback)
```

### 5.3 Main Globe Component

```tsx
// components/globe/GlobeScene.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

interface GlobeSceneProps {
  stations: AQIStation[];
  selectedStation?: AQIStation | null;
  onStationSelect: (station: AQIStation) => void;
  onStationHover: (station: AQIStation | null) => void;
  autoRotate: boolean;
  initialPosition?: { lat: number; lng: number };
}

export function GlobeScene({
  stations,
  selectedStation,
  onStationSelect,
  onStationHover,
  autoRotate,
  initialPosition,
}: GlobeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]} // Responsive pixel ratio
    >
      <Suspense fallback={null}>
        {/* Ambient lighting */}
        <ambientLight intensity={0.6} />

        {/* Directional light for day side */}
        <directionalLight
          position={[5, 3, 5]}
          intensity={1.5}
          castShadow
        />

        {/* Fill light */}
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        {/* Background stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Main globe */}
        <Globe />

        {/* Atmosphere glow */}
        <Atmosphere />

        {/* Station markers */}
        <StationMarkers
          stations={stations}
          selectedId={selectedStation?.id}
          onSelect={onStationSelect}
          onHover={onStationHover}
        />

        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={4}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  );
}
```

### 5.4 Globe Sphere Mesh

```tsx
// components/globe/Globe.tsx
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useRef } from 'react';

export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load textures
  const [colorMap, bumpMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [
      '/textures/earth_daymap.jpg',      // 8K day texture
      '/textures/earth_bump.jpg',         // Topography bump map
      '/textures/earth_specular.jpg',     // Ocean reflections
      '/textures/earth_clouds.png',       // Cloud layer (optional)
    ]
  );

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.02}
          specularMap={specularMap}
          specular={new THREE.Color(0x333333)}
          shininess={5}
        />
      </mesh>

      {/* Cloud layer (slightly larger sphere) */}
      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
```

### 5.5 Atmosphere Glow Effect

```tsx
// components/globe/Atmosphere.tsx
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for atmosphere glow
const AtmosphereMaterial = shaderMaterial(
  { color: new THREE.Color(0x4da6ff) },
  // Vertex shader
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(color, 1.0) * intensity;
    }
  `
);

extend({ AtmosphereMaterial });

export function Atmosphere() {
  return (
    <mesh scale={1.15}>
      <sphereGeometry args={[1, 64, 64]} />
      <atmosphereMaterial
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
```

### 5.6 Station Markers

```tsx
// components/globe/StationMarkers.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getAQITheme } from '@/utils/aqi-colors';

interface StationMarkersProps {
  stations: AQIStation[];
  selectedId?: string;
  onSelect: (station: AQIStation) => void;
  onHover: (station: AQIStation | null) => void;
}

// Convert lat/lng to 3D position
function latLngToVector3(lat: number, lng: number, radius: number = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function StationMarkers({ stations, selectedId, onSelect, onHover }: StationMarkersProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Create instanced mesh for performance
  const markerGeometry = useMemo(() => new THREE.SphereGeometry(0.015, 16, 16), []);

  // Animation for pulsing effect
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const scale = 1 + Math.sin(clock.elapsedTime * 2 + i * 0.5) * 0.2;
          child.scale.setScalar(stations[i]?.id === selectedId ? scale * 1.5 : scale);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {stations.map((station) => {
        const position = latLngToVector3(station.lat, station.lng, 1.02);
        const theme = getAQITheme(station.aqi);

        return (
          <mesh
            key={station.id}
            position={position}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(station);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
              onHover(station);
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
              onHover(null);
            }}
          >
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color={theme.hex} />

            {/* Glow effect */}
            <mesh scale={2}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshBasicMaterial
                color={theme.hex}
                transparent
                opacity={0.3}
              />
            </mesh>
          </mesh>
        );
      })}
    </group>
  );
}
```

### 5.7 Globe Textures Required

| Texture | Resolution | Source |
|---------|------------|--------|
| `earth_daymap.jpg` | 8K (8192x4096) | NASA Blue Marble |
| `earth_nightmap.jpg` | 8K (optional) | NASA Night Lights |
| `earth_bump.jpg` | 4K | NASA SRTM |
| `earth_specular.jpg` | 4K | Custom (oceans white) |
| `earth_clouds.png` | 4K | NASA Cloud Cover |

**Free texture sources:**
- NASA Visible Earth: https://visibleearth.nasa.gov/
- Solar System Scope: https://www.solarsystemscope.com/textures/

### 5.8 Globe Interactions

| Interaction | Implementation |
|-------------|----------------|
| Rotate | OrbitControls `autoRotate` / drag |
| Zoom | OrbitControls `enableZoom` / scroll |
| Click marker | Raycaster on mesh click |
| Hover marker | Raycaster on pointer move |
| Fly to location | Camera animation with gsap/spring |
| Reset view | Camera position reset |

### 5.9 Performance Optimizations

```tsx
// 1. Use instanced meshes for markers (100+ stations)
<instancedMesh args={[geometry, material, stations.length]}>
  // Update instance matrices
</instancedMesh>

// 2. LOD (Level of Detail) for textures
const textureResolution = isMobile ? '2k' : '8k';

// 3. Lazy load globe
const GlobeScene = lazy(() => import('./GlobeScene'));

// 4. Reduce geometry complexity on mobile
const segments = isMobile ? 32 : 64;
<sphereGeometry args={[1, segments, segments]} />

// 5. Frame rate limiting
useFrame(({ clock }, delta) => {
  // Skip frames if needed
  if (delta > 0.1) return;
});
```

---

## 6. Animation Patterns

### 6.1 Framer Motion Setup

```tsx
// lib/motion.ts
import { Variants } from 'framer-motion';

// Page transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

// Stagger children
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Fade in
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Scale up
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Slide in from right
export const slideInRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
};

// Slide in from left
export const slideInLeft: Variants = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};
```

### 6.2 Animation Components

#### `AnimatedPage`
```tsx
// components/motion/AnimatedPage.tsx
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/lib/motion';

export function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
```

#### `AnimatedList`
```tsx
// components/motion/AnimatedList.tsx
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';

export function AnimatedList({ children }: { children: React.ReactNode }) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {React.Children.map(children, (child) => (
        <motion.li variants={staggerItem}>
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### 6.3 Loading States

#### `PulseLoader`
```tsx
// components/loaders/PulseLoader.tsx
export function PulseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full bg-primary animate-pulse",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}
```

#### `GlobeLoader`
```tsx
// components/loaders/GlobeLoader.tsx
import { motion } from 'framer-motion';

export function GlobeLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinning globe icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 text-primary"
      >
        <GlobeIcon className="w-full h-full" />
      </motion.div>

      {/* Loading text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-sm text-muted-foreground"
      >
        Loading globe...
      </motion.p>
    </div>
  );
}
```

### 6.4 Micro-interactions

#### Number Counter Animation
```tsx
// components/motion/AnimatedNumber.tsx
import { useSpring, animated } from '@react-spring/web';

export function AnimatedNumber({ value }: { value: number }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return (
    <animated.span>
      {number.to((n) => Math.floor(n))}
    </animated.span>
  );
}
```

#### Button Press Effect
```tsx
// Using Tailwind
className="active:scale-95 transition-transform duration-100"

// Using Framer Motion
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.02 }}
>
  Click me
</motion.button>
```

#### Card Hover Effect
```tsx
// Tailwind
className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1"

// Framer Motion
<motion.div
  whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  Card content
</motion.div>
```

### 6.5 Gauge Animation

```tsx
// components/AQIGauge.tsx - animated gauge
import { motion, useSpring, useTransform } from 'framer-motion';

export function AQIGauge({ value, maxValue = 500 }: AQIGaugeProps) {
  const spring = useSpring(0, { stiffness: 50, damping: 15 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const rotation = useTransform(spring, [0, maxValue], [0, 270]);

  return (
    <div className="relative w-40 h-40">
      {/* Background arc */}
      <svg className="absolute inset-0 w-full h-full">
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="330"
          strokeDashoffset="110"
          className="text-muted"
          transform="rotate(135 80 80)"
        />
      </svg>

      {/* Animated value arc */}
      <motion.svg className="absolute inset-0 w-full h-full">
        <motion.circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke={getAQITheme(value).hex}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="330"
          style={{
            strokeDashoffset: useTransform(
              spring,
              [0, maxValue],
              [330, 110]
            ),
          }}
          transform="rotate(135 80 80)"
        />
      </motion.svg>

      {/* Center value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span className="text-4xl font-bold tabular-nums">
          {useTransform(spring, (v) => Math.round(v))}
        </motion.span>
      </div>
    </div>
  );
}
```

### 6.6 Transition Timing Guidelines

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro (hover, press) | 100-150ms | ease-out |
| Small (fade, slide) | 200-300ms | ease-in-out |
| Medium (page transition) | 300-400ms | ease-in-out |
| Large (modal, drawer) | 400-500ms | ease-out |
| Complex (globe camera) | 800-1200ms | ease-in-out |

---

## 7. Accessibility Requirements

### 7.1 ARIA Attributes

#### Search Component
```tsx
<div role="search">
  <label htmlFor="city-search" className="sr-only">
    Search for a city
  </label>
  <input
    id="city-search"
    type="search"
    role="combobox"
    aria-expanded={isOpen}
    aria-controls="search-results"
    aria-activedescendant={highlightedId}
    aria-autocomplete="list"
    aria-label="Search cities"
  />
  <ul
    id="search-results"
    role="listbox"
    aria-label="City suggestions"
  >
    {results.map((city) => (
      <li
        key={city.id}
        id={`city-${city.id}`}
        role="option"
        aria-selected={city.id === selectedId}
      >
        {city.name}
      </li>
    ))}
  </ul>
</div>
```

#### AQI Gauge
```tsx
<div
  role="meter"
  aria-label={`Air Quality Index: ${value}`}
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={500}
  aria-valuetext={`${value} - ${getAQITheme(value).label}`}
>
  {/* Visual gauge */}
</div>
```

#### Globe Container
```tsx
<div
  role="application"
  aria-label="Interactive 3D globe showing air quality stations"
  aria-describedby="globe-instructions"
>
  <p id="globe-instructions" className="sr-only">
    Use mouse or touch to rotate the globe. Click on markers to view station details.
    Press Tab to navigate between controls.
  </p>
  {/* Globe canvas */}
</div>
```

#### Alert Component
```tsx
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
  <strong>Air Quality Alert:</strong> {message}
</div>
```

### 7.2 Keyboard Navigation

#### Focus Management
```tsx
// components/ui/focus-trap.tsx
import { FocusTrap } from '@headlessui/react';

// Usage in modals/drawers
<FocusTrap>
  <Dialog>{/* content */}</Dialog>
</FocusTrap>
```

#### Search Keyboard Controls
| Key | Action |
|-----|--------|
| `ArrowDown` | Move to next suggestion |
| `ArrowUp` | Move to previous suggestion |
| `Enter` | Select highlighted suggestion |
| `Escape` | Close dropdown |
| `Tab` | Move focus out of search |

```tsx
function handleKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
      break;
    case 'ArrowUp':
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
      break;
    case 'Enter':
      e.preventDefault();
      if (results[highlightedIndex]) {
        onSelect(results[highlightedIndex]);
      }
      break;
    case 'Escape':
      e.preventDefault();
      setIsOpen(false);
      break;
  }
}
```

#### Globe Keyboard Controls
| Key | Action |
|-----|--------|
| `ArrowLeft/Right` | Rotate horizontally |
| `ArrowUp/Down` | Rotate vertically |
| `+/-` | Zoom in/out |
| `Home` | Reset view |
| `Tab` | Focus next marker |
| `Enter/Space` | Select focused marker |

### 7.3 Color Contrast Requirements

Following WCAG 2.1 AA standards:

| Element | Minimum Contrast |
|---------|------------------|
| Normal text | 4.5:1 |
| Large text (18pt+) | 3:1 |
| UI components | 3:1 |
| Focus indicators | 3:1 |

#### AQI Colors with Accessible Text

| AQI Category | Background | Text Color | Contrast |
|--------------|------------|------------|----------|
| Good (emerald-500) | #10B981 | white | 4.5:1 |
| Moderate (yellow-400) | #FACC15 | #422006 (yellow-900) | 7.5:1 |
| Unhealthy-Sensitive (orange-500) | #F97316 | white | 4.5:1 |
| Unhealthy (red-500) | #EF4444 | white | 4.6:1 |
| Very Unhealthy (purple-600) | #9333EA | white | 6.2:1 |
| Hazardous (rose-900) | #881337 | white | 12:1 |

### 7.4 Screen Reader Support

#### Live Regions
```tsx
// Announce AQI changes
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {`Air quality in ${cityName} is now ${aqi}, ${category}`}
</div>

// Announce loading states
<div aria-live="assertive" className="sr-only">
  {isLoading ? 'Loading air quality data...' : 'Data loaded'}
</div>
```

#### Descriptive Labels
```tsx
// Bad
<button><StarIcon /></button>

// Good
<button aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
  <StarIcon aria-hidden="true" />
</button>
```

#### Skip Links
```tsx
// At the top of the page
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
>
  Skip to main content
</a>
```

### 7.5 Motion & Reduced Motion

```tsx
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Framer Motion
<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
>

// CSS approach
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Tailwind utility
className="motion-safe:animate-pulse motion-reduce:animate-none"
```

### 7.6 Form Accessibility

```tsx
// Error states
<div>
  <label htmlFor="email" className={cn(error && "text-destructive")}>
    Email
  </label>
  <input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
    className={cn(error && "border-destructive")}
  />
  {error && (
    <p id="email-error" role="alert" className="text-sm text-destructive mt-1">
      {error}
    </p>
  )}
</div>

// Required fields
<input
  required
  aria-required="true"
/>
```

### 7.7 Focus Styles

```css
/* Global focus styles */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Tailwind utility classes */
.focus-ring {
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
}
```

```tsx
// Component example
<button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
  Click me
</button>
```

---

## Appendix A: Complete Type Definitions

```tsx
// types/index.ts

export interface City {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lng: number;
  stationId?: string;
}

export interface AQIStation {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  dominantPollutant: string;
  lastUpdated: Date;
}

export interface AQIData {
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
  pollutants: Pollutant[];
  lastUpdated: Date;
  station: {
    name: string;
    lat: number;
    lng: number;
  };
}

export interface Pollutant {
  name: PollutantType;
  value: number;
  unit: string;
  aqi?: number;
}

export type PollutantType = 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co';

export type AQICategory =
  | 'good'
  | 'moderate'
  | 'unhealthy-sensitive'
  | 'unhealthy'
  | 'very-unhealthy'
  | 'hazardous';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  condition: string;
  icon: string;
}

export interface TrendDataPoint {
  timestamp: Date;
  aqi: number;
  pollutants?: Record<PollutantType, number>;
}

export interface ForecastDataPoint {
  date: Date;
  avgAqi: number;
  minAqi: number;
  maxAqi: number;
  dominantPollutant: PollutantType;
}

export interface FavoriteCity extends City {
  addedAt: Date;
  currentAqi?: number;
  lastUpdated?: Date;
}

export interface AlertThreshold {
  id: string;
  cityId: string;
  threshold: number;
  enabled: boolean;
  createdAt: Date;
}
```

---

## Appendix B: Tailwind Config Customizations

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AQI-specific colors
        aqi: {
          good: "#10B981",
          moderate: "#FACC15",
          "unhealthy-sensitive": "#F97316",
          unhealthy: "#EF4444",
          "very-unhealthy": "#9333EA",
          hazardous: "#881337",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-gentle": "bounce 2s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 20px rgba(var(--primary), 0.3)",
        "glow-lg": "0 0 40px rgba(var(--primary), 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

---

## Appendix C: Component File Structure

```
src/
  components/
    ui/                      # shadcn base components
      button.tsx
      card.tsx
      input.tsx
      badge.tsx
      ...

    layout/                  # Layout components
      AppShell.tsx
      Header.tsx
      Sidebar.tsx
      Footer.tsx

    globe/                   # 3D Globe components
      GlobeContainer.tsx
      GlobeScene.tsx
      Globe.tsx
      Atmosphere.tsx
      StationMarkers.tsx
      GlobeControls.tsx
      GlobeTooltip.tsx
      GlobeLoader.tsx

    search/                  # Search components
      CitySearch.tsx
      SearchDropdown.tsx
      SearchItem.tsx

    aqi/                     # AQI display components
      AQIGauge.tsx
      AQICard.tsx
      AQIBadge.tsx
      AQIScale.tsx
      AQIAlert.tsx

    pollutants/              # Pollutant components
      PollutantBreakdown.tsx
      PollutantCard.tsx
      PollutantChart.tsx

    weather/                 # Weather components
      WeatherWidget.tsx
      WeatherIcon.tsx

    charts/                  # Chart components
      TrendChart.tsx
      ForecastChart.tsx
      ComparisonChart.tsx

    comparison/              # Comparison components
      ComparisonView.tsx
      CityComparisonCard.tsx

    favorites/               # Favorites components
      FavoritesList.tsx
      FavoriteItem.tsx
      FavoriteButton.tsx

    theme/                   # Theme components
      ThemeToggle.tsx
      ThemeProvider.tsx

    motion/                  # Animation components
      AnimatedPage.tsx
      AnimatedList.tsx
      AnimatedNumber.tsx

    feedback/                # Feedback/state components
      Skeleton.tsx
      EmptyState.tsx
      ErrorState.tsx
      LoadingSpinner.tsx
```

---

*Document generated for AirWatch - Air Quality Monitoring App*
*Version 1.0 | UI Component Architecture Report*
