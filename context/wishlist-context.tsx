"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { getUserWishlists, type Wishlist, removeRouteFromWishlist } from "@/data/users"

interface WishlistContextType {
  wishlists: Wishlist[]
  isInWishlist: (routeId: number) => boolean
  getWishlistsForRoute: (routeId: number) => Wishlist[]
  updateWishlists: () => void
  removeFromWishlist: (wishlistId: number, routeId: number) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const { isAuthenticated, user } = useAuth()

  // Load wishlists from user data when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlists()
    } else {
      setWishlists([])
    }
  }, [isAuthenticated, user])

  // Function to load wishlists from user data
  const loadWishlists = () => {
    if (isAuthenticated && user) {
      const userWishlists = getUserWishlists(user.nickname)
      setWishlists(userWishlists)
    }
  }

  // Function to update wishlists (can be called from outside)
  const updateWishlists = () => {
    loadWishlists()
  }

  // Function to remove a route from a wishlist
  const removeFromWishlist = (wishlistId: number, routeId: number) => {
    if (!isAuthenticated || !user) return

    // Remove from data
    const success = removeRouteFromWishlist(user.nickname, wishlistId, routeId)

    if (success) {
      // Update local state
      setWishlists((prevWishlists) =>
        prevWishlists.map((wishlist) => {
          if (wishlist.id === wishlistId) {
            return {
              ...wishlist,
              routes: wishlist.routes.filter((id) => id !== routeId),
            }
          }
          return wishlist
        }),
      )
    }
  }

  // Check if a route is in any of the current user's wishlists
  const isInWishlist = (routeId: number): boolean => {
    if (!isAuthenticated || !user || wishlists.length === 0) {
      return false
    }

    return wishlists.some((wishlist) => wishlist.routes.includes(routeId))
  }

  // Get all wishlists that contain a specific route
  const getWishlistsForRoute = (routeId: number): Wishlist[] => {
    if (!isAuthenticated || !user || wishlists.length === 0) {
      return []
    }

    return wishlists.filter((wishlist) => wishlist.routes.includes(routeId))
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        isInWishlist,
        getWishlistsForRoute,
        updateWishlists,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
