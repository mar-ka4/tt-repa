"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Camera,
  Sparkles,
  Leaf,
  Users,
  Utensils,
  Waves,
  Landmark,
  Palette,
  Music,
  ShoppingBag,
  Mountain,
  Footprints,
  Caravan,
  MountainIcon as Hiking,
  List,
  Building,
  MapPin,
  Star,
  Map,
} from "lucide-react"
import type { Route } from "@/types/route"
import WishlistModal from "./wishlist-modal"
import RemoveFromWishlistDialog from "./remove-from-wishlist-dialog"
import { useWishlist } from "@/context/wishlist-context"
import { useAuth } from "@/context/auth-context"

interface RouteCardProps {
  route: Route
  inWishlistView?: boolean
  onHeartClick?: (e: React.MouseEvent) => void
  isPurchased?: boolean
  width?: number
}

export default function RouteCard({
  route,
  inWishlistView = false,
  onHeartClick,
  isPurchased = false,
  width,
}: RouteCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { isInWishlist, getWishlistsForRoute } = useWishlist()

  const [isInAnyWishlist, setIsInAnyWishlist] = useState(false)
  const [routeWishlists, setRouteWishlists] = useState([])

  useEffect(() => {
    try {
      if (isAuthenticated) {
        const inWishlist = isInWishlist(route.id) // Использование route.id
        setIsInAnyWishlist(inWishlist)

        if (inWishlist) {
          setRouteWishlists(getWishlistsForRoute(route.id)) // Использование route.id
        }
      } else {
        setIsInAnyWishlist(false)
        setRouteWishlists([])
      }
    } catch (error) {
      console.warn("Wishlist context not available:", error)
    }
  }, [isAuthenticated, isInWishlist, getWishlistsForRoute, route.id]) // Зависимость от route.id

  // Handle adding to wishlist
  const handleAddToWishlist = () => {
    setIsInAnyWishlist(true)
    // Update the route wishlists
    setRouteWishlists(getWishlistsForRoute(route.id)) // Использование route.id
  }

  // Handle removing from wishlist
  const handleRemoveFromWishlist = () => {
    setIsInAnyWishlist(false)
    setRouteWishlists([])
  }

  // Handle heart icon click
  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlistView && onHeartClick) {
      onHeartClick(e)
      return
    }

    if (isInAnyWishlist) {
      // If already in wishlist, show remove dialog
      setRemoveDialogOpen(true)
    } else {
      // If not in wishlist, show add dialog
      setWishlistModalOpen(true)
    }
  }

  const nextImage = () => {
    if (route.gallery && route.gallery.length > 0) {
      setCurrentImage((prev) => (prev + 1) % route.gallery.length)
    }
  }

  const prevImage = () => {
    if (route.gallery && route.gallery.length > 0) {
      setCurrentImage((prev) => (prev - 1 + route.gallery.length) % route.gallery.length)
    }
  }

  // Handle image error
  const handleImageError = () => {
    setImageError(true)
  }

  // Truncate name if too long
  const truncateName = (name: string) => {
    if (!name) return ""
    return name.length > 40 ? name.substring(0, 40) + "..." : name
  }

  // Get icon based on route type
  const getTypeIcon = () => {
    const category = route.categoryDisplay || ""
    // Handle "Photo Tour" specifically
    if (category === "Photo Tour") {
      return <Camera size={16} />
    }
    switch (category) {
      case "Romantic":
        return <Sparkles size={16} />
      case "Nature":
        return <Leaf size={16} />
      case "Family":
        return <Users size={16} />
      case "Gastronomy":
      case "Food Tour":
        return <Utensils size={16} />
      case "PhotoSpots": // Existing case for PhotoSpots
        return <Camera size={16} />
      case "Coastal":
        return <Waves size={16} />
      case "History":
        return <Landmark size={16} />
      case "Art":
        return <Palette size={16} />
      case "Music":
        return <Music size={16} />
      case "Shop":
        return <ShoppingBag size={16} />
      case "Adventure":
        return <Mountain size={16} />
      case "Culture":
        return <Building size={16} />
      default:
        // Fallback to route.type if categoryDisplay doesn't match
        const routeType = route.type || ""
        if (routeType.includes("walking")) {
          return <Footprints size={16} />
        } else if (routeType.includes("camper")) {
          return <Caravan size={16} />
        } else if (routeType.includes("hiking")) {
          return <Hiking size={16} />
        } else if (routeType.includes("Photography")) {
          return <Camera size={16} />
        } else {
          return <List size={16} />
        }
    }
  }

  // Get icon for route type in stats block
  const getRouteTypeIconForStatBlock = () => {
    return route.routeType === "route" ? <Map size={16} /> : <List size={16} />
  }

  // Mock route.rating if it doesn't exist for demonstration
  const routeRating = route.rating !== undefined ? route.rating : 4.5 // Default rating for demonstration

  // Determine the link URL based on whether the route is purchased or a list
  const linkUrl = isPurchased
    ? `/purchased-route/${route.id}` // Использование route.id
    : route.routeType === "list"
      ? `/list/${route.id}` // Использование route.id
      : `/route/${route.id}` // Использование route.id

  // Apply width style if provided
  const cardStyle = width ? { width: `${width}px` } : {}

  return (
    <div
      className="bg-[#101012] rounded-xl overflow-hidden border border-[#222225] hover:border-[#333338] transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={cardStyle}
    >
      {/* Image Gallery */}
      <div className="relative h-48">
        {imageError || !route.gallery || route.gallery.length === 0 ? (
          // Gray placeholder with skeleton effect
          <div className="absolute inset-0 skeleton"></div>
        ) : (
          <div className="absolute inset-0">
            <Image
              src={`/${route.gallery[currentImage]}`}
              alt={`${route.name || "Route"} - изображение ${currentImage + 1}`}
              fill
              className="object-cover transition-opacity duration-100"
              onError={handleImageError}
            />
          </div>
        )}

        {/* Rating Label (new position) */}
        {routeRating && (
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={14} fill="currentColor" className="text-yellow-400" />
            <span>{routeRating.toFixed(1)}</span>
          </div>
        )}

        {/* Wishlist heart button - always visible, no background */}
        <button
          onClick={handleHeartClick}
          className="absolute top-2 right-2 z-10"
          aria-label={isInAnyWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={24} className="text-white" fill={isInAnyWishlist ? "#ff3b5c" : "none"} strokeWidth={1.5} />
        </button>

        {/* Navigation Buttons - show only if there's more than one image and no error */}
        {route.gallery && route.gallery.length > 1 && !imageError && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                prevImage()
              }}
              className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-1 transition-opacity duration-150 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                nextImage()
              }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-1 transition-opacity duration-150 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}

        {/* Current image indicator - show only if no error */}
        {route.gallery && route.gallery.length > 1 && !imageError && (
          <div
            className={`absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 transition-opacity duration-150 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {route.gallery.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
                  currentImage === index ? "bg-white scale-110" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Route Details - wrap only this part in Link */}
      <Link href={linkUrl}>
        <div className="p-2.5 space-y-3">
          {/* Route Title and Location */}
          <div>
            <h3 className="text-white font-normal text-base truncate">{truncateName(route.name || "")}</h3>
            <p className="text-gray-400 text-sm">{route.location || ""}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 border border-[#222225] rounded-lg px-3 py-1.5">
              {getTypeIcon()}
              {/* Conditional display for "Photo Tour" text */}
              <span className="text-sm">
                {route.categoryDisplay === "Photo Tour" ? "Photo Spots" : route.categoryDisplay || ""}
              </span>
            </div>
            <div className="flex items-center gap-2 border border-[#222225] rounded-lg px-3 py-1.5">
              <Clock size={16} />
              <span className="text-sm">{route.duration || ""}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 border border-[#222225] rounded-lg px-3 py-1.5">
              <MapPin size={16} />
              <span className="text-sm">{route.points || 0} точек</span>
            </div>
            <div className="flex items-center gap-2 border border-[#222225] rounded-lg px-3 py-1.5">
              {getRouteTypeIconForStatBlock()}
              <span className="text-sm">{route.routeType === "route" ? "Route" : "List"}</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-2">
            <p className="text-lg font-medium">{route.price === 0 ? "Free" : `$${route.price?.toFixed(2)}`}</p>
          </div>
        </div>
      </Link>

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={wishlistModalOpen}
        onClose={() => setWishlistModalOpen(false)}
        routeId={route.id} // Использование route.id
        routeName={route.name || ""}
        onAddToWishlist={handleAddToWishlist}
      />

      {/* Remove from Wishlist Dialog */}
      <RemoveFromWishlistDialog
        isOpen={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        routeId={route.id} // Использование route.id
        routeName={route.name || ""}
        wishlists={routeWishlists}
        onRemoveSuccess={handleRemoveFromWishlist}
      />
    </div>
  )
}
