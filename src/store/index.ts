import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, FavoriteCity } from '../types'

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      favorites: [],
      selectedCity: null,
      compareList: [],

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      addFavorite: (city: FavoriteCity) =>
        set((state) => ({
          favorites: state.favorites.some((f) => f.uid === city.uid)
            ? state.favorites
            : [...state.favorites, city],
        })),

      removeFavorite: (uid: number) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.uid !== uid),
        })),

      setSelectedCity: (uid: number | null) =>
        set({ selectedCity: uid }),

      addToCompare: (uid: number) =>
        set((state) => ({
          compareList: state.compareList.includes(uid)
            ? state.compareList
            : state.compareList.length < 3
            ? [...state.compareList, uid]
            : state.compareList,
        })),

      removeFromCompare: (uid: number) =>
        set((state) => ({
          compareList: state.compareList.filter((id) => id !== uid),
        })),

      clearCompare: () =>
        set({ compareList: [] }),
    }),
    {
      name: 'airwatch-storage',
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
      }),
    }
  )
)
