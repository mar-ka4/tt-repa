"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  MapIcon,
  MapPin,
  ChevronDown,
  ChevronUp,
  Camera,
  Ticket,
  Coffee,
  Clock,
  ExternalLink,
  CreditCard,
  AlertTriangle,
  Navigation,
  Map,
  Car,
  Bike,
  FootprintsIcon as Walk,
  ArrowUp,
  RefreshCw,
  Circle,
  X,
  Settings,
  Share,
  Layers,
  LocateFixed,
  Star,
  MessageSquare,
} from "lucide-react"
import { routes } from "@/data/routes"
import { getUserByNickname } from "@/data/users"
import { Switch } from "@/components/ui/switch"

// Define different types of info blocks
type InfoBlockType = "photo" | "ticket" | "tip" | "time" | "link"

interface InfoBlock {
  type: InfoBlockType
  title: string
  content: string
  link?: string
  location?: {
    lat: number
    lng: number
    description: string
  }
  subBlocks?: {
    title: string
    description: string
    price?: string
    link?: string
  }[]
}

// Define a type for Mapbox step instructions
interface MapboxStep {
  distance: number
  duration: number
  geometry: {
    coordinates: [number, number][]
    type: string
  }
  maneuver: {
    bearing_after: number
    bearing_before: number
    location: [number, number]
    type: string
    instruction: string
    modifier?: string
  }
  name: string
  mode: string
  driving_side: string
  weight: number
}

// Mapbox imports
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoidjBkZXYiLCJhIjoiY20yNWJqZGNzMDFnZzJrcHo4aWVhZGNwZCJ9.VJJBmkR8R_PJhKJOGJhJhQ"

declare global {
  interface Window {
    mapboxgl: any
  }
}

// Add constants
const SWIPE_THRESHOLD_PX = 30
const NAVIGATION_COLLAPSED_HEIGHT_PX = 90
const INITIAL_CAROUSEL_FULL_HEIGHT_PX = 400

// Normalize asset paths to always start with '/'
const normalizeImage = (path?: string) => {
  if (!path) return "/placeholder.svg?height=300&width=400"
  return path.startsWith("/") ? path : `/${path}`
}

// Collect landmark images: prefer gallery array, fallback to single image
const getLandmarkImages = (lm: any): string[] => {
  const gal = Array.isArray(lm?.gallery) ? (lm.gallery as string[]) : null
  if (gal && gal.length > 0) return gal
  if (lm?.image) return [lm.image as string]
  return []
}

// Simple slider for landmark gallery
function LandmarkGallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0)

  if (!images || images.length === 0) {
    return <Image src={normalizeImage(undefined) || "/placeholder.svg"} alt={alt} fill className="object-cover" />
  }

  if (images.length === 1) {
    return <Image src={normalizeImage(images[0]) || "/placeholder.svg"} alt={alt} fill className="object-cover" />
  }

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIdx((i) => (i - 1 + images.length) % images.length)
  }
  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIdx((i) => (i + 1) % images.length)
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative min-w-full h-full">
            <Image
              src={normalizeImage(src) || "/placeholder.svg"}
              alt={`${alt} ${i + 1}/${images.length}`}
              fill
              className="object-cover"
              priority={i === idx}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        type="button"
        aria-label="Previous image"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to image ${i + 1}`}
            onClick={(e) => {
              e.stopPropagation()
              setIdx(i)
            }}
            className={`w-2.5 h-2.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function RouteNavigationPage({ params }: { params: { id: string } }) {
  const route = useMemo(() => routes.find((r) => r.id === params.id) || routes[0], [params.id])

  // Get route author data
  const routeAuthor = getUserByNickname(route.author)

  const router = useRouter()

  const [activeLandmark, setActiveLandmark] = useState<number | null>(null)
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard")
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [expandedTexts, setExpandedTexts] = useState<Record<number, boolean>>({})
  const [expandedInfoBlocks, setExpandedInfoBlocks] = useState<Record<number, boolean>>({})
  const [externalLinkWarning, setExternalLinkWarning] = useState<{ show: boolean; url: string }>({
    show: false,
    url: "",
  })

  // Bottom sheet and navigation states
  type BottomSheetPosition = "collapsed" | "middle" | "expanded" | "navigationCollapsed"
  const [bottomSheetPosition, setBottomSheetPosition] = useState<BottomSheetPosition>("collapsed")
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStartY, setDragStartY] = useState<number>(0)
  const [dragStartPosition, setDragStartPosition] = useState<BottomSheetPosition>("collapsed")
  const [tempDragOffset, setTempDragOffset] = useState<number>(0)

  // Mapbox state
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [navigationMap, setNavigationMap] = useState<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const landmarkRefs = useRef<(HTMLDivElement | null)[]>([])

  // User location and navigation
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [userHeading, setUserHeading] = useState<number | null>(null)
  const [geolocationError, setGeolocationError] = useState<string | null>(null)
  const [currentDirections, setCurrentDirections] = useState<MapboxStep[] | null>(null)
  const [directionsLoading, setDirectionsLoading] = useState<boolean>(false)

  // For route navigation - always target the last landmark in the route
  const [selectedLandmarkForNavigation, setSelectedLandmarkForNavigation] = useState<number | null>(
    route.landmarks && route.landmarks.length > 0 ? route.landmarks.length - 1 : null,
  )
  const [showAllSteps, setShowAllSteps] = useState<boolean>(false)
  const [transportMode, setTransportMode] = useState<"walking" | "cycling" | "driving" | null>(null)
  const [transportModeSelectedInBottomSheet, setTransportModeSelectedInBottomSheet] = useState<boolean>(false)

  // Navigation phases
  const [navigationPhase, setNavigationPhase] = useState<"initialCarousel" | "landmarkSelection" | "navigationActive">(
    "initialCarousel",
  )

  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(0)
  const isCarouselScrollingRef = useRef(false)
  const scrollRafRef = useRef<number | null>(null)
  const scrollDebounceRef = useRef<number | null>(null)

  const [showWeeklyHours, setShowWeeklyHours] = useState<boolean>(false)
  const [isLightMode, setIsLightMode] = useState(false)
  const [isTrackingUserLocation, setIsTrackingUserLocation] = useState<boolean>(true)

  const weeklySchedule = [
    "Monday: 10:00 - 20:00",
    "Tuesday: 10:00 - 20:00",
    "Wednesday: 10:00 - 20:00",
    "Thursday: 10:00 - 20:00",
    "Friday: 10:00 - 22:00",
    "Saturday: 11:00 - 22:00",
    "Sunday: 11:00 - 20:00",
  ]

  // Helper function to format duration
  const formatDuration = (totalSeconds: number) => {
    const totalMinutes = Math.round(totalSeconds / 60)
    if (totalMinutes < 60) {
      return `${totalMinutes} min`
    } else {
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return `${hours} h ${minutes} min`
    }
  }

  const getBottomSheetHeights = () => {
    if (typeof window === "undefined")
      return { collapsed: 120, middle: 500, expanded: 750, navigationCollapsed: NAVIGATION_COLLAPSED_HEIGHT_PX }
    const windowHeight = window.innerHeight
    return {
      collapsed: windowHeight * 0.17,
      middle: windowHeight * 0.64,
      expanded: windowHeight * 0.95,
      navigationCollapsed: NAVIGATION_COLLAPSED_HEIGHT_PX,
    }
  }

  // Helper function to fit map to all landmarks + route
  const fitMapToBounds = useCallback(
    (mapInstance: any, landmarks: any[], currentPhase: string, carouselHeight: number) => {
      const landmarksWithCoords = landmarks.filter((landmark) => landmark.coordinates)
      if (landmarksWithCoords.length > 1) {
        const bounds = new window.mapboxgl.LngLatBounds()
        landmarksWithCoords.forEach((landmark) => {
          if (landmark.coordinates) {
            bounds.extend(landmark.coordinates)
          }
        })
        const padding = {
          top: 50,
          bottom: currentPhase === "initialCarousel" ? carouselHeight + 20 : 50,
          left: 50,
          right: 50,
        }
        mapInstance.fitBounds(bounds, {
          padding: padding,
          maxZoom: 15,
          duration: 1000,
        })
      } else if (landmarksWithCoords.length === 1) {
        const padding = {
          top: 0,
          bottom: currentPhase === "initialCarousel" ? carouselHeight + 20 : 0,
          left: 0,
          right: 0,
        }
        mapInstance.flyTo({
          center: landmarksWithCoords[0].coordinates,
          zoom: 15,
          duration: 1000,
          padding: padding,
        })
      } else {
        mapInstance.flyTo({
          center: [13.385575, 52.523445],
          zoom: 13,
          duration: 1000,
          padding: { top: 0, bottom: currentPhase === "initialCarousel" ? carouselHeight + 20 : 0, left: 0, right: 0 },
        })
      }
    },
    [],
  )

  // Handle click on landmark card
  const handleLandmarkClick = (index: number) => {
    const landmark = route.landmarks[index]
    if (!landmark || !landmark.coordinates) {
      console.warn("Landmark has no coordinates:", landmark?.name)
      return
    }

    setActiveLandmark(index)
    // For route navigation, we always target the final destination (last landmark)
    setSelectedLandmarkForNavigation(route.landmarks.length - 1)
    setTransportModeSelectedInBottomSheet(false)
    setCurrentDirections(null)

    setNavigationPhase("landmarkSelection")
    setBottomSheetPosition("middle")

    if (navigationMap) {
      const heights = getBottomSheetHeights()
      navigationMap.flyTo({
        center: landmark.coordinates,
        duration: 1000,
        padding: { bottom: heights.middle, top: 0, left: 0, right: 0 },
      })
    }

    if (landmarkRefs.current[index]) {
      landmarkRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  // Function to draw the connected route path
  const drawConnectedRoute = useCallback(async (mapInstance: any, routeWaypoints: [number, number][], mode: string) => {
    if (!mapInstance || !window.mapboxgl || routeWaypoints.length < 2) {
      console.warn("Cannot draw connected route: insufficient waypoints or map not loaded")
      return []
    }

    try {
      const coordsString = routeWaypoints.map((coord) => coord.join(",")).join(";")
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coordsString}?geometries=geojson&steps=true&access_token=${window.mapboxgl.accessToken}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry
        const routeSteps = data.routes[0].legs.flatMap((leg: any) => leg.steps)

        // Remove existing route if it exists
        if (mapInstance.getSource("connected-route")) {
          if (mapInstance.getLayer("connected-route")) {
            mapInstance.removeLayer("connected-route")
          }
          mapInstance.removeSource("connected-route")
        }

        // Add connected route
        mapInstance.addSource("connected-route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: routeGeometry,
          },
        })

        mapInstance.addLayer({
          id: "connected-route",
          type: "line",
          source: "connected-route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#6366f1", // Purple color for the main route
            "line-width": 4,
          },
        })

        return routeSteps
      } else {
        console.error("No routes found:", data)
        return []
      }
    } catch (error) {
      console.error("Error drawing connected route:", error)
      return []
    }
  }, [])

  // Function to remove navigation route from map
  const removeNavigationRouteFromMap = useCallback(() => {
    if (navigationMap) {
      try {
        if (navigationMap.getSource("navigation-route")) {
          if (navigationMap.getLayer("navigation-route")) {
            navigationMap.removeLayer("navigation-route")
          }
          navigationMap.removeSource("navigation-route")
        }
        if (navigationMap.getSource("connected-route")) {
          if (navigationMap.getLayer("connected-route")) {
            navigationMap.removeLayer("connected-route")
          }
          navigationMap.removeSource("connected-route")
        }
      } catch (error) {
        console.warn("Error removing navigation routes:", error)
      }
      fitMapToBounds(navigationMap, route.landmarks, navigationPhase, INITIAL_CAROUSEL_FULL_HEIGHT_PX)
    }
  }, [navigationMap, route.landmarks, fitMapToBounds, navigationPhase])

  // Handle start navigation
  const handleStartNavigation = async () => {
    if (selectedLandmarkForNavigation === null) {
      setGeolocationError("Please select a landmark to start navigation.")
      return
    }

    const selectedLandmark = route.landmarks[selectedLandmarkForNavigation]
    if (!selectedLandmark || !selectedLandmark.coordinates) {
      setGeolocationError("Selected landmark has no coordinates for navigation.")
      return
    }

    if (!userLocation) {
      setGeolocationError("Waiting for your location. Please enable location services.")
      return
    }

    await executeNavigation(selectedLandmarkForNavigation, transportMode)
    setNavigationPhase("navigationActive")
    setIsTrackingUserLocation(true)
  }

  // Handle stop navigation
  const handleStopNavigation = () => {
    setSelectedLandmarkForNavigation(route.landmarks.length - 1) // Reset to final destination
    setActiveLandmark(null)
    setTransportModeSelectedInBottomSheet(false)
    setCurrentDirections(null)
    setShowAllSteps(false)

    setNavigationPhase("initialCarousel")
    setBottomSheetPosition("collapsed")
    setIsTrackingUserLocation(false)

    removeNavigationRouteFromMap()
  }

  // Toggle functions
  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  const toggleMapType = () => {
    setMapType(mapType === "standard" ? "satellite" : "standard")
    if (navigationMap) {
      const newStyle =
        mapType === "standard" ? "mapbox://styles/mapbox/satellite-v9" : "mapbox://styles/mapbox/streets-v11"
      navigationMap.setStyle(newStyle)
    }
  }

  const toggleTextExpansion = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedTexts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const toggleInfoBlockExpansion = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedInfoBlocks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // External link handling
  const handleExternalLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    e.stopPropagation()
    setExternalLinkWarning({ show: true, url })
  }

  const closeExternalLinkWarning = () => {
    setExternalLinkWarning({ show: false, url: "" })
  }

  const proceedToExternalLink = () => {
    if (externalLinkWarning.url) {
      window.open(externalLinkWarning.url, "_blank", "noopener,noreferrer")
    }
    closeExternalLinkWarning()
  }

  const showLocationOnMap = (location: { lat: number; lng: number; description: string }, index: number) => {
    setActiveLandmark(index)
    if (navigationMap && location.lng && location.lat) {
      navigationMap.flyTo({
        center: [location.lng, location.lat],
        duration: 1000,
      })
    }
  }

  // Drag handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("button, a, input, select, textarea")) {
      return
    }

    setIsDragging(true)
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    setDragStartY(clientY)
    setDragStartPosition(bottomSheetPosition)
    setTempDragOffset(0)
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    const deltaY = dragStartY - clientY
    setTempDragOffset(deltaY)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const deltaY = tempDragOffset
    let newPosition: BottomSheetPosition = dragStartPosition

    if (navigationPhase === "navigationActive") {
      if (deltaY > SWIPE_THRESHOLD_PX) {
        newPosition = "expanded"
      } else if (deltaY < -SWIPE_THRESHOLD_PX) {
        newPosition = "navigationCollapsed"
      }
    } else if (navigationPhase === "landmarkSelection") {
      if (deltaY > SWIPE_THRESHOLD_PX) {
        if (dragStartPosition === "collapsed") newPosition = "middle"
        else if (dragStartPosition === "middle") newPosition = "expanded"
      } else if (deltaY < -SWIPE_THRESHOLD_PX) {
        if (dragStartPosition === "expanded") newPosition = "middle"
        else if (dragStartPosition === "middle") newPosition = "collapsed"
      }
    }

    setBottomSheetPosition(newPosition)
    setTempDragOffset(0)
  }

  // Add drag event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e)
      const handleMouseUp = () => handleDragEnd()
      const handleTouchMove = (e: TouchEvent) => handleDragMove(e)
      const handleTouchEnd = () => handleDragEnd()

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleDragEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleDragEnd)
      }
    }
  }, [isDragging, dragStartY, dragStartPosition, bottomSheetPosition, tempDragOffset, navigationPhase])

  // Generate info blocks between landmarks
  function getInfoBlockBetweenLandmarks(index: number) {
    if (index <= 0 || index >= route.landmarks.length) return null

    const infoBlocks: InfoBlock[] = [
      {
        type: "ticket",
        title: "Online Tickets",
        content: "Buy tickets in advance and save up to 15%. Various visit options available.",
        subBlocks: [
          {
            title: "Standard Ticket",
            description: "Entry to main exhibition without guide",
            price: "€12",
            link: "https://tickets.example.com/standard",
          },
          {
            title: "Extended Ticket",
            description: "Entry to all areas, including special exhibitions",
            price: "€18",
            link: "https://tickets.example.com/extended",
          },
          {
            title: "VIP Ticket",
            description: "Priority entry without queue and audio guide",
            price: "€25",
            link: "https://tickets.example.com/vip",
          },
        ],
      },
      {
        type: "photo",
        title: "Perfect Photo Spot",
        content: "50 meters to the right of the entrance there's an excellent viewpoint for panoramic shots.",
        location: {
          lat: 52.5163,
          lng: 13.3779,
          description: "Viewpoint",
        },
      },
      {
        type: "tip",
        title: "Local Tip",
        content: "Nearby there's a small cafe with excellent coffee and traditional pastries.",
        location: {
          lat: 52.5165,
          lng: 13.3782,
          description: "Berliner Cafe",
        },
      },
      {
        type: "time",
        title: "Best Time to Visit",
        content: "Come after 4:00 PM to avoid the main tourist crowds.",
      },
      {
        type: "link",
        title: "Audio Guide",
        content: "Download the free audio guide for this attraction.",
        link: "https://audioguide.example.com",
      },
    ]

    const blockIndex = index === 1 ? 0 : (route.id + index) % infoBlocks.length
    const infoBlock = infoBlocks[blockIndex]
    const isExpanded = expandedInfoBlocks[index] || false

    // Unified card styles (light/dark)
    const cardClasses = isLightMode
      ? "rounded-2xl border border-gray-200 bg-white text-black shadow-sm"
      : "rounded-2xl border border-[#27272f] bg-[#18181c] text-white shadow-sm"

    const subduedText = isLightMode ? "text-gray-600" : "text-gray-300"
    const subtleIcon = isLightMode ? "text-gray-500" : "text-gray-400"
    const chipBg = isLightMode
      ? "bg-gray-100 border border-gray-200 text-gray-700"
      : "bg-[#2a2a2a] border border-[#363646] text-gray-300"
    const sectionBg = isLightMode ? "bg-gray-50 border border-gray-200" : "bg-[#212124] border border-[#2a2a2a]"
    const ctaBg = isLightMode
      ? "bg-gray-100 hover:bg-gray-200 text-black"
      : "bg-[#2a2a2a] hover:bg-[#323240] text-white"

    // Icon mapping based on block type
    const getIcon = (type: InfoBlockType) => {
      switch (type) {
        case "photo":
          return <Camera size={18} className={subtleIcon} />
        case "ticket":
          return <Ticket size={18} className={subtleIcon} />
        case "tip":
          return <Coffee size={18} className={subtleIcon} />
        case "time":
          return <Clock size={18} className={subtleIcon} />
        case "link":
          return <ExternalLink size={18} className={subtleIcon} />
      }
    }

    // Original blocks
    const originalInfoBlock = (
      <div className={`mt-4 ${cardClasses}`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 mt-0.5`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isLightMode ? "bg-gray-100" : "bg-[#2a2a2a]"}`}
              >
                {getIcon(infoBlock.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-medium truncate">{infoBlock.title}</h4>
                <button
                  className={`p-1 rounded-full ${isLightMode ? "text-gray-600 hover:bg-gray-100" : "text-gray-300 hover:bg-[#2a2a2a]"}`}
                  onClick={(e) => toggleInfoBlockExpansion(index, e)}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              {!isExpanded && <p className={`text-sm mt-1 line-clamp-2 ${subduedText}`}>{infoBlock.content}</p>}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4">
            <p className={`text-sm mb-3 ${subduedText}`}>{infoBlock.content}</p>

            {infoBlock.location && (
              <div className={`mb-3 rounded-xl p-3 ${sectionBg}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin size={16} className={subtleIcon} />
                    <p className={`text-sm truncate ${isLightMode ? "text-black" : "text-white"}`}>
                      {infoBlock.location.description}
                    </p>
                  </div>
                  <button
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${ctaBg}`}
                    onClick={() => showLocationOnMap(infoBlock.location!, index)}
                  >
                    <Map size={14} />
                    <span>On Map</span>
                  </button>
                </div>
              </div>
            )}

            {infoBlock.type === "ticket" && infoBlock.subBlocks && (
              <div className="space-y-2">
                {infoBlock.subBlocks.map((subBlock, subIndex) => (
                  <div key={subIndex} className={`rounded-xl p-3 ${sectionBg}`}>
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h5 className="text-sm font-medium truncate">{subBlock.title}</h5>
                        <p className={`text-sm mt-0.5 ${subduedText}`}>{subBlock.description}</p>
                        {subBlock.link && (
                          <button
                            className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#6366f1] hover:underline"
                            onClick={(e) => handleExternalLinkClick(e, subBlock.link || "")}
                          >
                            <CreditCard size={14} />
                            <span>Buy</span>
                          </button>
                        )}
                      </div>
                      {subBlock.price && (
                        <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${chipBg}`}>
                          {subBlock.price}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {infoBlock.type !== "ticket" && infoBlock.link && (
              <button
                className="inline-flex items-center gap-1.5 text-sm text-[#6366f1] hover:underline"
                onClick={(e) => handleExternalLinkClick(e, infoBlock.link || "")}
              >
                <ExternalLink size={14} />
                <span>Learn More</span>
              </button>
            )}
          </div>
        )}
      </div>
    )

    const ratingDemoBlock = (
      <div className={cardClasses}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${isLightMode ? "bg-gray-100" : "bg-[#2a2a2a]"}`}
            >
              <Star size={18} className="text-yellow-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold">4.7</span>
              <span className={subduedText}>/ 5 • 128 ratings</span>
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={16}
                className={i < 4 ? "text-yellow-400" : `${isLightMode ? "text-gray-300" : "text-gray-600"}`}
                {...(i < 4 ? { fill: "#f59e0b" } : {})}
              />
            ))}
          </div>
        </div>
      </div>
    )

    const reviewsDemoBlock = (
      <div className={cardClasses}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${isLightMode ? "bg-gray-100" : "bg-[#2a2a2a]"}`}
            >
              <MessageSquare size={18} className={subtleIcon} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Reviews</span>
              <span className={`${subduedText} text-sm`}>• demo</span>
            </div>
          </div>
          <div className={`mt-3 space-y-2 text-sm ${subduedText}`}>
            <p>{'"Great spot for a quick coffee and a photo." — Alex'}</p>
            <p>{'"The omelette is worth the detour." — Masha'}</p>
          </div>
        </div>
      </div>
    )

    // Container with separator and subtle border labeled "Доступно позже"
    return (
      <div className="mt-6">
        {/* Separator line to clearly divide from description */}
        <div className={`h-px ${isLightMode ? "bg-gray-200" : "bg-[#2a2a2a]"} mb-4`} />

        <div
          className={`rounded-2xl border ${isLightMode ? "border-gray-200 bg-white" : "border-[#27272f] bg-[#0c0c0e]"} p-4`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className={isLightMode ? "text-gray-600" : "text-gray-400"} />
            <span className={`text-sm font-medium ${isLightMode ? "text-black" : "text-white"}`}>
              Will be available later
            </span>
          </div>

          <div className="relative">
            {/* Blurred content underlay */}
            <div className="space-y-3 blur-sm opacity-90 pointer-events-none select-none" aria-hidden="true">
              {originalInfoBlock}
              {ratingDemoBlock}
              {reviewsDemoBlock}
              <LandmarkDetailsBlock landmarkIndex={activeLandmark} />
            </div>

            {/* Overlay label */}
            <div className="absolute inset-0 flex items-center justify-center z-10"></div>
          </div>
        </div>
      </div>
    )
  }

  // Load Mapbox
  useEffect(() => {
    const loadMapbox = () => {
      if (window.mapboxgl) {
        setMapboxLoaded(true)
        return
      }

      const cssLink = document.createElement("link")
      cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css"
      cssLink.rel = "stylesheet"
      document.head.appendChild(cssLink)

      const script = document.createElement("script")
      script.src = "https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.js"
      script.onload = () => {
        setMapboxLoaded(true)
      }
      script.onerror = () => {
        console.error("Failed to load Mapbox GL JS")
      }
      document.head.appendChild(script)
    }

    loadMapbox()
  }, [])

  // Function to draw route from user location to final destination (with all waypoints)
  const drawNavigationRoute = useCallback(
    async (mapInstance: any, startLngLat: [number, number], mode: string) => {
      if (!mapInstance || !window.mapboxgl || !startLngLat) {
        console.warn("Cannot draw route: map not loaded or coordinates missing.")
        setGeolocationError("Cannot draw route: missing coordinates or map not loaded.")
        return
      }

      console.log("Drawing full route from", startLngLat, "through all landmarks using", mode)
      setDirectionsLoading(true)
      setCurrentDirections(null)

      try {
        // Build waypoints: user location + all landmarks with coordinates
        const landmarksWithCoords = route.landmarks.filter((l) => l.coordinates)
        const allWaypoints = [startLngLat, ...landmarksWithCoords.map((l) => l.coordinates!)]

        const coordsString = allWaypoints.map((coord) => coord.join(",")).join(";")

        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coordsString}?geometries=geojson&steps=true&access_token=${window.mapboxgl.accessToken}`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Mapbox directions response:", data)

        if (data.routes && data.routes.length > 0) {
          const routeGeometry = data.routes[0].geometry
          const routeSteps = data.routes[0].legs.flatMap((leg: any) => leg.steps)

          // Remove existing route if it exists
          const sourceId = "navigation-route"
          const layerId = "navigation-route"

          if (mapInstance.getSource(sourceId)) {
            if (mapInstance.getLayer(layerId)) {
              mapInstance.removeLayer(layerId)
            }
            mapInstance.removeSource(sourceId)
          }

          // Add route source and layer
          mapInstance.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: routeGeometry,
            },
          })

          mapInstance.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#EF4444", // Red color for active navigation
              "line-width": 4,
            },
          })

          setCurrentDirections(routeSteps)
          console.log("Full route drawn successfully with", routeSteps.length, "steps")
        } else {
          console.error("No routes found in response:", data)
          setCurrentDirections([])
          setGeolocationError("No route found to the selected destination.")
        }
      } catch (error) {
        console.error("Error drawing navigation route:", error)
        setCurrentDirections([])
        setGeolocationError("Failed to get directions. Please try again.")
      } finally {
        setDirectionsLoading(false)
      }
    },
    [route.landmarks],
  )

  // Execute navigation
  const executeNavigation = async (targetLandmarkIndex: number, mode: "walking" | "cycling" | "driving") => {
    if (targetLandmarkIndex === null || !userLocation || !navigationMap) {
      console.error("Cannot execute navigation: missing data")
      return
    }

    const targetLandmark = route.landmarks[targetLandmarkIndex]
    if (!targetLandmark || !targetLandmark.coordinates) {
      console.error("Target landmark or its coordinates are missing.")
      setGeolocationError("Selected landmark has no coordinates for navigation.")
      return
    }

    console.log("Executing navigation through full route to:", targetLandmark.name, "using mode:", mode)

    // Draw the complete navigation route through all landmarks
    await drawNavigationRoute(navigationMap, userLocation, mode)

    setBottomSheetPosition("navigationCollapsed")
    setNavigationPhase("navigationActive")
    setTransportModeSelectedInBottomSheet(false)
    setIsTrackingUserLocation(true)

    // Center map on user's location after starting navigation
    if (navigationMap && userLocation) {
      navigationMap.flyTo({
        center: userLocation,
        zoom: 17,
        duration: 1000,
      })
    }
  }

  // Update active landmark marker
  useEffect(() => {
    if (!navigationMap) return

    try {
      const markers = document.querySelectorAll(".custom-marker")
      markers.forEach((marker) => {
        const element = marker as HTMLElement
        const index = Number.parseInt(element.getAttribute("data-landmark-index") || "0")

        const newOuterSquare = element.querySelector("div") as HTMLElement | null

        if (newOuterSquare) {
          const isActive = index === activeLandmark

          newOuterSquare.style.backgroundColor = isActive ? "#EF4444" : isLightMode ? "white" : "rgb(24, 24, 28)"
          newOuterSquare.style.borderColor = isActive ? "#EF4444" : isLightMode ? "white" : "rgb(39, 39, 47)"

          if (isActive) {
            element.style.zIndex = "10"
          } else {
            element.style.zIndex = "1"
          }
        }

        const existingHandler = element.onclick
        if (!existingHandler) {
          element.addEventListener("click", () => {
            handleLandmarkClick(index)
          })
        }
      })

      const activeLandmarkData = route.landmarks[activeLandmark || 0]
      if (activeLandmarkData?.coordinates && activeLandmark !== null) {
        const heights = getBottomSheetHeights()
        const mapPadding = { top: 0, bottom: 0, left: 0, right: 0 }

        if (navigationPhase === "initialCarousel") {
          mapPadding.bottom = INITIAL_CAROUSEL_FULL_HEIGHT_PX
        } else if (navigationPhase === "landmarkSelection") {
          mapPadding.bottom = heights.middle
        }

        navigationMap.flyTo({
          center: activeLandmarkData.coordinates,
          duration: 1000,
          padding: mapPadding,
        })
      }
    } catch (error) {
      console.warn("Error updating active landmark or map view:", error)
    }
  }, [activeLandmark, navigationMap, route.landmarks, navigationPhase, isLightMode])

  // Initialize navigation map
  useEffect(() => {
    if (!mapboxLoaded || !mapContainerRef.current || navigationMap) {
      return
    }

    let isMounted = true
    const initializeNavigationMap = async () => {
      try {
        if (!window.mapboxgl) {
          console.error("Mapbox GL JS not loaded")
          return
        }

        mapboxgl.accessToken = "pk.eyJ1IjoidjBkZXYiLCJhIjoiY20yNWJqZGNzMDFnZzJrcHo4aWVhZGNwZCJ9.VJJBmkR8R_PJhKJOGJhJhQ"

        if (!window.mapboxgl.accessToken) {
          console.error("Mapbox API key is missing!")
          return
        }

        const container = mapContainerRef.current
        if (!container || !isMounted) {
          return
        }

        container.innerHTML = ""

        // Calculate center from route landmarks with coordinates
        const landmarksWithCoords = route.landmarks.filter((landmark) => landmark.coordinates)
        let center: [number, number] = [13.385575, 52.523445]

        if (landmarksWithCoords.length > 0) {
          const avgLng =
            landmarksWithCoords.reduce((sum, landmark) => sum + landmark.coordinates![0], 0) /
            landmarksWithCoords.length
          const avgLat =
            landmarksWithCoords.reduce((sum, landmark) => sum + landmark.coordinates![1], 0) /
            landmarksWithCoords.length
          center = [avgLng, avgLat]
        }

        const mapInstance = new window.mapboxgl.Map({
          container: container,
          style: mapType === "satellite" ? "mapbox://styles/mapbox/satellite-v9" : "mapbox://styles/mapbox/streets-v11",
          center: center,
          zoom: 13,
          attributionControl: false,
        })

        mapInstance.on("load", async () => {
          if (!isMounted) {
            try {
              mapInstance.remove()
            } catch (e) {
              console.warn("Error removing map on unmount:", e)
            }
            return
          }
          console.log("Navigation map loaded successfully")
          setNavigationMap(mapInstance)

          try {
            // Add markers for all landmarks with coordinates
            landmarksWithCoords.forEach((landmark, index) => {
              if (landmark.coordinates && isMounted) {
                const markerElement = document.createElement("div")
                markerElement.className = "custom-marker"
                markerElement.style.cssText = `cursor: pointer;`

                const newOuterSquareElement = document.createElement("div")
                const isActive = index === activeLandmark
                const markerSize = "36px"

                newOuterSquareElement.style.cssText = `
                  width: ${markerSize};
                  height: ${markerSize};
                  background-color: ${isActive ? "#EF4444" : isLightMode ? "white" : "rgb(24, 24, 28)"};
                  border: 2px solid ${isActive ? "#EF4444" : isLightMode ? "white" : "rgb(39, 39, 47)"};
                  border-radius: 18px 18px 5px;
                  transform: rotate(45deg);
                  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                `

                markerElement.style.zIndex = isActive ? "10" : "1"

                const innerCircleElement = document.createElement("div")
                innerCircleElement.style.cssText = `
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  background-color: #ff8c00;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transform: rotate(-45deg);
                  color: white;
                `

                // Determine icon and color based on landmark category or route category
                let iconSvg = ""
                let innerCircleBgColor = ""

                const markerCategory = landmark.category || route.categoryDisplay

                switch (markerCategory) {
                  case "attraction":
                  case "City Tour":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-landmark text-white"><line x1="3" x2="21" y1="22" y2="22"></line><line x1="6" x2="6" y1="18" y2="11"></line><line x1="10" x2="10" y1="18" y2="11"></line><line x1="14" x2="14" y1="18" y2="11"></line><line x1="18" x2="18" y1="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg>`
                    innerCircleBgColor = "#EF4444" // Red
                    break
                  case "restaurant":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>` // Utensils
                    innerCircleBgColor = "#FF842C"
                    break
                  case "cafe":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-coffee"><path d="M10 2v2"></path><path d="M14 2v2"></path><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"></path><path d="M6 2v2"></path></svg>` // Coffee
                    innerCircleBgColor = "#FF842C"
                    break
                  case "street-food":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-salad text-white"><path d="M7 21h10"></path><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"></path><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"></path><path d="m13 12 4-4"></path><path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"></path></svg>`
                    innerCircleBgColor = "#FF842C"
                    break
                  case "food":
                  case "Food Tour":
                    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 4 0 0 0 2-2V2"/>
                        <path d="M7 2v20"/>
                        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>` // Utensils (general food)
                    innerCircleBgColor = "#FF842C"
                    break
                  case "photo":
                  case "Photography": // route.type "Photography"
                  case "Photo Tour":
                    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                        <circle cx="12" cy="13" r="4"/>
                        </svg>` // Camera
                    innerCircleBgColor = "#7434FF"
                    break
                  case "history":
                  case "History": // route.categoryDisplay "History"
                    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 20V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>
                        <path d="M4 20h16"/>
                        <path d="M8 8h8"/>
                        <path d="M8 12h8"/>
                        <path d="M8 16h8"/>
                        </svg>` // Archive
                    innerCircleBgColor = "#A0522D" // Sienna (darker brown)
                    break
                  case "shopping":
                  case "Shopping":
                    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>` // ShoppingBag
                    innerCircleBgColor = "#c026d3" // Fuchsia
                    break
                  case "nature":
                  case "Hiking": // route.type "hiking"
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"></path><path d="M7 16v6"></path><path d="M13 19v3"></path><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"></path></svg>`
                    innerCircleBgColor = "#10b981" // emerald
                    break
                  case "camper": // route.type "camper"
                  case "Road Trip": // route.categoryDisplay "Road Trip"
                    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"/>
                        <circle cx="7" cy="15" r="2"/>
                        <circle cx="17" cy="15" r="2"/>
                        <path d="M14 9H9"/>
                        </svg>` // Caravan
                    innerCircleBgColor = "#8b5cf6" // Violet
                    break
                  case "nightlife":
                    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5"/>
                        <path d="M5 12l6 6 6-6"/>
                        </svg>` // BarChart / activity
                    innerCircleBgColor = "#4ADE80" // Green for nightlife
                    break
                  case "bars-pubs":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-wine text-white"><path d="M8 22h8"></path><path d="M7 10h10"></path><path d="M12 15v7"></path><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"></path></svg>`
                    innerCircleBgColor = "#4ADE80" // Green for bars-pubs
                    break
                  case "branch":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-sandwich text-white"><path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"></path><path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83"></path><path d="m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z"></path><path d="M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z"></path></svg>`
                    innerCircleBgColor = "#FF842C"
                    break
                  case "bakeries":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-croissant text-white"><path d="m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z"></path><path d="m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83"></path><path d="M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4"></path><path d="m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2"></path><path d="M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5"></path></svg>`
                    innerCircleBgColor = "#FF842C"
                    break
                  case "hotels":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bed text-white"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"></path></svg>`
                    innerCircleBgColor = "#8B5A2B" // Brown
                    break
                  case "camping":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-tent text-white"><path d="M3.5 21 14 3"></path><path d="M20.5 21 10 3"></path><path d="M15.5 21 12 15l-3.5 6"></path><path d="M2 21h20"></path></svg>`
                    innerCircleBgColor = "#CB24ED" // Changed from #22C55E to #CB24ED
                    break
                  case "accommodation":
                  case "Accommodation":
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bed text-white"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"></path></svg>`
                    innerCircleBgColor = "#8B5A2B" // Brown
                    break
                  default:
                    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                        </svg>` // Default MapPin
                    innerCircleBgColor = "#6366f1" // Default purple for route navigation
                }

                innerCircleElement.style.backgroundColor = innerCircleBgColor
                innerCircleElement.innerHTML = iconSvg

                newOuterSquareElement.appendChild(innerCircleElement)
                markerElement.appendChild(newOuterSquareElement)

                const marker = new window.mapboxgl.Marker({
                  element: markerElement,
                  offset: [0, -25],
                })
                  .setLngLat(landmark.coordinates)
                  .addTo(mapInstance)

                markerElement.addEventListener("click", () => {
                  handleLandmarkClick(index)
                })

                markerElement.setAttribute("data-landmark-index", index.toString())
              }
            })

            // Draw the connected route between landmarks automatically
            if (landmarksWithCoords.length >= 2) {
              const routeWaypoints = landmarksWithCoords.map((l) => l.coordinates!)
              await drawConnectedRoute(mapInstance, routeWaypoints, route.pointsConnect || "walking")
            }

            // Fit map to show all landmarks with the connected route
            fitMapToBounds(mapInstance, route.landmarks, navigationPhase, INITIAL_CAROUSEL_FULL_HEIGHT_PX)
          } catch (error) {
            console.warn("Error adding markers or drawing route:", error)
          }
        })

        mapInstance.on("error", (e: any) => {
          console.error("Navigation map error:", e.error)
        })
      } catch (error) {
        console.error("Error initializing navigation map:", error)
      }
    }

    initializeNavigationMap()

    return () => {
      isMounted = false
    }
  }, [
    mapboxLoaded,
    isLightMode,
    mapType,
    route.landmarks,
    activeLandmark,
    fitMapToBounds,
    navigationPhase,
    drawConnectedRoute,
    route.pointsConnect,
  ])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (navigationMap) {
        setTimeout(() => {
          navigationMap.resize()
        }, 100)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [navigationMap])

  // Get user's current location and heading
  useEffect(() => {
    let watchId: number | null = null

    if (typeof window !== "undefined" && navigator.geolocation) {
      const successHandler = (position: GeolocationPosition) => {
        const { longitude, latitude, heading } = position.coords
        setUserLocation([longitude, latitude])
        setUserHeading(heading)
        setGeolocationError(null)
        console.log("User location:", [longitude, latitude], "Heading:", heading)
      }

      const errorHandler = (error: GeolocationPositionError) => {
        console.error("Geolocation error:", error)
        let errorMessage = "Failed to get your location."
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable it in your browser settings to use navigation features."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out."
            break
        }
        setGeolocationError(errorMessage)
      }

      watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      })
    } else {
      setGeolocationError("Geolocation is not supported by your browser.")
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  const userMarkerRef = useRef<any>(null)

  // Effect to add/update user location marker with direction and keep map centered
  useEffect(() => {
    if (!navigationMap || !userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
      return
    }

    if (!userMarkerRef.current) {
      const el = document.createElement("div")
      el.className = "user-location-marker"
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #E0E0E0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      `

      const innerCircle = document.createElement("div")
      innerCircle.className = "user-location-inner-circle"
      innerCircle.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #007AFF;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
      `
      el.appendChild(innerCircle)

      const directionFan = document.createElement("div")
      directionFan.className = "user-location-direction-fan"
      directionFan.style.cssText = `
        position: absolute;
        width: 60px;
        height: 40px;
        background: rgba(0, 122, 255, 0.2);
        border-radius: 30px 30px 0 0;
        clip-path: polygon(0% 0%, 100% 0%, 61.7% 100%, 38.3% 100%);
        left: -15px;
        top: -25px;
        transform: rotate(0deg);
        transform-origin: 50% 100%;
        z-index: 1;
        opacity: 0.9;
      `
      el.appendChild(directionFan)

      userMarkerRef.current = new window.mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(userLocation)
        .addTo(navigationMap)
    } else {
      userMarkerRef.current.setLngLat(userLocation)
    }

    if (userHeading !== null && userMarkerRef.current) {
      const markerElement = userMarkerRef.current.getElement()
      const directionFanElement = markerElement.querySelector(".user-location-direction-fan")
      if (directionFanElement) {
        directionFanElement.style.transform = `rotate(${userHeading}deg)`
      }
    }

    if (navigationPhase === "navigationActive" && isTrackingUserLocation) {
      navigationMap.flyTo({
        center: userLocation,
        zoom: 17,
        duration: 500,
        padding: {
          top: 150,
          bottom: NAVIGATION_COLLAPSED_HEIGHT_PX,
          left: 0,
          right: 0,
        },
      })
    }

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
    }
  }, [navigationMap, userLocation, userHeading, navigationPhase, isTrackingUserLocation])

  // Effect to listen for map interactions and disable tracking
  useEffect(() => {
    if (navigationMap) {
      const handleMapInteraction = () => {
        if (isTrackingUserLocation) {
          setIsTrackingUserLocation(false)
          console.log("Map interaction detected, disabling tracking.")
        }
      }

      navigationMap.on("dragstart", handleMapInteraction)
      navigationMap.on("zoomstart", handleMapInteraction)
      navigationMap.on("pitchstart", handleMapInteraction)
      navigationMap.on("rotatestart", handleMapInteraction)

      return () => {
        navigationMap.off("dragstart", handleMapInteraction)
        navigationMap.off("zoomstart", handleMapInteraction)
        navigationMap.off("pitchstart", handleMapInteraction)
        navigationMap.off("rotatestart", handleMapInteraction)
      }
    }
  }, [navigationMap, setIsTrackingUserLocation])

  // Calculate current bottom sheet height with drag offset
  const getCurrentBottomSheetHeight = () => {
    const heights = getBottomSheetHeights()
    let targetHeight: number

    if (navigationPhase === "initialCarousel") {
      return 0
    } else if (navigationPhase === "navigationActive") {
      targetHeight = bottomSheetPosition === "navigationCollapsed" ? heights.navigationCollapsed : heights.expanded
    } else {
      targetHeight = heights[bottomSheetPosition]
    }

    if (isDragging) {
      const minHeight = heights.collapsed
      const maxHeight = heights.expanded
      const newHeight = targetHeight + tempDragOffset
      return Math.max(minHeight, Math.min(maxHeight, newHeight))
    }

    return targetHeight
  }

  // Calculate total distance and duration
  const getTotalDistanceAndDuration = () => {
    if (!currentDirections || currentDirections.length === 0) {
      return { distance: 0, duration: 0 }
    }

    const totalDistance = currentDirections.reduce((sum, step) => sum + step.distance, 0)
    const totalDuration = currentDirections.reduce((sum, step) => sum + step.duration, 0)

    return { distance: totalDistance, duration: totalDuration }
  }

  // Check if navigation can be started
  const canStartNavigation = () => {
    return (
      selectedLandmarkForNavigation !== null &&
      userLocation !== null &&
      transportMode !== null &&
      route.landmarks[selectedLandmarkForNavigation]?.coordinates !== undefined &&
      currentDirections !== null &&
      currentDirections.length > 0
    )
  }

  // Helper to get transport icon
  const getTransportIcon = (mode: string, size: number) => {
    switch (mode) {
      case "walking":
        return <Walk size={size} />
      case "cycling":
        return <Bike size={size} />
      case "driving":
        return <Car size={size} />
      default:
        return <Car size={size} />
    }
  }

  // Helper to get maneuver icon
  const getManeuverIcon = (step: MapboxStep, size = 40) => {
    const { type, modifier } = step.maneuver

    switch (type) {
      case "turn":
      case "slight turn":
      case "sharp turn":
        if (modifier && modifier.includes("left")) {
          return <Image src="/icons/turn-left.png" alt="Turn Left" width={size} height={size} />
        } else if (modifier && modifier.includes("right")) {
          return <Image src="/icons/turn-right.png" alt="Turn Right" width={size} height={size} />
        }
        return <ArrowUp size={size} />
      case "depart":
        return <ArrowUp size={size} />
      case "arrive":
        return <MapPin size={size} />
      case "straight":
        return <ArrowUp size={size} />
      case "merge":
        return <ArrowUp size={size} />
      case "fork":
        return <ArrowUp size={size} />
      case "end of road":
        return <MapPin size={size} />
      case "new name":
        return <ArrowUp size={size} />
      case "roundabout":
      case "rotary":
        return <RefreshCw size={size} />
      case "exit":
        if (modifier && modifier.includes("left")) {
          return <Image src="/icons/turn-left.png" alt="Exit Left" width={size} height={size} />
        } else if (modifier && modifier.includes("right")) {
          return <Image src="/icons/turn-right.png" alt="Exit Right" width={size} height={size} />
        }
        return <ArrowUp size={size} />
      default:
        return <Navigation size={size} />
    }
  }

  // Landmark Details Block
  const LandmarkDetailsBlock = ({ landmarkIndex }: { landmarkIndex: number | null }) => {
    if (landmarkIndex === null || !route.landmarks[landmarkIndex]) {
      return null
    }

    const cardClasses = isLightMode
      ? "rounded-2xl border border-gray-200 bg-white text-black shadow-sm"
      : "rounded-2xl border border-[#27272f] bg-[#18181c] text-white shadow-sm"

    const sectionBorder = isLightMode ? "border-gray-200" : "border-[#2a2a2a]"
    const iconMuted = isLightMode ? "text-gray-600" : "text-gray-400"
    const textMuted = isLightMode ? "text-gray-700" : "text-gray-300"

    return (
      <div className={`mt-3 ${cardClasses}`}>
        {/* Address */}
        <div className="flex items-center gap-3 p-4">
          <MapPin size={18} className={iconMuted} />
          <span className={`text-sm flex-1 min-w-0 ${isLightMode ? "text-black" : "text-white"}`}>
            Place for address
          </span>
        </div>

        {/* Opening Hours */}
        <div className={`p-4 border-t ${sectionBorder}`}>
          <button
            className="flex items-center justify-between w-full text-left"
            onClick={() => setShowWeeklyHours(!showWeeklyHours)}
          >
            <div className="flex items-center gap-3">
              <Clock size={18} className={iconMuted} />
              <span className="text-sm text-green-500">Open</span>
              <span className={`text-sm ${isLightMode ? "text-black" : "text-white"}`}>11:00 - 22:00</span>
            </div>
            {showWeeklyHours ? (
              <ChevronUp size={16} className={iconMuted} />
            ) : (
              <ChevronDown size={16} className={iconMuted} />
            )}
          </button>
          {showWeeklyHours && (
            <div className={`mt-3 text-xs space-y-1 ${textMuted}`}>
              {weeklySchedule.map((day, idx) => (
                <p key={idx}>{day}</p>
              ))}
            </div>
          )}
        </div>

        {/* Social Media */}
        <div className={`flex items-center gap-3 p-4 border-t ${sectionBorder}`}>
          <Circle size={18} className={iconMuted} />
          <span className={`text-sm ${isLightMode ? "text-black" : "text-white"}`}>Instagram.com</span>
        </div>
      </div>
    )
  }

  // Refs for carousels
  const mobileCarouselRef = useRef<HTMLDivElement>(null)
  const desktopListRef = useRef<HTMLDivElement>(null)

  const isProgrammaticScroll = useRef(false)

  // Prepare landmarks for mobile looping effect
  const duplicatedLandmarks = useMemo(() => {
    return route.landmarks
  }, [route.landmarks])

  const originalDataStartIndex = 0

  const getOriginalIndexFromDuplicatedIndex = useCallback((displayIndex: number) => {
    return displayIndex
  }, [])

  // Initial scroll to center the first original landmark on mount
  useEffect(() => {
    if (mobileCarouselRef.current && route.landmarks.length > 0) {
      const targetCardIndex = 0
      const cardElement = mobileCarouselRef.current.children[targetCardIndex] as HTMLElement
      if (cardElement) {
        isProgrammaticScroll.current = true
        mobileCarouselRef.current.scrollTo({
          left: cardElement.offsetLeft - mobileCarouselRef.current.clientWidth / 2 + cardElement.clientWidth / 2,
          behavior: "auto",
        })
        setTimeout(() => {
          isProgrammaticScroll.current = false
        }, 50)
        setFocusedCardIndex(0)
      }
    }
  }, [route.landmarks])

  const handleMobileCarouselScroll = useCallback(() => {
    if (!mobileCarouselRef.current || isProgrammaticScroll.current || route.landmarks.length === 0) return

    isCarouselScrollingRef.current = true

    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)

    scrollRafRef.current = requestAnimationFrame(() => {
      const { scrollLeft, clientWidth } = mobileCarouselRef.current!
      const centerOfViewport = scrollLeft + clientWidth / 2

      let closestIndex = 0
      let minDistance = Number.POSITIVE_INFINITY

      Array.from(mobileCarouselRef.current!.children).forEach((child, index) => {
        const el = child as HTMLElement
        const elCenter = el.offsetLeft + el.clientWidth / 2
        const distance = Math.abs(elCenter - centerOfViewport)
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = index
        }
      })

      setFocusedCardIndex(closestIndex)

      if (scrollDebounceRef.current) window.clearTimeout(scrollDebounceRef.current)
      scrollDebounceRef.current = window.setTimeout(() => {
        isCarouselScrollingRef.current = false
        setActiveLandmark((prev) => (prev !== closestIndex ? closestIndex : prev))
      }, 180)
    })
  }, [route.landmarks.length])

  // Attach scroll event listener for mobile carousel
  useEffect(() => {
    const carousel = mobileCarouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", handleMobileCarouselScroll)
      return () => carousel.removeEventListener("scroll", handleMobileCarouselScroll)
    }
  }, [handleMobileCarouselScroll])

  // Handle landmark click from desktop view to scroll mobile carousel
  useEffect(() => {
    if (
      mobileCarouselRef.current &&
      activeLandmark !== null &&
      navigationPhase === "initialCarousel" &&
      !isProgrammaticScroll.current
    ) {
      const targetDisplayIndex = activeLandmark
      const cardElement = mobileCarouselRef.current.children[targetDisplayIndex] as HTMLElement
      if (cardElement) {
        isProgrammaticScroll.current = true
        mobileCarouselRef.current.scrollTo({
          left: cardElement.offsetLeft - mobileCarouselRef.current.clientWidth / 2 + cardElement.clientWidth / 2,
          behavior: "smooth",
        })
        setTimeout(() => {
          isProgrammaticScroll.current = false
        }, 300)
      }
    }
  }, [activeLandmark, navigationPhase])

  // Handle activeLandmark change for desktop list
  useEffect(() => {
    if (desktopListRef.current && activeLandmark !== null && navigationPhase === "initialCarousel") {
      const targetCardElement = desktopListRef.current.children[activeLandmark] as HTMLElement
      if (targetCardElement) {
        const scrollEl = (desktopListRef.current?.parentElement as HTMLElement) || desktopListRef.current
        if (scrollEl) {
          scrollEl.scrollTo({
            top: targetCardElement.offsetTop - scrollEl.clientHeight / 2 + targetCardElement.clientHeight / 2,
            behavior: "smooth",
          })
        }
      }
    }
  }, [activeLandmark, navigationPhase])

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
      if (scrollDebounceRef.current) window.clearTimeout(scrollDebounceRef.current)
    }
  }, [])

  return (
    <main className="flex h-screen bg-[#0c0c0e] text-white overflow-hidden">
      {/* Unified Layout */}
      <div className="flex w-full h-full">
        {/* Left Panel - Desktop only */}
        <div className="hidden md:flex w-[400px] h-full flex-col border-r border-[#1a1a1a] overflow-hidden bg-[#0c0c0e]">
          {/* Header */}
          <div className="p-4 border-b border-[#1a1a1a] flex items-center bg-[#0c0c0e]">
            <button onClick={() => router.back()} className="mr-3">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-lg font-medium truncate">{route.name}</h1>
          </div>

          {/* Desktop Tab Content Area */}
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar min-h-0">
            {navigationPhase === "initialCarousel" ? (
              /* Initial Carousel Content (Desktop) */
              <div ref={desktopListRef} className="px-4 py-2 flex flex-col gap-4 snap-y snap-mandatory scroll-py-2">
                {route.landmarks.map((landmark, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-full h-[400px] shadow-md rounded-2xl p-3 overflow-hidden border cursor-pointer relative flex flex-col ${
                        isLightMode
                          ? "bg-white text-black border-gray-200 hover:bg-gray-100"
                          : "bg-[#0D0D0D] text-white border-[#27272f] hover:bg-[#1c1c1c]"
                      } transition-colors snap-center`}
                      onClick={() => {
                        setFocusedCardIndex(index)
                        handleLandmarkClick(index)
                      }}
                    >
                      <div className="relative w-full h-44 mb-3 rounded-2xl overflow-hidden">
                        <Image
                          src={normalizeImage(((landmark as any).gallery?.[0] ?? landmark.image) as string)}
                          alt={landmark.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between p-0">
                        <h3 className={`text-base font-medium mb-1 ${isLightMode ? "text-black" : "text-white"}`}>
                          {landmark.name}
                        </h3>
                        <p
                          className={`text-sm line-clamp-4 mb-3 w-full ${isLightMode ? "text-gray-700" : "text-gray-300"}`}
                        >
                          {landmark.description ||
                            "A breathtaking photorealistic depiction of the Statue of Zeus at Olympia under a midday sun, surrounded by ancient Greek ruins and olive trees, golden light illuminating the massive marble statue, clear blue sky, ultra-detailed, 4K resolution, wide aspect ratio simila"}
                        </p>
                        {/* Transport Button */}
                        <div className="flex justify-start mt-auto">
                          <button
                            className="px-6 py-2 bg-[#4F46E5] text-white rounded-full font-medium transition-colors hover:bg-[#4338CA]"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFocusedCardIndex(index)
                              setActiveLandmark(index)
                              setSelectedLandmarkForNavigation(route.landmarks.length - 1) // Always target final destination
                              setTransportModeSelectedInBottomSheet(false)
                              setNavigationPhase("landmarkSelection")
                              setBottomSheetPosition("middle")
                            }}
                          >
                            Show the route
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : navigationPhase === "navigationActive" && selectedLandmarkForNavigation !== null ? (
              // Navigation Active UI (Desktop)
              <div className="flex flex-col min-h-0 flex-none">
                <div className="p-4">
                  {directionsLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <MapIcon size={32} className="animate-pulse mb-2" />
                      <p>Calculating route...</p>
                    </div>
                  ) : currentDirections && currentDirections.length > 0 ? (
                    <div className="space-y-4">
                      {/* Transport Mode Selection */}
                      <div className="bg-[#18181c] rounded-lg p-4 border border-[#27272f] mb-4">
                        <h3 className="text-white font-medium mb-3">Choose Transport Mode</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            className={`flex flex-row items-center justify-center p-2 rounded-full text-sm font-medium transition-colors gap-2 ${
                              transportMode === "walking"
                                ? "border border-[#EF4444] text-[#EF4444]"
                                : "bg-[#27272f] text-gray-300 hover:bg-[#323240]"
                            }`}
                            onClick={() => {
                              const newMode = "walking"
                              setTransportMode(newMode)
                              if (userLocation) {
                                drawNavigationRoute(navigationMap, userLocation, newMode)
                              }
                            }}
                          >
                            <Walk size={20} />
                            <span>Walk</span>
                          </button>
                          <button
                            className={`flex flex-row items-center justify-center p-2 rounded-full text-sm font-medium transition-colors gap-2 ${
                              transportMode === "cycling"
                                ? "border border-[#EF4444] text-[#EF4444]"
                                : "bg-[#27272f] text-gray-300 hover:bg-[#323240]"
                            }`}
                            onClick={() => {
                              const newMode = "cycling"
                              setTransportMode(newMode)
                              if (userLocation) {
                                drawNavigationRoute(navigationMap, userLocation, newMode)
                              }
                            }}
                          >
                            <Bike size={20} />
                            <span>Bike</span>
                          </button>
                          <button
                            className={`flex flex-row items-center justify-center p-2 rounded-full text-sm font-medium transition-colors gap-2 ${
                              transportMode === "driving"
                                ? "border border-[#EF4444] text-[#EF4444]"
                                : "bg-[#27272f] text-gray-300 hover:bg-[#323240]"
                            }`}
                            onClick={() => {
                              const newMode = "driving"
                              setTransportMode(newMode)
                              if (userLocation) {
                                drawNavigationRoute(navigationMap, userLocation, newMode)
                              }
                            }}
                          >
                            <Car size={20} />
                            <span>Drive</span>
                          </button>
                        </div>
                      </div>

                      {/* Route Type Info */}
                      <div className="bg-[#18181c] rounded-lg p-4 border border-[#27272f] mb-4">
                        <h3 className="text-white font-medium mb-2">Route Information</h3>
                        <p className="text-gray-300 text-sm">
                          This is a connected route that will navigate you through{" "}
                          <span className="font-semibold text-[#6366f1]">{route.landmarks.length} landmarks</span> in
                          sequence, ending at {route.landmarks[route.landmarks.length - 1]?.name}.
                        </p>
                      </div>

                      {/* Summary Block */}
                      <div className="bg-[#18181c] rounded-lg p-4 border border-[#27272f] mb-4">
                        <h3 className="text-white font-medium mb-2">Route Summary</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-[#EF4444]">
                                {(getTotalDistanceAndDuration().distance / 1000).toFixed(1)}
                              </p>
                              <p className="text-xs text-gray-400">km</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-[#EF4444]">
                                {formatDuration(getTotalDistanceAndDuration().duration)}
                              </p>
                              <p className="text-xs text-gray-400">time</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-300">Full Route: {route.landmarks.length} stops</p>
                            <p className="text-xs text-gray-400">
                              {transportMode?.charAt(0).toUpperCase() + transportMode?.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Directions */}
                      <div>
                        <h3 className="text-white font-medium mb-3">
                          {transportMode?.charAt(0).toUpperCase() + transportMode?.slice(1)} Directions
                        </h3>
                        <div className="space-y-3">
                          {/* Next Step Section */}
                          <div className="bg-[#212124] rounded-xl p-4 border border-[#2a2a2a]">
                            {currentDirections && currentDirections.length > 0 ? (
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-medium mt-1">
                                  {getManeuverIcon(currentDirections[0], 30)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-white text-base">{currentDirections[0].maneuver.instruction}</p>
                                  <p className="text-gray-400 text-base mt-1 font-semibold">
                                    {(currentDirections[0].distance / 1000).toFixed(2)} km
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">No directions available yet.</p>
                            )}
                          </div>

                          {/* Show first 3 steps or all if showAllSteps is true */}
                          {(showAllSteps ? currentDirections : currentDirections.slice(0, 3)).map((step, idx) => (
                            <div key={idx} className="bg-[#18181c] rounded-lg p-4 border border-[#27272f]">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-medium mt-1">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-white text-sm">{step.maneuver.instruction}</p>
                                  <p className="text-gray-400 text-xs mt-1">
                                    {(step.distance / 1000).toFixed(2)} km • {formatDuration(step.duration)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Show More/Less Button */}
                          {currentDirections.length > 3 && (
                            <button
                              className="w-full py-3 bg-[#18181c] hover:bg-[#1c1c22] rounded-lg border border-[#27272f] text-sm text-gray-300 flex items-center justify-center gap-2 transition-colors"
                              onClick={() => setShowAllSteps(!showAllSteps)}
                            >
                              {showAllSteps ? (
                                <>
                                  <ChevronUp size={16} />
                                  <span>Show Less</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={16} />
                                  <span>Show All Steps ({currentDirections.length - 3} more)</span>
                                </>
                              )}
                            </button>
                          )}

                          {/* Destination */}
                          <div className="bg-[#18181c] rounded-lg p-4 border border-[#27272f]">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium mt-1">
                                ✓
                              </div>
                              <div className="flex-1">
                                <p className="text-white text-sm">You have completed the full route</p>
                                <p className="text-gray-400 text-xs mt-1">
                                  Final destination: {route.landmarks[selectedLandmarkForNavigation || 0]?.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alternative Transport Options */}
                      <div className="mt-6">
                        <h3 className="text-white font-medium mb-3">Alternative Transport</h3>
                        <div className="space-y-3">
                          <div className="bg-[#18181c] rounded-lg p-4 border border-[#27272f]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">Uber</span>
                                </div>
                                <div>
                                  <p className="text-white font-medium">Uber</p>
                                  <p className="text-gray-400 text-sm">5 min</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-medium">10-15 €</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Navigation size={32} className="mb-2" />
                      {selectedLandmarkForNavigation === null ? (
                        <p className="text-center">Select a landmark to start route navigation</p>
                      ) : !userLocation ? (
                        <>
                          <p className="text-center">Waiting for your location to start navigation...</p>
                          {geolocationError && (
                            <p className="text-sm text-red-400 mt-2 text-center">{geolocationError}</p>
                          )}
                        </>
                      ) : !route.landmarks[selectedLandmarkForNavigation]?.coordinates ? (
                        <p className="text-center">Selected landmark has no coordinates for navigation</p>
                      ) : (
                        <p className="text-center">Tap Start Navigation to begin the full route</p>
                      )}
                      {selectedLandmarkForNavigation !== null && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          Route ends at: {route.landmarks[selectedLandmarkForNavigation]?.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Landmark Selection UI (Desktop)
              <div className="flex flex-col p-4 flex-none">
                {/* Transport Mode Selection */}
                <div className="flex gap-2 mb-4 flex-wrap relative">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-[#27272f] ${
                      transportMode === "driving"
                        ? "bg-[#EF4444] text-white"
                        : "bg-[#2a2a2a] text-gray-300 hover:bg-[#323240]"
                    }`}
                    onClick={() => {
                      const newMode = "driving"
                      setTransportMode(newMode)
                      setTransportModeSelectedInBottomSheet(true)
                      if (activeLandmark !== null && userLocation && navigationMap) {
                        drawNavigationRoute(navigationMap, userLocation, newMode)
                      }
                    }}
                  >
                    <Car size={16} />
                    <span>Drive</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-[#27272f] ${
                      transportMode === "walking"
                        ? "bg-[#EF4444] text-white"
                        : "bg-[#2a2a2a] text-gray-300 hover:bg-[#323240]"
                    }`}
                    onClick={() => {
                      const newMode = "walking"
                      setTransportMode(newMode)
                      setTransportModeSelectedInBottomSheet(true)
                      if (activeLandmark !== null && userLocation && navigationMap) {
                        drawNavigationRoute(navigationMap, userLocation, newMode)
                      }
                    }}
                  >
                    <Walk size={16} />
                    <span>Walk</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-[#27272f] ${
                      transportMode === "cycling"
                        ? "bg-[#EF4444] text-white"
                        : "bg-[#2a2a2a] text-gray-300 hover:bg-[#323240]"
                    }`}
                    onClick={() => {
                      const newMode = "cycling"
                      setTransportMode(newMode)
                      setTransportModeSelectedInBottomSheet(true)
                      if (activeLandmark !== null && userLocation && navigationMap) {
                        drawNavigationRoute(navigationMap, userLocation, newMode)
                      }
                    }}
                  >
                    <Bike size={16} />
                    <span>Bike</span>
                  </button>
                  {/* X button for desktop landmark selection */}
                  <button
                    className="absolute top-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    onClick={() => {
                      setActiveLandmark(null)
                      setSelectedLandmarkForNavigation(route.landmarks.length - 1) // Reset to final destination
                      setTransportModeSelectedInBottomSheet(false)
                      setBottomSheetPosition("collapsed")
                      setCurrentDirections(null)
                      setNavigationPhase("initialCarousel")
                      removeNavigationRouteFromMap()
                    }}
                  >
                    <X size={36} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Route Information Blocks - Show when transport mode is selected */}
                {transportModeSelectedInBottomSheet && (
                  <div className="space-y-3 mb-4">
                    {/* Route Preview Block */}
                    <div className={`rounded-2xl p-4 ${isLightMode ? "bg-gray-100" : "bg-[#2a2a2a]"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-[17px] h-[17px] rounded-full border-[3px] border-blue-500 bg-white flex-shrink-0"></div>
                        <span className={`text-sm ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                          Our Geolocation
                        </span>
                      </div>

                      <div className="space-y-2">
                        {route.landmarks.map((landmark, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div
                              className={`w-[3px] h-[3px] rounded-full ${isLightMode ? "bg-gray-700" : "bg-gray-300"}`}
                            ></div>
                            <div className="w-6 h-6 rounded-full bg-[#6366f1] text-white text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <span className={`text-sm ${isLightMode ? "text-black" : "text-white"}`}>
                              {landmark.name}
                            </span>
                            {idx === route.landmarks.length - 1 && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Final</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Route Summary Block */}
                    <div className={`rounded-2xl p-4 ${isLightMode ? "bg-gray-100" : "bg-[#2a2a2a]"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm mb-1 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
                            Full Route summary
                          </h3>
                          <div className="flex items-center gap-4">
                            <span className={`text-lg font-semibold ${isLightMode ? "text-black" : "text-white"}`}>
                              {(getTotalDistanceAndDuration().distance / 1000).toFixed(1)} km
                            </span>
                            <span className={`text-lg font-semibold ${isLightMode ? "text-black" : "text-white"}`}>
                              {formatDuration(getTotalDistanceAndDuration().duration)}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
                            Through {route.landmarks.length} landmarks
                          </p>
                        </div>
                        <button
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors"
                          onClick={() => {
                            if (canStartNavigation()) {
                              handleStartNavigation()
                            }
                          }}
                          disabled={!canStartNavigation()}
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Landmark Image */}
                {route.landmarks[activeLandmark || 0] && (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4">
                    <LandmarkGallery
                      images={getLandmarkImages(route.landmarks[activeLandmark || 0] as any)}
                      alt={route.landmarks[activeLandmark || 0].name}
                    />
                  </div>
                )}

                {/* Description */}
                {route.landmarks[activeLandmark || 0] && (
                  <div className={`text-sm leading-relaxed ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                    {route.landmarks[activeLandmark || 0].description ||
                      "A breathtaking photorealistic depiction of the Statue of Zeus at Olympia under a midday sun, surrounded by ancient Greek ruins and olive trees, golden light illuminating the massive marble statue, clear blue sky, ultra-detailed, 4K resolution, wide aspect ratio simila"}
                  </div>
                )}

                {/* Info blocks */}
                {getInfoBlockBetweenLandmarks(1)}

                {geolocationError && (
                  <div className="mt-4 bg-red-600/90 text-white p-3 rounded-lg border border-red-500/50">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">{geolocationError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {/* Mobile Header */}
          <div className="md:hidden absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between">
            {navigationPhase === "navigationActive" ? null : (
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div className={`relative ${navigationPhase === "navigationActive" ? "ml-auto" : ""}`}>
              <button
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white"
                onClick={toggleSettings}
              >
                <Settings size={18} />
              </button>
              {showSettings && (
                <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20 min-w-[160px]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm text-white">Mode</span>
                      <Switch checked={isLightMode} onCheckedChange={setIsLightMode} />
                    </div>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors"
                      onClick={toggleMapType}
                    >
                      <Layers size={16} />
                      <span>{mapType === "standard" ? "Satellite" : "Standard"}</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors">
                      <Share size={16} />
                      <span>Share</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors"
                      onClick={() => {
                        if (navigationMap && userLocation) {
                          setIsTrackingUserLocation(true)
                          navigationMap.flyTo({
                            center: userLocation,
                            zoom: 17,
                            duration: 1000,
                            padding: {
                              top: 150,
                              bottom: NAVIGATION_COLLAPSED_HEIGHT_PX,
                              left: 0,
                              right: 0,
                            },
                          })
                        }
                      }}
                    >
                      <LocateFixed size={16} />
                      <span>My Location</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Desktop Map Controls */}
          <div className="hidden md:block absolute top-4 right-4 z-50">
            <div className="relative">
              <button
                className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white border border-white/20 hover:bg-black/70 transition-colors"
                onClick={toggleSettings}
              >
                <Settings size={18} />
              </button>
              {showSettings && (
                <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20 min-w-[160px]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm text-white">Mode</span>
                      <Switch checked={isLightMode} onCheckedChange={setIsLightMode} />
                    </div>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors"
                      onClick={toggleMapType}
                    >
                      <Layers size={16} />
                      <span>{mapType === "standard" ? "Satellite" : "Standard"}</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors">
                      <Share size={16} />
                      <span>Share</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors"
                      onClick={() => {
                        if (navigationMap && userLocation) {
                          setIsTrackingUserLocation(true)
                          navigationMap.flyTo({
                            center: userLocation,
                            zoom: 17,
                            duration: 1000,
                            padding: {
                              top: 150,
                              bottom: NAVIGATION_COLLAPSED_HEIGHT_PX,
                              left: 0,
                              right: 0,
                            },
                          })
                        }
                      }}
                    >
                      <LocateFixed size={16} />
                      <span>My Location</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Initial Carousel */}
        {navigationPhase === "initialCarousel" && (
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-transparent flex flex-col items-center justify-end pointer-events-none"
            style={{ height: `${INITIAL_CAROUSEL_FULL_HEIGHT_PX}px` }}
          >
            <div
              ref={mobileCarouselRef}
              className="w-full overflow-x-auto scrollbar-hide px-4 pb-2 flex gap-4 snap-x snap-mandatory scroll-px-4 overflow-y-hidden pointer-events-auto"
            >
              {duplicatedLandmarks.map((landmark, displayIndex) => {
                const originalIndex = getOriginalIndexFromDuplicatedIndex(displayIndex)
                return (
                  <div
                    key={displayIndex}
                    className={`flex-shrink-0 w-[270px] h-[360px] shadow-md rounded-3xl p-4 overflow-hidden border cursor-pointer relative flex flex-col ${
                      isLightMode
                        ? "bg-white text-black border-gray-200 hover:bg-gray-100"
                        : "bg-[#0D0D0D] text-white border-[#27272f] hover:bg-[#1c1c1c]"
                    } transition-colors snap-center`}
                    onClick={() => {
                      setFocusedCardIndex(originalIndex)
                      handleLandmarkClick(originalIndex)
                    }}
                  >
                    <div className="relative w-full h-44 mb-3 rounded-xl overflow-hidden">
                      <Image
                        src={normalizeImage(((landmark as any).gallery?.[0] ?? landmark.image) as string)}
                        alt={landmark.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-0">
                      <h3 className={`text-base font-medium mb-1 ${isLightMode ? "text-black" : "text-white"}`}>
                        {landmark.name}
                      </h3>
                      <p
                        className={`text-sm line-clamp-2 mb-3 w-full ${isLightMode ? "text-gray-700" : "text-gray-300"}`}
                      >
                        {landmark.description ||
                          "A breathtaking photorealistic depiction of the Statue of Zeus at Olympia under a midday sun, surrounded by ancient Greek ruins and olive trees, golden light illuminating the massive marble statue, clear blue sky, ultra-detailed, 4K resolution, wide aspect ratio simila"}
                      </p>
                      <div className="flex justify-start mt-auto">
                        <button
                          className="px-6 py-2 bg-[#4F46E5] text-white rounded-full font-medium transition-colors hover:bg-[#4338CA]"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFocusedCardIndex(originalIndex)
                            setActiveLandmark(originalIndex)
                            setSelectedLandmarkForNavigation(route.landmarks.length - 1) // Always target final destination
                            setTransportModeSelectedInBottomSheet(false)
                            setNavigationPhase("landmarkSelection")
                            setBottomSheetPosition("middle")
                          }}
                        >
                          Show the route
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Mobile Bottom Sheet */}
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 rounded-t-3xl z-40 overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${
            isLightMode ? "bg-white text-black" : "bg-[#0c0c0e] text-white"
          }`}
          style={{ height: `${getCurrentBottomSheetHeight()}px` }}
        >
          {/* Draggable Header Area */}
          <div
            className={`w-full flex flex-col items-center py-2 px-4 cursor-grab relative z-20 flex-shrink-0 ${
              isLightMode ? "bg-white" : "bg-[#0c0c0e]"
            }`}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className={`w-[50px] h-[3px] rounded-full mb-2 ${isLightMode ? "bg-gray-300" : "bg-gray-600"}`} />

            {navigationPhase === "navigationActive" && selectedLandmarkForNavigation !== null ? (
              // Navigation Active UI Header
              <div className="flex items-center justify-between gap-2 w-full pb-2">
                <div className="w-10 h-10 rounded-full bg-[#EF4444] flex items-center justify-center text-white">
                  {getTransportIcon(transportMode, 20)}
                </div>
                <div
                  className={`flex-1 flex items-center justify-center h-10 text-sm font-medium py-2 px-3 rounded-full border ${isLightMode ? "bg-gray-100 text-black border-gray-200" : "bg-[#2a2a2a] text-white border-[#EF4444]"}`}
                >
                  {(getTotalDistanceAndDuration().distance / 1000).toFixed(1)} km
                </div>
                <div
                  className={`flex-1 flex items-center justify-center h-10 text-sm font-medium py-2 px-3 rounded-full border ${isLightMode ? "bg-gray-100 text-black border-gray-200" : "bg-[#2a2a2a] text-white border-[#EF4444]"}`}
                >
                  {formatDuration(getTotalDistanceAndDuration().duration)}
                </div>
                <button
                  className="w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors h-10"
                  onClick={handleStopNavigation}
                >
                  Stop
                </button>
              </div>
            ) : (
              // Landmark Selection UI Header
              <div className="flex justify-between items-center w-full pb-2">
                <h2 className={`text-lg font-medium ${isLightMode ? "text-black" : "text-white"}`}>
                  {route.landmarks[activeLandmark || 0]?.name}
                </h2>
                {navigationPhase === "landmarkSelection" && (
                  <button
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLightMode ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"}`}
                    onClick={() => {
                      setActiveLandmark(null)
                      setSelectedLandmarkForNavigation(route.landmarks.length - 1)
                      setTransportModeSelectedInBottomSheet(false)
                      setBottomSheetPosition("collapsed")
                      setCurrentDirections(null)
                      setNavigationPhase("initialCarousel")
                      removeNavigationRouteFromMap()
                    }}
                  >
                    <X size={36} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom Sheet Content */}
          {navigationPhase === "navigationActive" && selectedLandmarkForNavigation !== null ? (
            // Navigation Active UI
            <div className="flex-1 flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 pb-8">
                {/* Final Destination Information */}
                <div className="mt-4">
                  {route.landmarks[selectedLandmarkForNavigation] && (
                    <>
                      <h3 className={`font-medium mb-2 text-base ${isLightMode ? "text-black" : "text-white"}`}>
                        Final Destination: {route.landmarks[selectedLandmarkForNavigation].name}
                      </h3>
                      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4">
                        <LandmarkGallery
                          images={getLandmarkImages(route.landmarks[selectedLandmarkForNavigation] as any)}
                          alt={route.landmarks?.name}
                        />
                      </div>
                      <p className={`text-sm leading-relaxed mb-4 ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                        {route.landmarks[selectedLandmarkForNavigation].description ||
                          "A breathtaking photorealistic depiction of the Statue of Zeus at Olympia under a midday sun, surrounded by ancient Greek ruins and olive trees, golden light illuminating the massive marble statue, clear blue sky, ultra-detailed, 4K resolution, wide aspect ratio simila"}
                      </p>

                      {/* Route Progress */}
                      <div className={`rounded-2xl p-4 mb-4 ${isLightMode ? "bg-gray-100" : "bg-[#2a2a2a]"}`}>
                        <h4 className={`font-medium mb-2 ${isLightMode ? "text-black" : "text-white"}`}>
                          Route Progress
                        </h4>
                        <p className={`text-sm ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                          Following a connected route through {route.landmarks.length} landmarks in sequence.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Landmark Selection UI
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar px-4 pb-8">
              <div>
                {/* Transport Mode Selection */}
                <div className="flex gap-2 mb-4 flex-wrap relative">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      transportMode === "driving"
                        ? "bg-[#EF4444] text-white"
                        : isLightMode
                          ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                          : "bg-[#2a2a2a] text-gray-300 hover:bg-[#323240]"
                    }`}
                    onClick={() => {
                      const newMode = "driving"
                      setTransportMode(newMode)
                      setTransportModeSelectedInBottomSheet(true)
                      if (activeLandmark !== null && userLocation && navigationMap) {
                        drawNavigationRoute(navigationMap, userLocation, newMode)
                      }
                    }}
                  >
                    <Car size={16} />
                    <span>Drive</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      transportMode === "walking"
                        ? "bg-[#EF4444] text-white"
                        : isLightMode
                          ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                          : "bg-[#2a2a2a] text-gray-300 hover:bg-[#323240]"
                    }`}
                    onClick={() => {
                      const newMode = "walking"
                      setTransportMode(newMode)
                      setTransportModeSelectedInBottomSheet(true)
                      if (activeLandmark !== null && userLocation && navigationMap) {
                        drawNavigationRoute(navigationMap, userLocation, newMode)
                      }
                    }}
                  >
                    <Walk size={16} />
                    <span>Walk</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      transportMode === "cycling"
                        ? "bg-[#EF4444] text-white"
                        : isLightMode
                          ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                          : "bg-[#2a2a2a] text-gray-300 hover:bg-[#323240]"
                    }`}
                    onClick={() => {
                      const newMode = "cycling"
                      setTransportMode(newMode)
                      setTransportModeSelectedInBottomSheet(true)
                      if (activeLandmark !== null && userLocation && navigationMap) {
                        drawNavigationRoute(navigationMap, userLocation, newMode)
                      }
                    }}
                  >
                    <Bike size={16} />
                    <span>Bike</span>
                  </button>
                </div>

                {/* Route Information Blocks */}
                {transportModeSelectedInBottomSheet && (
                  <div className="space-y-3 mb-4">
                    {/* Route Preview Block */}
                    <div className={`rounded-2xl p-4 ${isLightMode ? "bg-gray-100" : "bg-[#2a2a2a]"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-[17px] h-[17px] rounded-full border-[3px] border-blue-500 bg-white flex-shrink-0"></div>
                        <span className={`text-sm ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                          Our Geolocation
                        </span>
                      </div>

                      <div className="space-y-2">
                        {route.landmarks.map((landmark, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div
                              className={`w-[3px] h-[3px] rounded-full ${isLightMode ? "bg-gray-700" : "bg-gray-300"}`}
                            ></div>
                            <div className="w-6 h-6 rounded-full bg-[#6366f1] text-white text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <span className={`text-sm ${isLightMode ? "text-black" : "text-white"}`}>
                              {landmark.name}
                            </span>
                            {idx === route.landmarks.length - 1 && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Final</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Route Summary Block */}
                    <div className={`rounded-2xl p-4 ${isLightMode ? "bg-gray-100" : "bg-[#2a2a2a]"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm mb-1 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
                            Full Route summary
                          </h3>
                          <div className="flex items-center gap-4">
                            <span className={`text-lg font-semibold ${isLightMode ? "text-black" : "text-white"}`}>
                              {(getTotalDistanceAndDuration().distance / 1000).toFixed(1)} km
                            </span>
                            <span className={`text-lg font-semibold ${isLightMode ? "text-black" : "text-white"}`}>
                              {formatDuration(getTotalDistanceAndDuration().duration)}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
                            Through {route.landmarks.length} landmarks
                          </p>
                        </div>
                        <button
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors"
                          onClick={() => {
                            if (canStartNavigation()) {
                              handleStartNavigation()
                            }
                          }}
                          disabled={!canStartNavigation()}
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Landmark Image */}
                {route.landmarks[activeLandmark || 0] && (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4">
                    <LandmarkGallery
                      images={getLandmarkImages(route.landmarks[activeLandmark || 0] as any)}
                      alt={route.landmarks[activeLandmark || 0].name}
                    />
                  </div>
                )}

                {/* Description */}
                {route.landmarks[activeLandmark || 0] && (
                  <div className={`text-sm leading-relaxed ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                    {route.landmarks[activeLandmark || 0].description ||
                      "A breathtaking photorealistic depiction of the Statue of Zeus at Olympia under a midday sun, surrounded by ancient Greek ruins and olive trees, golden light illuminating the massive marble statue, clear blue sky, ultra-detailed, 4K resolution, wide aspect ratio simila"}
                  </div>
                )}

                {/* Info blocks */}
                {getInfoBlockBetweenLandmarks(1)}

                {geolocationError && (
                  <div className="mt-4 bg-red-600/90 text-white p-3 rounded-lg border border-red-500/50">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">{geolocationError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* External Link Warning Modal */}
        {externalLinkWarning.show && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#18181c] rounded-lg border border-[#27272f] p-6 max-w-md w-full">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">External Link</h3>
                  <p className="text-gray-300 text-sm">
                    You are about to leave the app and visit an external website. Continue?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 bg-[#27272f] hover:bg-[#323240] text-white rounded-lg transition-colors"
                  onClick={closeExternalLinkWarning}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-[#EF4444] hover:bg-[#5855eb] text-white rounded-lg transition-colors"
                  onClick={proceedToExternalLink}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
