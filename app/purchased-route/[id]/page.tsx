"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Clock,
  Map,
  X,
  ChevronLeft,
  ChevronRight,
  Coffee,
  DollarSign,
  Baby,
  Thermometer,
  Star,
  Mountain,
  RouteIcon as Road,
  Play,
  MapPin,
  Award,
  User,
  MessageSquare,
  Plane,
  Hotel,
  Bus,
  Shield,
  Wallet,
  Utensils,
} from "lucide-react"
import { routes } from "@/data/routes"
import UserMenu from "@/components/user-menu"
import { getUserByNickname, type User as UserType } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import { useParams } from "next/navigation"
import { getReviewsForRoute, getAverageRating, getReviewCount, type Review } from "@/data/reviews"

// Mapbox imports
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoidjBkZXYiLCJhIjoiY20yNWJqZGNzMDFnZzJrcHo4aWVhZGNwZCJ9.VJJBmkR8R_PJKJOOGJhJhQ"

declare global {
  interface Window {
    mapboxgl: any
  }
}

export default function PurchasedRoutePage() {
  const params = useParams()
  const routeId = params.id as string
  console.log("Route ID received from URL params:", routeId)
  // FIX: Use .find() to get the route by its 'id' property (string comparison)
  const route = routes.find((r) => r.id === routeId) || routes[0] // Fallback to first route if not found
  console.log("Found route ID:", route.id)
  const [authorAvatar, setAuthorAvatar] = useState("/default-avatar.webp")
  const [authorData, setAuthorData] = useState<UserType | null>(null)
  const [showAuthorTooltip, setShowAuthorTooltip] = useState(false)
  const authorTooltipRef = useRef<HTMLDivElement>(null)
  const authorAvatarRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  // Reviews state
  const [routeReviews, setRouteReviews] = useState<Review[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)

  // New state for active tab
  const [activeTab, setActiveTab] = useState("preview") // 'preview' or 'tips'

  useEffect(() => {
    const author = getUserByNickname(route.author)
    if (author) {
      setAuthorData(author)
      if (author.avatar) {
        setAuthorAvatar(author.avatar)
      }
    }

    // Load reviews for this route
    const reviews = getReviewsForRoute(Number.parseInt(routeId))
    setRouteReviews(reviews)
  }, [route.author, routeId])

  // Handle clicks outside the tooltip to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authorTooltipRef.current &&
        !authorTooltipRef.current.contains(event.target as Node) &&
        authorAvatarRef.current &&
        !authorAvatarRef.current.contains(event.target as Node)
      ) {
        setShowAuthorTooltip(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Function to get initial map coordinates based on route
  const getInitialMapCoordinates = () => {
    // First, try to use landmark coordinates if available
    if (route.landmarks && route.landmarks.length > 0) {
      const landmarkWithCoords = route.landmarks.find((landmark) => landmark.coordinates)
      if (landmarkWithCoords && landmarkWithCoords.coordinates) {
        return {
          center: landmarkWithCoords.coordinates,
          zoom: 11,
        }
      }
    }

    // Fallback to predefined coordinates based on route location
    const locationCoordinates: { [key: string]: { center: [number, number]; zoom: number } } = {
      "Berlin, Germany": { center: [13.405, 52.52], zoom: 10 },
      "Tokyo, Japan": { center: [139.6917, 35.6895], zoom: 10 },
      Iceland: { center: [-19.0208, 64.9631], zoom: 5.5 },
      "London, UK": { center: [-0.1276, 51.5074], zoom: 10 },
      "Venice, Italy": { center: [12.3155, 45.4408], zoom: 11 },
      "Paris, France": { center: [2.3522, 48.8566], zoom: 10 },
      "New York, USA": { center: [-74.006, 40.7128], zoom: 10 },
      "Rome, Italy": { center: [12.4964, 41.9028], zoom: 10 },
    }

    // Try to match route location with predefined coordinates
    const locationKey = Object.keys(locationCoordinates).find((key) =>
      route.location.toLowerCase().includes(key.toLowerCase().split(",")[0]),
    )

    if (locationKey) {
      return locationCoordinates[locationKey]
    }

    // Ultimate fallback to Paris
    return {
      center: [2.3522, 48.8566] as [number, number],
      zoom: 10,
    }
  }

  // Load Mapbox on component mount
  useEffect(() => {
    const loadMapbox = () => {
      if (window.mapboxgl) {
        setMapboxLoaded(true)
        return
      }

      // Load Mapbox CSS
      const cssLink = document.createElement("link")
      cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css"
      cssLink.rel = "stylesheet"
      document.head.appendChild(cssLink)

      // Load Mapbox JS
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

  // Function to draw route between landmarks
  const drawRoute = async (mapInstance: any, coordinates: number[][]) => {
    if (coordinates.length < 2) return

    try {
      // Use walking transport mode for route calculation
      const transport = "walking"
      const coordsString = coordinates.map((coord) => coord.join(",")).join(";")

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transport}/${coordsString}?geometries=geojson&access_token=${window.mapboxgl.accessToken}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry

        // Add route source and layer
        if (mapInstance.getSource("route")) {
          mapInstance.getSource("route").setData({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: routeGeometry,
              },
            ],
          })
        } else {
          mapInstance.addSource("route", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: routeGeometry,
                },
              ],
            },
          })

          mapInstance.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#6366f1",
              "line-width": 4,
            },
          })
        }
      } else {
        console.error("No route data:", data)
      }
    } catch (error) {
      console.error("Error drawing route:", error)
    }
  }

  // Initialize map when Mapbox is loaded
  useEffect(() => {
    if (!mapboxLoaded || !mapContainerRef.current || activeTab !== "preview") {
      // Only initialize map if preview tab is active
      return
    }

    let isMounted = true
    let mapInstance: any = null

    const initializeMap = async () => {
      try {
        // Ensure Mapbox is available
        if (!window.mapboxgl) {
          console.error("Mapbox GL JS not loaded")
          return
        }

        // Set access token
        window.mapboxgl.accessToken =
          "pk.eyJ1IjoiYmF6YW5hdG8iLCJhIjoiY21iaG5nYzR2MDlsNDJqcXR6NXhteGtpNyJ9.907YOUqyr2kGlztIWsiI7g"

        if (!window.mapboxgl.accessToken) {
          console.error("Mapbox API key is missing!")
          return
        }

        // Ensure the container is empty and available
        const container = mapContainerRef.current
        if (!container || !isMounted) {
          return
        }

        // Clear container
        container.innerHTML = ""

        // Get initial coordinates for this route
        const initialCoords = getInitialMapCoordinates()

        // Create map instance with route-specific coordinates
        mapInstance = new window.mapboxgl.Map({
          container: container,
          style: "mapbox://styles/mapbox/streets-v11",
          center: initialCoords.center,
          zoom: initialCoords.zoom,
          attributionControl: false,
          interactive: true, // Enable interactions for purchased routes
        })

        mapInstance.on("load", () => {
          if (!isMounted) {
            try {
              mapInstance.remove()
            } catch (e) {
              console.warn("Error removing map on unmount:", e)
            }
            return
          }
          console.log("Map loaded successfully")

          // Add markers for route landmarks if they exist
          if (route.landmarks && route.landmarks.length > 0) {
            const landmarksWithCoords = route.landmarks.filter((landmark) => landmark.coordinates)

            landmarksWithCoords.forEach((landmark, index) => {
              if (landmark.coordinates) {
                // Create marker for each landmark
                const marker = new window.mapboxgl.Marker({
                  color: "#6366f1",
                })
                  .setLngLat(landmark.coordinates)
                  .addTo(mapInstance)
              }
            })

            // If there are landmarks with coordinates, fit the map to show all of them
            if (landmarksWithCoords.length > 0) {
              const bounds = new window.mapboxgl.LngLatBounds()
              landmarksWithCoords.forEach((landmark) => {
                if (landmark.coordinates) {
                  bounds.extend(landmark.coordinates)
                }
              })

              // Fit map to show all landmarks
              mapInstance.fitBounds(bounds, {
                padding: 65,
                maxZoom: 12,
              })

              // Draw route connecting all landmarks if there are 2 or more
              if (landmarksWithCoords.length >= 2 && route.routeType === "route") {
                const coordinates = landmarksWithCoords.map((landmark) => landmark.coordinates!).filter(Boolean)

                // Wait a bit for the map to finish loading before drawing the route
                setTimeout(() => {
                  if (isMounted) {
                    drawRoute(mapInstance, coordinates)
                  }
                }, 1000)
              }
            }
          }
        })

        mapInstance.on("error", (e: any) => {
          console.error("Mapbox error:", e.error)
        })
      } catch (error) {
        console.error("Map initialization error:", error)
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      isMounted = false
      if (mapInstance) {
        try {
          mapInstance.remove()
        } catch (e) {
          console.warn("Error removing map on cleanup:", e)
        }
      }
    }
  }, [mapboxLoaded, route.landmarks, route.location, activeTab]) // Re-run when activeTab changes

  // Adding additional data for the route
  const routeExtendedInfo = {
    category: "walking tour",
    paidAttractions: true,
    foodOptions: true,
    familyFriendly: true,
    bestSeason: "spring-summer",
    rating: 4.8,
    surface: "mixed",
    elevation: "50m",
    price: "Purchased",
  }

  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [descriptionModalOpen, setDescriptionOpenModal] = useState(false)

  // Function to open gallery
  const openGallery = () => {
    setGalleryOpen(true)
    document.body.style.overflow = "hidden"
  }

  // Function to close gallery
  const closeGallery = () => {
    setGalleryOpen(false)
    document.body.style.overflow = "auto"
  }

  // Function to open details modal
  const openDetailsModal = () => {
    setDetailsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  // Function to close details modal
  const closeDetailsModal = () => {
    setDetailsModalOpen(false)
    document.body.style.overflow = "auto"
  }

  // Function to open description modal
  const openDescriptionModal = () => {
    setDescriptionOpenModal(true)
    document.body.style.overflow = "hidden"
  }

  // Function to close description modal
  const closeDescriptionModal = () => {
    setDescriptionOpenModal(false)
    document.body.style.overflow = "auto"
  }

  // Function to switch to next image in gallery
  const nextGalleryImage = () => {
    setCurrentGalleryImage((prev) => (prev + 1) % route.gallery.length)
  }

  // Function to switch to previous image in gallery
  const prevGalleryImage = () => {
    setCurrentGalleryImage((prev) => (prev - 1 + route.gallery.length) % route.gallery.length)
  }

  // Function to get difficulty icon
  const getDifficultyIcon = () => {
    switch (route.difficulty) {
      case "легкая":
      case "easy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12L8 8L12 12L16 8L20 12" />
          </svg>
        )
      case "средняя":
      case "medium":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 16L8 12L12 16L16 12L20 16" />
          </svg>
        )
      case "сложная":
      case "hard":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 20L8 16L12 20L16 16L20 20" />
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 14 4-4"></path>
            <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
          </svg>
        )
    }
  }

  // Function to get route type icon
  const getTypeIcon = () => {
    switch (route.type) {
      case "пеший":
      case "walking":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="4" r="2" />
            <path d="M10 16L10 8L14 8L14 16" />
            <path d="M10 20L8 22" />
            <path d="M14 20L16 22" />
            <path d="M10 16L14 16" />
            <path d="M10 12L14 12" />
          </svg>
        )
      case "автодом":
      case "camper":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 11L19 11" />
            <path d="M7 5L17 5L19 11L5 11L7 5Z" />
            <circle cx="7.5" cy="14.5" r="1.5" />
            <circle cx="16.5" cy="14.5" r="1.5" />
            <path d="M3 11L3 17L5 17L5 19L8 19L8 17L16 17L16 19L19 19L19 17L21 17L21 11" />
          </svg>
        )
      case "поход":
      case "hiking":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3L4 15L12 9L16 15L14 18" />
            <path d="M14 3L20 15L17 15" />
            <path d="M4 15L20 15" />
            <path d="M4 19L20 19" />
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="4" r="2" />
            <path d="M10 16L10 8L14 8L14 16" />
            <path d="M10 20L8 22" />
            <path d="M14 20L16 22" />
            <path d="M10 16L14 16" />
            <path d="M10 12L14 12" />
          </svg>
        )
    }
  }

  // Function to get what you will see based on route ID
  const getWhatYouWillSee = (currentRouteId: string) => {
    // Note: This data is currently limited and hardcoded for a few routes.
    // For a full implementation, this data should be dynamic and comprehensive for all routes.
    const whatYouWillSeeData: { [key: number]: { type: string; name: string }[] } = {
      0: [
        // Corresponds to route.id "1" (Prague)
        { type: "monuments", name: "Historical monuments" },
        { type: "architecture", name: "Architectural masterpieces" },
        { type: "photo", name: "Scenic viewpoints" },
        { type: "food", name: "Local eateries" },
        { type: "history", name: "Ancient history" },
      ],
      1: [
        // Corresponds to route.id "2" (Berlin)
        { type: "murals", name: "Murals" },
        { type: "monuments", name: "Monuments" },
        { type: "art-objects", name: "Art objects" },
        { type: "graffiti", name: "Graffiti" },
        { type: "galleries", name: "Modern art galleries" },
      ],
      2: [
        // Corresponds to route.id "3" (Tokyo)
        { type: "temples", name: "Temples and shrines" },
        { type: "gardens", name: "Traditional gardens" },
        { type: "museums", name: "Cultural museums" },
        { type: "markets", name: "Traditional markets" },
        { type: "architecture", name: "Modern architecture" },
      ],
      3: [
        // Corresponds to route.id "4" (Iceland)
        { type: "nature", name: "Natural monuments" },
        { type: "waterfalls", name: "Waterfalls" },
        { type: "geysers", name: "Geysers" },
        { type: "landscapes", name: "Landscapes" },
        { type: "wildlife", name: "Wildlife" },
      ],
      4: [
        // Corresponds to route.id "5" (London)
        { type: "monuments", name: "Historical monuments" },
        { type: "museums", name: "Classic galleries" },
        { type: "theaters", name: "Theaters" },
        { type: "architecture", name: "Architectural monuments" },
        { type: "parks", name: "Royal parks" },
      ],
      5: [
        // Corresponds to route.id "6" (New York)
        { type: "architecture", name: "Iconic Skyscrapers" },
        { type: "parks", name: "Urban Parks" },
        { type: "attraction", name: "Famous Landmarks" },
        { type: "photo", name: "City Views" },
        { type: "shopping", name: "Shopping Districts" },
      ],
      6: [
        // Corresponds to route.id "7" (Switzerland)
        { type: "mountains", name: "Alpine Mountains" },
        { type: "lakes", name: "Crystal Lakes" },
        { type: "hiking", name: "Mountain Trails" },
        { type: "photo", name: "Panoramic Views" },
        { type: "villages", name: "Charming Villages" },
      ],
      7: [
        // Corresponds to route.id "8" (Berlin 2)
        { type: "murals", name: "Street Art" },
        { type: "history", name: "Historical Sites" },
        { type: "culture", name: "Alternative Culture" },
        { type: "food", name: "Local Cuisine" },
        { type: "architecture", name: "Modern Architecture" },
      ],
      8: [
        // Corresponds to route.id "9" (Venice)
        { type: "architecture", name: "Venetian Architecture" },
        { type: "bridges", name: "Historical Bridges" },
        { type: "squares", name: "Piazzas" },
        { type: "churches", name: "Basilicas and Churches" },
        { type: "canals", name: "Canals" },
      ],
      9: [
        // Corresponds to route.id "10" (Manhattan)
        { type: "attraction", name: "Iconic Landmarks" },
        { type: "parks", name: "Green Spaces" },
        { type: "architecture", name: "Skyscrapers" },
        { type: "photo", name: "Cityscapes" },
        { type: "food", name: "Street Food" },
      ],
      10: [
        // Corresponds to route.id "11" (Rome)
        { type: "history", name: "Ancient Ruins" },
        { type: "attraction", name: "Famous Fountains" },
        { type: "churches", name: "Historic Churches" },
        { type: "art", name: "Renaissance Art" },
        { type: "food", name: "Italian Cuisine" },
      ],
      11: [
        // Corresponds to route.id "12" (Barcelona)
        { type: "architecture", name: "Gaudí Masterpieces" },
        { type: "parks", name: "Unique Parks" },
        { type: "beaches", name: "City Beaches" },
        { type: "history", name: "Gothic Quarter" },
        { type: "food", name: "Tapas" },
      ],
      12: [
        // Corresponds to route.id "13" (Bangkok)
        { type: "temples", name: "Majestic Temples" },
        { type: "markets", name: "Vibrant Markets" },
        { type: "food", name: "Street Food" },
        { type: "culture", name: "Thai Culture" },
        { type: "nightlife", name: "Lively Streets" },
      ],
      13: [
        // Corresponds to route.id "14" (London 2)
        { type: "history", name: "Royal Palaces" },
        { type: "monuments", name: "Historic Towers" },
        { type: "churches", name: "Grand Cathedrals" },
        { type: "rivers", name: "Thames Views" },
        { type: "museums", name: "World-class Museums" },
      ],
      14: [
        // Corresponds to route.id "15" (Cape Town)
        { type: "mountains", name: "Table Mountain" },
        { type: "coastline", name: "Stunning Coastline" },
        { type: "wildlife", name: "Penguin Colonies" },
        { type: "nature", name: "Botanical Gardens" },
        { type: "photo", name: "Scenic Drives" },
      ],
      15: [
        // Corresponds to route.id "16" (Mexico City Food)
        { type: "food", name: "Authentic Tacos" },
        { type: "food", name: "Churros" },
        { type: "markets", name: "Local Markets" },
        { type: "food", name: "Exotic Delicacies" },
        { type: "drinks", name: "Fresh Juices" },
      ],
      16: [
        // Corresponds to route.id "17" (New York Food)
        { type: "food", name: "Classic Delis" },
        { type: "food", name: "Food Trucks" },
        { type: "markets", name: "Food Markets" },
        { type: "food", name: "Ethnic Cuisine" },
        { type: "desserts", name: "Famous Bakeries" },
      ],
      17: [
        // Corresponds to route.id "18" (Naples Food)
        { type: "food", name: "Neapolitan Pizza" },
        { type: "food", name: "Street Snacks" },
        { type: "history", name: "Historic Streets" },
        { type: "churches", name: "Cathedrals" },
        { type: "castles", name: "Ancient Castles" },
      ],
      18: [
        // Corresponds to route.id "19" (Tokyo Food)
        { type: "food", name: "Ramen Shops" },
        { type: "food", name: "Sushi Bars" },
        { type: "food", name: "Izakayas" },
        { type: "markets", name: "Seafood Markets" },
        { type: "nightlife", name: "Lively Alleys" },
      ],
      19: [
        // Corresponds to route.id "20" (Istanbul Food)
        { type: "markets", name: "Grand Bazaars" },
        { type: "food", name: "Kebabs" },
        { type: "food", name: "Turkish Sweets" },
        { type: "history", name: "Historic Mosques" },
        { type: "attraction", name: "Bosphorus Views" },
      ],
      20: [
        // Corresponds to route.id "21" (Santorini Photo)
        { type: "photo", name: "Blue Domes" },
        { type: "photo", name: "Sunset Views" },
        { type: "architecture", name: "Cycladic Architecture" },
        { type: "nature", name: "Volcanic Landscapes" },
        { type: "beaches", name: "Unique Beaches" },
      ],
      21: [
        // Corresponds to route.id "22" (New York Photo)
        { type: "photo", name: "Times Square" },
        { type: "photo", name: "Brooklyn Bridge" },
        { type: "architecture", name: "Iconic Buildings" },
        { type: "culture", name: "Vibrant Neighborhoods" },
        { type: "parks", name: "Urban Green Spaces" },
      ],
      22: [
        // Corresponds to route.id "23" (Kyoto Photo)
        { type: "temples", name: "Ancient Temples" },
        { type: "gardens", name: "Zen Gardens" },
        { type: "photo", name: "Bamboo Groves" },
        { type: "culture", name: "Geisha Districts" },
        { type: "shrines", name: "Torii Gates" },
      ],
      23: [
        // Corresponds to route.id "24" (Rio Photo)
        { type: "beaches", name: "Famous Beaches" },
        { type: "mountains", name: "Sugarloaf Mountain" },
        { type: "monuments", name: "Christ the Redeemer" },
        { type: "photo", name: "Panoramic City Views" },
        { type: "art", name: "Street Art" },
      ],
      24: [
        // Corresponds to route.id "25" (Paris Photo)
        { type: "photo", name: "Eiffel Tower" },
        { type: "photo", name: "Seine River" },
        { type: "food", name: "Charming Cafes" },
        { type: "architecture", name: "Historic Bridges" },
        { type: "museums", name: "Art Museums" },
      ],
      25: [
        // Corresponds to route.id "26" (Iceland RV)
        { type: "nature", name: "Geothermal Areas" },
        { type: "waterfalls", name: "Majestic Waterfalls" },
        { type: "beaches", name: "Black Sand Beaches" },
        { type: "nature", name: "Volcanic Landscapes" },
        { type: "photo", name: "Dramatic Scenery" },
      ],
      26: [
        // Corresponds to route.id "27" (Switzerland RV)
        { type: "mountains", name: "Alpine Passes" },
        { type: "lakes", name: "Scenic Lakes" },
        { type: "villages", name: "Charming Villages" },
        { type: "photo", name: "Panoramic Mountain Views" },
        { type: "nature", name: "Glaciers" },
      ],
      27: [
        // Corresponds to route.id "28" (Norway RV)
        { type: "nature", name: "Stunning Fjords" },
        { type: "photo", name: "Northern Lights" },
        { type: "villages", name: "Picturesque Villages" },
        { type: "nature", name: "Coastal Landscapes" },
        { type: "attraction", name: "Arctic Cities" },
      ],
      28: [
        // Corresponds to route.id "29" (Morocco RV)
        { type: "nature", name: "Desert Dunes" },
        { type: "history", name: "Ancient Kasbahs" },
        { type: "nature", name: "Lush Oases" },
        { type: "nature", name: "Dramatic Gorges" },
        { type: "culture", name: "Vibrant Markets" },
      ],
      29: [
        // Corresponds to route.id "30" (Australia RV)
        { type: "beaches", name: "Iconic Beaches" },
        { type: "nature", name: "Vast Outback" },
        { type: "nature", name: "National Parks" },
        { type: "photo", name: "Coastal Drives" },
        { type: "attraction", name: "City Landmarks" },
      ],
      30: [
        // Corresponds to route.id "31" (Costa Rica Hiking)
        { type: "nature", name: "Rainforests" },
        { type: "nature", name: "Active Volcanoes" },
        { type: "wildlife", name: "Exotic Wildlife" },
        { type: "nature", name: "Waterfalls" },
        { type: "parks", name: "National Parks" },
      ],
      31: [
        // Corresponds to route.id "32" (Patagonia Hiking)
        { type: "mountains", name: "Iconic Peaks" },
        { type: "nature", name: "Glaciers" },
        { type: "lakes", name: "Emerald Lakes" },
        { type: "hiking", name: "Challenging Treks" },
        { type: "photo", name: "Breathtaking Landscapes" },
      ],
      32: [
        // Corresponds to route.id "33" (Dolomites Hiking)
        { type: "mountains", name: "Alpine Peaks" },
        { type: "lakes", name: "Pristine Lakes" },
        { type: "hiking", name: "Via Ferrata Routes" },
        { type: "photo", name: "Unique Rock Formations" },
        { type: "villages", name: "Mountain Villages" },
      ],
      33: [
        // Corresponds to route.id "34" (Nepal Hiking)
        { type: "mountains", name: "Himalayan Views" },
        { type: "culture", name: "Local Villages" },
        { type: "nature", name: "Terraced Fields" },
        { type: "hiking", name: "Trekking Trails" },
        { type: "photo", name: "Sunrise Panoramas" },
      ],
      34: [
        // Corresponds to route.id "35" (New Zealand Hiking)
        { type: "nature", name: "Stunning Fjords" },
        { type: "nature", name: "Pristine Wilderness" },
        { type: "waterfalls", name: "Cascading Waterfalls" },
        { type: "hiking", name: "Great Walks" },
        { type: "lakes", name: "Crystal-clear Lakes" },
      ],
      35: [
        // Corresponds to route.id "36" (Copenhagen Food)
        { type: "food", name: "Cozy Cafes" },
        { type: "food", name: "Artisan Bakeries" },
        { type: "food", name: "Charming Bistros" },
        { type: "food", name: "Acclaimed Restaurants" },
        { type: "food", name: "Local Delicacies" },
      ],
    }

    // Convert string ID to a 0-based index for the hardcoded data
    const index = Number.parseInt(currentRouteId) - 1

    // Return data for the specific index, or fallback to the first entry (index 0) if not found
    return whatYouWillSeeData[index] || whatYouWillSeeData[0]
  }

  // Function to get place type icon
  const getPlaceTypeIcon = (type: string) => {
    const iconSize = 18

    switch (type) {
      case "murals":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
        )
      case "monuments":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 20h12l-6-14-6 14z" />
            <path d="M8 20h8" />
            <path d="M12 6V2" />
          </svg>
        )
      case "art-objects":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )
      case "graffiti":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
        )
      case "galleries":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <rect x="7" y="7" width="3" height="3" />
            <rect x="14" y="7" width="3" height="3" />
            <rect x="7" y="14" width="10" height="3" />
          </svg>
        )
      case "temples":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l8 5v13H4V8l8-5z" />
            <path d="M12 11v10" />
            <path d="M8 15h8" />
          </svg>
        )
      case "gardens":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      case "museums":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9v4" />
            <path d="M15 13v4" />
          </svg>
        )
      case "markets":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 8h10l4 5.5-4 5.5H7l-4-5.5L7 8z" />
            <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          </svg>
        )
      case "architecture":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
          </svg>
        )
      case "nature":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      case "waterfalls":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20" />
            <path d="M8 6l4 4 4-4" />
            <path d="M8 14l4 4 4-4" />
          </svg>
        )
      case "geysers":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22v-8.39a2 2 0 0 0-1.4-1.9l-6.6-2.2a1 1 0 0 1-.6-.8L2 3" />
            <path d="M12 8v4" />
            <path d="M16 4l-4 4" />
            <path d="M20 8l-4-4" />
          </svg>
        )
      case "landscapes":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        )
      case "wildlife":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        )
      case "theaters":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path d="M12 1v6" />
            <path d="M12 17v6" />
            <path d="M3 12h6" />
            <path d="M15 12h6" />
          </svg>
        )
      case "parks":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      case "bridges":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18" />
            <path d="M3 18h18" />
            <path d="M6 12v6" />
            <path d="M12 12v6" />
            <path d="M18 12v6" />
          </svg>
        )
      case "squares":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <path d="M9 9h6v6H9z" />
          </svg>
        )
      case "churches":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l4 4v14H8V7l4-4z" />
            <path d="M12 7v6" />
            <path d="M9 10h6" />
          </svg>
        )
      case "canals":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18" />
            <path d="M12 2v20" />
            <path d="M8 8l8 8" />
            <path d="M16 8l-8 8" />
          </svg>
        )
      case "photo":
        return <Image src="/route-icon.png" alt="Photo icon" width={iconSize} height={iconSize} />
      case "food":
        return <Utensils size={iconSize} />
      case "history":
        return <Map size={iconSize} />
      case "culture":
        return <Award size={iconSize} />
      case "shopping":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        )
      case "nightlife":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      case "mountains":
        return <Mountain size={iconSize} />
      case "lakes":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
            <path d="M10 17V6.5a2.5 2.5 0 0 1 5 0V17" />
            <path d="M12 22a2 2 0 0 0 2-2v-1.662a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2V20a2 2 0 0 0 2 2Z" />
          </svg>
        )
      case "hiking":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3L4 15L12 9L16 15L14 18" />
            <path d="M14 3L20 15L17 15" />
            <path d="M4 15L20 15" />
            <path d="M4 19L20 19" />
          </svg>
        )
      case "villages":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 20h20" />
            <path d="M6 16V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
            <path d="M12 16v6" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
          </svg>
        )
      case "coastline":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 6H3" />
            <path d="M16 12H3" />
            <path d="M16 18H3" />
            <path d="M21 12a3 3 0 0 0-3-3h-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3h2a3 3 0 0 0 3-3Z" />
          </svg>
        )
      case "beaches":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
            <path d="M12 18a6 6 0 0 0 0-12" />
            <path d="M12 18a6 6 0 0 1 0-12" />
          </svg>
        )
      case "rivers":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12h20" />
            <path d="M12 2v20" />
            <path d="M8 8l8 8" />
            <path d="M16 8l-8 8" />
          </svg>
        )
      case "castles":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 20h20" />
            <path d="M6 16V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
            <path d="M12 16v6" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
          </svg>
        )
      case "desserts":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
            <path d="M12 18a6 6 0 0 0 0-12" />
            <path d="M12 18a6 6 0 0 1 0-12" />
          </svg>
        )
      case "drinks":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
            <path d="M12 18a6 6 0 0 0 0-12" />
            <path d="M12 18a6 6 0 0 1 0-12" />
          </svg>
        )
      case "restaurants":
        return <Utensils size={iconSize} />
      case "cafes":
        return <Coffee size={iconSize} />
      case "street-food":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
            <path d="M12 18a6 6 0 0 0 0-12" />
            <path d="M12 18a6 6 0 0 1 0-12" />
          </svg>
        )
      default:
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        )
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black border-b border-[#1a1a1a]">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-[40px]">
            <Image src="/logo.png" alt="Logo" width={73} height={40} />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector was here */}

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-[1300px] mx-auto px-4 pt-24">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/my-collection" className="text-gray-400 hover:text-white transition-colors underline">
            Back to my collection
          </Link>
        </div>

        {/* Title and author avatar */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-medium mb-1">{route.name}</h1>
            <p className="text-gray-400">{route.location}</p>
          </div>
          <div className="relative" ref={authorAvatarRef}>
            <div
              className="h-12 w-12 rounded-full overflow-hidden border border-[#27272f] cursor-pointer hover:border-[#6366f1] transition-colors"
              onMouseEnter={() => setShowAuthorTooltip(true)}
              onClick={() => setShowAuthorTooltip(!showAuthorTooltip)}
            >
              <Image
                src={authorAvatar || "/placeholder.svg"}
                alt="Author"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>

            {/* Author tooltip */}
            {showAuthorTooltip && authorData && (
              <div
                ref={authorTooltipRef}
                className="absolute right-0 mt-2 w-64 bg-[#2a2a30] rounded-lg shadow-xl border border-[#3a3a45] z-50 overflow-hidden animate-fadeIn"
                style={{
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="p-4">
                  {/* Author header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-[#3a3a45]">
                      <Image
                        src={authorData.avatar || "/placeholder.svg"}
                        alt={authorData.nickname}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">{authorData.nickname}</div>
                      <div className="text-xs text-gray-400">{authorData.userStatus}</div>
                    </div>
                  </div>

                  {/* Author stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin size={14} className="text-gray-400" />
                        <span>Countries visited</span>
                      </div>
                      <div className="font-medium">{authorData.visitedCountries}</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Award size={14} className="text-gray-400" />
                        <span>Rating</span>
                      </div>
                      <div className="font-medium flex items-center">
                        {authorData.rating || "N/A"}
                        {authorData.rating && <Star size={14} className="ml-1 text-yellow-400" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Map size={14} className="text-gray-400" />
                        <span>Routes created</span>
                      </div>
                      <div className="font-medium">{authorData.createdRoutes}</div>
                    </div>
                  </div>

                  {/* Profile button */}
                  <Link
                    href={`/profile/${authorData.nickname}`}
                    className="block w-full py-2 text-center bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-md font-medium hover:opacity-90 transition-opacity"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <User size={14} />
                      <span>Go to profile</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery with mobile carousel */}
        <div className="mb-8 relative border border-[#1a1a1a] rounded-xl bg-[#080809] md:h-[410px]">
          {/* Desktop version - original layout */}
          <div className="hidden md:flex flex-wrap h-full">
            {/* Large image on left (40%) */}
            <div className="w-[40%] h-full p-1.5">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]">
                {route.gallery && route.gallery.length > 0 && (
                  <Image src={`/${route.gallery[0]}`} alt={`${route.name} - image 1`} fill className="object-cover" />
                )}
              </div>
            </div>

            {/* Large image in middle (40%) */}
            <div className="w-[40%] h-full p-1.5">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]">
                {route.gallery && route.gallery.length > 1 && (
                  <Image src={`/${route.gallery[1]}`} alt={`${route.name} - image 2`} fill className="object-cover" />
                )}
              </div>
            </div>

            {/* Column with two small images on right (20%) */}
            <div className="w-[20%] h-full flex flex-col">
              {/* Small image on top */}
              <div className="h-1/2 p-1.5 pb-0.75">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]">
                  {route.gallery && route.gallery.length > 2 && (
                    <Image src={`/${route.gallery[2]}`} alt={`${route.name} - image 3`} fill className="object-cover" />
                  )}
                </div>
              </div>

              {/* Small image on bottom */}
              <div className="h-1/2 p-1.5 pt-0.75 relative">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]">
                  {route.gallery && route.gallery.length > 3 && (
                    <Image src={`/${route.gallery[3]}`} alt={`${route.name} - image 4`} fill className="object-cover" />
                  )}
                </div>

                {/* View all button */}
                <button
                  className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors"
                  onClick={openGallery}
                >
                  View all
                </button>
              </div>
            </div>
          </div>

          {/* Mobile version - carousel */}
          <div className="md:hidden relative">
            <div className="relative w-full md:p-1.5">
              <div
                className="relative w-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]"
                style={{ aspectRatio: "4/3" }}
              >
                {route.gallery && route.gallery.length > 0 && (
                  <Image
                    src={`/${route.gallery[currentImageIndex]}`}
                    alt={`${route.name} - image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Navigation arrows */}
              {route.gallery && route.gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev - 1 + route.gallery.length) % route.gallery.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/30 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % route.gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/30 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </>
              )}

              {/* Image counter for mobile */}
              {route.gallery && route.gallery.length > 1 && (
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-sm py-1 px-2 rounded-full border border-white/30">
                  {currentImageIndex + 1} / {route.gallery.length}
                </div>
              )}

              {/* View all button for mobile */}
              <button
                className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors"
                onClick={openGallery}
              >
                View all
              </button>
            </div>
          </div>
        </div>

        {/* Gradient divider line between gallery and information */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#27272f] to-transparent my-8"></div>

        {/* Tab Navigation */}
        <div className="flex justify-start mb-8">
          <div className="inline-flex rounded-full border border-[#27272f] bg-[#080809] p-1">
            <div className="relative">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                  activeTab === "tips" ? "bg-white text-black" : "text-gray-300 hover:bg-[#1a1a1a]"
                }`}
                onClick={() => setActiveTab("tips")}
              >
                Tips
              </button>
            </div>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === "preview" ? "bg-white text-black" : "text-gray-300 hover:bg-[#1a1a1a]"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Conditional Content Rendering */}
        {activeTab === "preview" && (
          <div className="space-y-8">
            {/* Main information - redesigned minimalist blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Overview */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] relative">
                <h3 className="text-lg font-medium mb-4 text-white">Overview</h3>
                <div className="space-y-3">
                  {[
                    { icon: getTypeIcon(), text: route.type },
                    {
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400 flex-shrink-0"
                        >
                          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                        </svg>
                      ),
                      text: routeExtendedInfo.category,
                    },
                    { icon: <Map size={16} className="text-gray-400 flex-shrink-0" />, text: `${route.points} points` },
                    { icon: <Clock size={16} className="text-gray-400 flex-shrink-0" />, text: route.duration },
                    { icon: getDifficultyIcon(), text: `${route.difficulty} difficulty` },
                    {
                      icon: <Star size={16} className="text-gray-400 flex-shrink-0" />,
                      text: `${routeExtendedInfo.rating}/5 rating`,
                    },
                  ]
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-300">
                        <div className="text-gray-400 flex-shrink-0">{item.icon}</div>
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ))}
                </div>
                {/* View all button */}
                <button
                  className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors"
                  onClick={openDetailsModal}
                >
                  View all
                </button>
              </div>

              {/* What you'll see */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] relative">
                <h3 className="text-lg font-medium mb-4 text-white">What you'll see</h3>
                <div className="space-y-3">
                  {getWhatYouWillSee(routeId) // Pass routeId directly
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-300">
                        <div className="text-gray-400 flex-shrink-0">{getPlaceTypeIcon(item.type)}</div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                </div>
                {/* View all button - only show if there are more than 5 items */}
                {getWhatYouWillSee(routeId).length > 5 && (
                  <button className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors">
                    View all
                  </button>
                )}
              </div>

              {/* Good to know */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] relative">
                <h3 className="text-lg font-medium mb-4 text-white">Good to know</h3>
                <div className="space-y-3">
                  {[
                    {
                      icon: <DollarSign size={16} className="text-gray-400 flex-shrink-0" />,
                      text: routeExtendedInfo.paidAttractions ? "Some paid attractions" : "No paid attractions",
                    },
                    {
                      icon: <Coffee size={16} className="text-gray-400 flex-shrink-0" />,
                      text: routeExtendedInfo.foodOptions ? "Food options available" : "No food options",
                    },
                    {
                      icon: <Baby size={16} className="text-gray-400 flex-shrink-0" />,
                      text: routeExtendedInfo.familyFriendly ? "Family friendly" : "Not family friendly",
                    },
                    {
                      icon: <Thermometer size={16} className="text-gray-400 flex-shrink-0" />,
                      text: `Best in ${routeExtendedInfo.bestSeason}`,
                    },
                  ]
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-300">
                        {item.icon}
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Description and Map - full width blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] relative">
                <h3 className="text-lg font-medium mb-4 text-white">Description</h3>
                <div className="text-gray-300 text-sm leading-relaxed overflow-hidden line-clamp-[12]">
                  {route.description}
                </div>

                {/* Read more button */}
                <button
                  className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors"
                  onClick={openDescriptionModal}
                >
                  Read more
                </button>
              </div>

              {/* Map */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] flex flex-col">
                <h3 className="text-lg font-medium mb-4 text-white">Map</h3>
                <div className="relative flex-1 rounded-lg overflow-hidden" style={{ minHeight: "300px" }}>
                  <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Gradient divider line between information and reviews */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#27272f] to-transparent my-8"></div>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-medium">Reviews</h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">({getReviewCount(Number.parseInt(routeId))})</span>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{getAverageRating(Number.parseInt(routeId))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {routeReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(showAllReviews ? routeReviews : routeReviews.slice(0, 4)).map((review) => (
                    <div key={review.id} className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a]">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white text-sm font-medium">
                            {review.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">{review.author}</div>
                            <div className="text-xs text-gray-400">{formatDate(review.date)}</div>
                          </div>
                        </div>
                        {renderStarRating(review.rating)}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#080809] rounded-xl p-8 border border-[#1a1a1a] text-center">
                  <MessageSquare size={48} className="mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-gray-400 text-sm">Be the first to share your experience with this route!</p>
                </div>
              )}

              {/* Show more/less button */}
              {routeReviews.length > 4 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="px-6 py-2 bg-[#080809] border border-[#1a1a1a] rounded-lg text-gray-300 hover:bg-[#18181c] transition-colors"
                  >
                    {showAllReviews ? "Show less" : `Show all ${routeReviews.length} reviews`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "tips" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Best Time to Visit */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a]">
                <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                  <Plane size={20} className="text-gray-400" />
                  Best Time to Visit
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The ideal time to visit {route.location.split(",")[0]} is during late spring (May-June) or early
                  autumn (September-October). The weather is pleasant, and the city is less crowded than in peak summer.
                </p>
              </div>
              {/* Accommodation Tips */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a]">
                <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                  <Hotel size={20} className="text-gray-400" />
                  Accommodation Tips
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Consider staying in Mitte for central access to attractions, Kreuzberg for vibrant nightlife, or
                  Prenzlauer Berg for a more relaxed, family-friendly atmosphere. Book in advance, especially during
                  festivals.
                </p>
              </div>
              {/* Local Transportation */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a]">
                <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                  <Bus size={20} className="text-gray-400" />
                  Local Transportation
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {route.location.split(",")[0]} has an excellent public transport system (U-Bahn, S-Bahn, trams,
                  buses). A Berlin WelcomeCard offers unlimited travel and discounts on attractions. Cycling is also a
                  popular way to explore.
                </p>
              </div>
              {/* Safety Tips */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a]">
                <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                  <Shield size={20} className="text-gray-400" />
                  Safety Tips
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {route.location.split(",")[0]} is generally safe, but be aware of pickpockets in crowded tourist
                  areas. Keep an eye on your belongings, especially on public transport. Emergency number is 112.
                </p>
              </div>
              {/* Currency & Payments */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a]">
                <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                  <Wallet size={20} className="text-gray-400" />
                  Currency & Payments
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The currency is the Euro (€). Credit and debit cards are widely accepted, but it's always good to
                  carry some cash for smaller shops or street vendors. Tipping is customary (5-10%).
                </p>
              </div>
              {/* Local Cuisine */}
              <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a]">
                <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                  <Utensils size={20} className="text-gray-400" />
                  Local Cuisine
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Don't miss trying local specialties like Currywurst, Döner Kebab, and Berliner Weisse. Explore local
                  markets for fresh produce and street food.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed start navigation bar at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
        <div
          className="w-full max-w-[700px] bg-[#121214] rounded-t-xl py-3 px-6 flex items-center justify-between"
          style={{
            boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.85)",
            borderTop: "1px solid #343440",
            borderLeft: "1px solid #343440",
            borderRight: "1px solid #343440",
          }}
        >
          <div className="text-xl font-medium">Purchased</div>
          <div className="flex gap-3">
            <Link
              href={route.routeType === "route" ? `/route-navigation/${routeId}` : `/list-navigation/${routeId}`}
              className="font-medium px-6 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Play size={18} />
              Open Map
            </Link>
          </div>
        </div>
      </div>

      {/* All modal windows */}
      {/* Gallery modal */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="w-full max-w-5xl mx-4 flex flex-col">
            {/* Title and close button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
              <h2 className="text-xl font-medium">Gallery</h2>
              <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeGallery}>
                <X size={24} />
              </button>
            </div>

            {/* Main image */}
            <div className="relative h-[70vh] my-4">
              {route.gallery && route.gallery.length > 0 && (
                <Image
                  src={`/${route.gallery[currentGalleryImage]}`}
                  alt={`${route.name} - image ${currentGalleryImage + 1}`}
                  fill
                  className="object-contain"
                />
              )}

              {/* Navigation buttons */}
              <button
                onClick={prevGalleryImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-black/50 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={nextGalleryImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-black/50 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center overflow-x-auto gap-2 py-4 px-2 custom-scrollbar max-w-3xl mx-auto">
              {route.gallery &&
                route.gallery.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      currentGalleryImage === index ? "border-white" : "border-transparent"
                    }`}
                    onClick={() => setCurrentGalleryImage(index)}
                  >
                    <div className="relative w-full h-full">
                      <Image src={`/${image}`} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                    </div>
                  </button>
                ))}
            </div>

            {/* Image counter */}
            <div className="text-center text-gray-400 py-2">
              {currentGalleryImage + 1} / {route.gallery ? route.gallery.length : 0}
            </div>
          </div>
        </div>
      )}

      {/* Route details modal */}
      {detailsModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="w-full max-w-4xl mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
            {/* Title and close button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
              <h2 className="text-xl font-medium">Detailed Information</h2>
              <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeDetailsModal}>
                <X size={24} />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Route type */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">{getTypeIcon()}</div>
                    <span className="text-sm text-gray-400">Route type</span>
                  </div>
                  <div className="font-medium text-white">{route.type}</div>
                </div>

                {/* Category */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400">Category</span>
                  </div>
                  <div className="font-medium text-white">{routeExtendedInfo.category}</div>
                </div>

                {/* Points count */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <Map size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Points</span>
                  </div>
                  <div className="font-medium text-white">{route.points}</div>
                </div>

                {/* Duration */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <Clock size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Duration</span>
                  </div>
                  <div className="font-medium text-white">{route.duration}</div>
                </div>

                {/* Difficulty */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">{getDifficultyIcon()}</div>
                    <span className="text-sm text-gray-400">Difficulty</span>
                  </div>
                  <div className="font-medium text-white">{route.difficulty}</div>
                </div>

                {/* Rating */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <Star size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Rating</span>
                  </div>
                  <div className="font-medium text-white">{routeExtendedInfo.rating} / 5</div>
                </div>

                {/* Paid attractions */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <DollarSign size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Paid attractions</span>
                  </div>
                  <div className="font-medium text-white">{routeExtendedInfo.paidAttractions ? "Yes" : "No"}</div>
                </div>

                {/* Food options */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <Coffee size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Places to eat</span>
                  </div>
                  <div className="font-medium text-white">
                    {routeExtendedInfo.foodOptions ? "Available" : "Not available"}
                  </div>
                </div>

                {/* Family friendly */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <Baby size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Family friendly</span>
                  </div>
                  <div className="font-medium text-white">
                    {routeExtendedInfo.familyFriendly ? "Suitable" : "Not suitable"}
                  </div>
                </div>

                {/* Best season */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <Thermometer size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Best season</span>
                  </div>
                  <div className="font-medium text-white">{routeExtendedInfo.bestSeason}</div>
                </div>

                {/* Surface */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <Road size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Surface</span>
                  </div>
                  <div className="font-medium text-white">{routeExtendedInfo.surface}</div>
                </div>

                {/* Elevation */}
                <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-gray-400">
                      <Mountain size={16} />
                    </div>
                    <span className="text-sm text-gray-400">Elevation</span>
                  </div>
                  <div className="font-medium text-white">{routeExtendedInfo.elevation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description modal */}
      {descriptionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100]">
          <div className="w-full max-w-2xl mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
            {/* Title and close button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
              <h2 className="text-xl font-medium">Route Description</h2>
              <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeDescriptionModal}>
                <X size={24} />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="text-gray-300 whitespace-pre-line">{route.description}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
