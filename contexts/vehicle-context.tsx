"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Vehicle {
  id: number
  slug: string
  name: string
  brand_name: string
  price: number
  year: number
  mileage: number
  fuel_type: string
  transmission: string
  primary_image: string
  category_name?: string
}

interface VehicleContextType {
  favorites: Vehicle[]
  recentlyViewed: Vehicle[]
  compareList: Vehicle[]
  addFavorite: (vehicle: Vehicle) => void
  removeFavorite: (vehicleId: number) => void
  isFavorite: (vehicleId: number) => boolean
  addToRecentlyViewed: (vehicle: Vehicle) => void
  addToCompare: (vehicle: Vehicle) => void
  removeFromCompare: (vehicleId: number) => void
  isInCompare: (vehicleId: number) => boolean
  clearCompare: () => void
  favoritesCount: number
  compareCount: number
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

const MAX_COMPARE = 3
const MAX_RECENTLY_VIEWED = 10

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Vehicle[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Vehicle[]>([])
  const [compareList, setCompareList] = useState<Vehicle[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("vehicle-favorites")
    const storedRecent = localStorage.getItem("vehicle-recently-viewed")
    const storedCompare = localStorage.getItem("vehicle-compare")

    if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
    if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent))
    if (storedCompare) setCompareList(JSON.parse(storedCompare))
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vehicle-favorites", JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vehicle-recently-viewed", JSON.stringify(recentlyViewed))
    }
  }, [recentlyViewed, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vehicle-compare", JSON.stringify(compareList))
    }
  }, [compareList, isLoaded])

  const addFavorite = (vehicle: Vehicle) => {
    setFavorites((prev) => {
      if (prev.some((v) => v.id === vehicle.id)) return prev
      return [vehicle, ...prev]
    })
  }

  const removeFavorite = (vehicleId: number) => {
    setFavorites((prev) => prev.filter((v) => v.id !== vehicleId))
  }

  const isFavorite = (vehicleId: number) => {
    return favorites.some((v) => v.id === vehicleId)
  }

  const addToRecentlyViewed = (vehicle: Vehicle) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((v) => v.id !== vehicle.id)
      return [vehicle, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
    })
  }

  const addToCompare = (vehicle: Vehicle) => {
    setCompareList((prev) => {
      if (prev.length >= MAX_COMPARE) return prev
      if (prev.some((v) => v.id === vehicle.id)) return prev
      return [...prev, vehicle]
    })
  }

  const removeFromCompare = (vehicleId: number) => {
    setCompareList((prev) => prev.filter((v) => v.id !== vehicleId))
  }

  const isInCompare = (vehicleId: number) => {
    return compareList.some((v) => v.id === vehicleId)
  }

  const clearCompare = () => {
    setCompareList([])
  }

  return (
    <VehicleContext.Provider
      value={{
        favorites,
        recentlyViewed,
        compareList,
        addFavorite,
        removeFavorite,
        isFavorite,
        addToRecentlyViewed,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        favoritesCount: favorites.length,
        compareCount: compareList.length,
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicle() {
  const context = useContext(VehicleContext)
  if (context === undefined) {
    throw new Error("useVehicle must be used within a VehicleProvider")
  }
  return context
}
