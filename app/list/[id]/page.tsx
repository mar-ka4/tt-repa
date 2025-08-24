"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Map, Globe, X, ChevronLeft, ChevronRight, Coffee, DollarSign, Baby, Thermometer, Star, Mountain, RouteIcon as Road, ShoppingCart, MapPin, Award, User, LogIn, Shield, Eye, Trash2, MessageSquare, Camera, Sparkles, Leaf, Users, Utensils, Waves, Landmark, Palette, Music, ShoppingBag, Footprints, Caravan, MountainIcon as Hiking, List, ImageIcon, Building, GalleryHorizontal, Church, Bird, Theater, BracketsIcon as Bridge, WallpaperIcon as Wall, History, Car, Sun, Snowflake, Home, Plane, Gauge, Play, Copy, Facebook, Send, MessageCircle, Check } from 'lucide-react'
import { routes } from "@/data/routes"
import UserMenu from "@/components/user-menu"
import { getUserByNickname, type User as UserType } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import { useParams, notFound } from "next/navigation"
import { getReviewsForRoute, getAverageRating, getReviewCount, type Review } from "@/data/reviews"
import MapPreviewCard from "@/components/map-preview-card" // New import
import type { Metadata } from "next"

// Mapbox imports
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoidjBkZXYiLCJhIjoiY20yNWJqZGNzMDFnZzJrcHo4aWVhZGNwZCJ9.VJJBmkR8R_PJKJGOGJhJhQ"

declare global {
interface Window {
mapboxgl: any
}
}

export default function RoutePage() {
const params = useParams()
const routeId = params.id as string
const route = routes.find((r) => r.id === routeId)

if (!route) {
notFound()
}

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

const [moderationModalOpen, setModerationModalOpen] = useState(false)
const [selectedModerationAction, setSelectedModerationAction] = useState<string>("")
const [moderationComment, setModerationComment] = useState<string>("")
const [routeModerationStatus, setRouteModerationStatus] = useState<"active" | "hidden" | "deleted">("active")

const [routeReviews, setRouteReviews] = useState<Review[]>([])
const [showAllReviews, setShowAllReviews] = useState(false)

const [userMenuOpen, setUserMenuOpen] = useState(false)
const [shareModalOpen, setShareModalOpen] = useState(false)
const [reportModalOpen, setReportModalOpen] = useState(false)
const [copiedLink, setCopiedLink] = useState(false); // New state for copy button

const routeExtendedInfo = {
paidAttractions: true,
foodOptions: true,
familyFriendly: true,
bestSeason: "spring-summer",
rating: 4.8,
surface: "mixed",
elevation: "50m",
price: route?.price || 0,
}

const [langMenuOpen, setLangMenuOpen] = useState(false)
const [currentLang, setCurrentLang] = useState("EN")
const [galleryOpen, setGalleryOpen] = useState(false)
const [currentGalleryImage, setCurrentGalleryImage] = useState(0)
const [detailsModalOpen, setDetailsModalOpen] = useState(false)
const [descriptionModalOpen, setDescriptionOpenModal] = useState(false)
const [buyButtonHover, setBuyButtonHover] = useState(false)
const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
const [loginRequiredModalOpen, setLoginRequiredModalOpen] = useState(false)
const [selectedPaymentOption, setSelectedPaymentOption] = useState<"onetime" | "subscription" | null>(null)

const languages = [
{ code: "EN", name: "English" },
{ code: "RU", name: "Русский" },
{ code: "DE", name: "Deutsch" },
{ code: "FR", name: "Français" },
{ code: "ES", name: "Español" },
{ code: "IT", name: "Italiano" },
{ code: "PT", name: "Português" },
]

useEffect(() => {
const author = route ? getUserByNickname(route.author) : null
if (author) {
setAuthorData(author)
if (author.avatar) {
setAuthorAvatar(author.avatar)
}
}

if (route) {
const reviews = getReviewsForRoute(route.id)
setRouteReviews(reviews)
}
}, [route?.id, route])

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

useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
if (userMenuOpen && !(event.target as Element).closest(".relative")) {
setUserMenuOpen(false)
}
}

document.addEventListener("mousedown", handleClickOutside)
return () => {
document.removeEventListener("mousedown", handleClickOutside)
}
}, [userMenuOpen])

const getInitialMapCoordinates = () => {
if (!route) {
return {
center: [2.3522, 48.8566] as [number, number],
zoom: 10,
}
}
if (route.landmarks && route.landmarks.length > 0) {
const landmarkWithCoords = route.landmarks.find((landmark) => landmark.coordinates)
if (landmarkWithCoords && landmarkWithCoords.coordinates) {
return {
center: landmarkWithCoords.coordinates,
zoom: 11,
}
}
}

const locationCoordinates: { [key: string]: { center: [number, number]; zoom: number } } = {
"Berlin, Germany": { center: [13.405, 52.52], zoom: 10 },
"Tokyo, Japan": { center: [139.6917, 35.6895], zoom: 10 },
Iceland: { center: [-19.0208, 64.9631], zoom: 5.5 },
"London, UK": { center: [-0.1276, 51.5074], zoom: 10 },
"Venice, Italy": { center: [12.3155, 45.4408], zoom: 11 },
"Paris, France": { center: [2.3522, 48.8566], zoom: 10 },
"New York, USA": { center: [-74.006, 40.7128], zoom: 10 },
"Rome, Italy": { center: [12.4964, 41.9028], zoom: 10 },
"Bangkok, Thailand": { center: [100.5018, 13.7563], zoom: 10 },
}

const locationKey = Object.keys(locationCoordinates).find((key) =>
route.location.toLowerCase().includes(key.toLowerCase().split(",")[0]),
)

if (locationKey) {
return locationCoordinates[locationKey]
}

return {
center: [2.3522, 48.8566] as [number, number],
zoom: 10,
}
}

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

const drawRoute = async (mapInstance: any, coordinates: number[][]) => {
if (coordinates.length < 2) return

try {
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

useEffect(() => {
if (!mapboxLoaded || !mapContainerRef.current || !route) {
return
}

let isMounted = true
let mapInstance: any = null

const initializeMap = async () => {
try {
if (!window.mapboxgl) {
console.error("Mapbox GL JS not loaded")
return
}

window.mapboxgl.accessToken =
"pk.eyJ1IjoiYmF6YW5hdG8iLCJhIjoiY21iaG5nYzR2MDlsNDJqcXR6NXhteGtpNyJ9.907YOUqyr2kGlztIWsiI7g"

if (!window.mapboxgl.accessToken) {
console.error("Mapbox API key is missing!")
return
}

const container = mapContainerRef.current
if (!container || !isMounted) {
return
}

container.innerHTML = ""

const initialCoords = getInitialMapCoordinates()

mapInstance = new window.mapboxgl.Map({
container: container,
style: "mapbox://styles/mapbox/streets-v11",
center: initialCoords.center,
zoom: initialCoords.zoom,
attributionControl: false,
interactive: false,
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

if (route.landmarks && route.landmarks.length > 0) {
  const landmarksWithCoords = route.landmarks.filter((landmark) => landmark.coordinates)

  landmarksWithCoords.forEach((landmark) => {
    if (landmark.coordinates && isMounted) {
      const markerElement = document.createElement("div")
      markerElement.className = "map-preview-marker"
      markerElement.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #EF4444; /* red */
    border: 2px solid #DC2626; /* darker red border */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -100%); /* align like in preview */
  `
      markerElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`

      new window.mapboxgl.Marker({ element: markerElement })
        .setLngLat(landmark.coordinates)
        .addTo(mapInstance)
    }
  })

  if (landmarksWithCoords.length > 0) {
    const bounds = new window.mapboxgl.LngLatBounds()
    landmarksWithCoords.forEach((landmark) => {
      if (landmark.coordinates) {
        bounds.extend(landmark.coordinates)
      }
    })

    mapInstance.fitBounds(bounds, {
      padding: 65,
      maxZoom: 12,
    })

    if (landmarksWithCoords.length >= 2 && route.routeType === "route") {
      const coordinates = landmarksWithCoords.map((landmark) => landmark.coordinates!).filter(Boolean)

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

return () => {
isMounted = false
if (mapInstance) {
try {
mapInstance.remove()
} catch (e) {
console.warn("Error removing map on unmount:", e)
}
}
}
}, [mapboxLoaded, route?.landmarks, route?.location, route])

const toggleLangMenu = () => {
setLangMenuOpen(!langMenuOpen)
}

const selectLanguage = (code: string) => {
setCurrentLang(code)
setLangMenuOpen(false)
}

const openGallery = () => {
setGalleryOpen(true)
document.body.style.overflow = "hidden"
}

const closeGallery = () => {
setGalleryOpen(false)
document.body.style.overflow = "auto"
}

const openDetailsModal = () => {
setDetailsModalOpen(true)
document.body.style.overflow = "hidden"
}

const closeDetailsModal = () => {
setDetailsModalOpen(false)
document.body.style.overflow = "auto"
}

const openDescriptionModal = () => {
setDescriptionOpenModal(true)
document.body.style.overflow = "hidden"
}

const closeDescriptionModal = () => {
setDescriptionOpenModal(false)
document.body.style.overflow = "auto"
}

const handlePurchase = () => {
if (!user) {
setLoginRequiredModalOpen(true)
document.body.style.overflow = "hidden"
return
}

setPurchaseModalOpen(true)
document.body.style.style.overflow = "hidden"
}

const closePurchaseModal = () => {
setPurchaseModalOpen(false)
document.body.style.overflow = "auto"
}

const closeLoginRequiredModal = () => {
setLoginRequiredModalOpen(false)
document.body.style.overflow = "auto"
}

const selectPaymentOption = (option: "onetime" | "subscription") => {
setSelectedPaymentOption(option)
}

const completePurchase = () => {
if (!selectedPaymentOption) return

alert(`Thank you for your ${selectedPaymentOption === "onetime" ? "one-time purchase" : "subscription"}!`)
closePurchaseModal()
}

const nextGalleryImage = () => {
setCurrentGalleryImage((prev) => (prev + 1) % (route?.gallery?.length || 1))
}

const prevGalleryImage = () => {
setCurrentGalleryImage((prev) => (prev - 1 + (route?.gallery?.length || 1)) % (route?.gallery?.length || 1))
}

const getDifficultyIcon = () => {
return <Gauge size={18} />
}

const getTypeIcon = () => {
const category = route?.categoryDisplay || ""
if (category === "Photo Tour") {
return <Camera size={18} />
}
switch (category) {
case "Romantic":
return <Sparkles size={18} />
case "Nature":
return <Leaf size={18} />
case "Family":
return <Users size={18} />
case "Gastronomy":
case "Food Tour":
return <Utensils size={18} />
case "PhotoSpots":
return <Camera size={18} />
case "Coastal":
return <Waves size={18} />
case "History":
return <Landmark size={18} />
case "Art":
return <Palette size={18} />
case "Music":
return <Music size={18} />
case "Shop":
return <ShoppingBag size={18} />
case "Adventure":
return <Mountain size={18} />
case "Culture":
return <Building size={18} />
default:
switch (route?.type) {
case "пеший":
case "walking":
  return <Footprints size={18} />
case "автодом":
case "camper":
  return <Caravan size={18} />
case "поход":
case "hiking":
  return <Hiking size={18} />
case "Photography":
  return <Camera size={18} />
case "list-type":
  return <List size={18} />
default:
  return <Map size={18} />
}
}
}

// Map simple labels to icon-friendly types used by getPlaceTypeIcon()
function mapLabelToType(label: string): string {
  const l = label.toLowerCase()

  if (l.includes("bridge")) return "bridges"
  if (l.includes("canal")) return "canals"
  if (l.includes("castle")) return "castle"
  if (l.includes("palace") || l.includes("palazzo")) return "palaces"
  if (l.includes("basilica") || l.includes("cathedral") || l.includes("church")) return "cathedrals"
  if (l.includes("temple") || l.includes("shrine") || l.includes("pagoda")) return "temples"
  if (l.includes("museum")) return "museums"
  if (l.includes("market")) return "food-markets"
  if (l.includes("park") || l.includes("garden") || l.includes("botanical")) return "parks"
  if (l.includes("lake")) return "alpine-lakes"
  if (l.includes("beach")) return "beaches"
  if (l.includes("fjord")) return "fjords"
  if (l.includes("glacier") || l.includes("lagoon")) return "glaciers"
  if (l.includes("waterfall")) return "waterfalls"
  if (l.includes("geyser") || l.includes("hot spring")) return "hot-springs"
  if (l.includes("volcano") || l.includes("crater") || l.includes("lava") || l.includes("rift")) return "volcanoes"
  if (l.includes("view") || l.includes("panorama") || l.includes("viewpoint")) return "viewpoints"
  if (l.includes("street art") || l.includes("graffiti") || l.includes("mural")) return "street-art"
  if (l.includes("square") || l.includes("piazza")) return "squares"
  if (l.includes("wildlife") || l.includes("penguin")) return "wildlife"
  if (l.includes("wine") || l.includes("bistro")) return "restaurants"
  if (l.includes("bakery") || l.includes("pastry")) return "bakeries"
  if (l.includes("coffee") || l.includes("espresso") || l.includes("roaster")) return "cafes"
  if (l.includes("deli")) return "delis"
  if (l.includes("food truck")) return "food-trucks"
  if (l.includes("ramen")) return "ramen"
  if (l.includes("sushi")) return "sushi"
  if (l.includes("izakaya")) return "izakayas"
  if (l.includes("night market") || l.includes("street food") || l.includes("food alley")) return "street-food"
  if (l.includes("blue dome")) return "blue-domes"
  if (l.includes("northern lights") || l.includes("aurora")) return "northern-lights"
  if (l.includes("skyline") || l.includes("skyscraper")) return "skyline"
  if (l.includes("island")) return "nature"
  if (l.includes("landmark") || l.includes("monument") || l.includes("gate") || l.includes("parliament")) return "monuments"

  return "photo-spots"
}

const getWhatYouWillSee = (routeId: string) => {
// Prefer data from DB (data/routes.ts) when available
if (route?.whatYoullSee && route.whatYoullSee.length > 0) {
  return route.whatYoullSee.map((label) => ({
    type: mapLabelToType(label),
    name: label,
  }))
}

const whatYouWillSeeData: { [key: string]: { type: string; name: string }[] } = {
"0": [ // Changed to use "0" as the default fallback key
{ type: "murals", name: "Murals" },
{ type: "monuments", name: "Monuments" },
{ type: "art-objects", name: "Art objects" },
{ type: "graffiti", name: "Graffiti" },
{ type: "galleries", name: "Modern art galleries" },
],
"1": [
{ type: "murals", name: "Murals" },
{ type: "monuments", name: "Monuments" },
{ type: "art-objects", name: "Art objects" },
{ type: "graffiti", name: "Graffiti" },
{ type: "galleries", name: "Modern art galleries" },
],
"2": [
{ type: "murals", name: "Murals" },
{ type: "monuments", name: "Monuments" },
{ type: "art-objects", name: "Art objects" },
{ type: "graffiti", name: "Graffiti" },
{ type: "galleries", name: "Modern art galleries" },
],
"3": [
{ type: "temples", name: "Temples and shrines" },
{ type: "gardens", name: "Traditional gardens" },
{ type: "museums", name: "Cultural museums" },
{ type: "markets", name: "Traditional markets" },
{ type: "architecture", name: "Modern architecture" },
],
"4": [
{ type: "nature", name: "Natural monuments" },
{ type: "waterfalls", name: "Waterfalls" },
{ type: "geysers", name: "Geysers" },
{ type: "landscapes", name: "Landscapes" },
{ type: "wildlife", name: "Wildlife" },
],
"5": [
{ type: "monuments", name: "Historical monuments" },
{ type: "museums", name: "Classic galleries" },
{ type: "theaters", name: "Theaters" },
{ type: "architecture", name: "Architectural monuments" },
{ type: "parks", name: "Royal parks" },
],
"6": [
{ type: "architecture", name: "Iconic Skyscrapers" },
{ type: "parks", name: "Urban Parks" },
{ type: "museums", name: "World-Class Museums" },
{ type: "landmarks", name: "Famous Landmarks" },
{ type: "views", name: "Panoramic Views" },
],
"7": [
{ type: "mountains", name: "Alpine Mountains" },
{ type: "lakes", name: "Crystal Clear Lakes" },
{ type: "trails", name: "Scenic Hiking Trails" },
{ type: "villages", name: "Charming Villages" },
{ type: "glaciers", name: "Glaciers" },
],
"8": [
{ type: "monuments", name: "Iconic Monuments" },
{ type: "museums", name: "Art Museums" },
{ type: "rivers", name: "Seine River Views" },
{ type: "districts", name: "Historic Districts" },
{ type: "cafes", name: "Charming Cafes" },
],
"9": [
{ type: "wall", name: "Berlin Wall Remains" },
{ type: "street-art", name: "Street Art" },
{ type: "history", name: "Historical Sites" },
{ type: "culture", name: "Alternative Culture" },
{ type: "modern-architecture", name: "Modern Architecture" },
],
"10": [
{ type: "canals", name: "Canals" },
{ type: "bridges", name: "Bridges" },
{ type: "palaces", name: "Palaces" },
{ type: "churches", name: "Churches" },
{ type: "hidden-gems", name: "Hidden Gems" },
],
"11": [
{ type: "monuments", name: "Iconic Monuments" },
{ type: "museums", name: "Art Museums" },
{ type: "rivers", name: "Seine River Views" },
{ type: "districts", name: "Historic Districts" },
{ type: "cafes", name: "Charming Cafes" },
],
"12": [
{ type: "architecture", name: "Iconic Skyscrapers" },
{ type: "parks", name: "Urban Parks" },
{ type: "museums", name: "World-Class Museums" },
{ type: "landmarks", name: "Famous Landmarks" },
{ type: "views", name: "Panoramic Views" },
],
"13": [
{ type: "ancient-ruins", name: "Ancient Roman Ruins" },
{ type: "churches", name: "Historic Churches" },
{ type: "fountains", name: "Baroque Fountains" },
{ type: "squares", name: "Vibrant Squares" },
{ type: "art", name: "Renaissance Art" },
],
"14": [
{ type: "architecture", name: "Gaudí Architecture" },
{ type: "beaches", name: "City Beaches" },
{ type: "parks", name: "Unique Parks" },
{ type: "markets", name: "Food Markets" },
{ type: "views", name: "City Views" },
],
"15": [
{ type: "temples", name: "Temples" },
{ type: "markets", name: "Night Markets" },
{ type: "palaces", name: "Royal Palaces" },
{ type: "rivers", name: "Chao Phraya River" },
{ type: "food", name: "Street Food" },
],
"16": [
{ type: "royal-residences", name: "Royal Residences" },
{ type: "historic-sites", name: "Historic Sites" },
{ type: "river-walks", name: "Thames River Walks" },
{ type: "museums", name: "Museums" },
{ type: "parks", name: "Royal Parks" },
],
"17": [
{ type: "mountains", name: "Table Mountain" },
{ type: "coastline", name: "Stunning Coastline" },
{ type: "beaches", name: "Beautiful Beaches" },
{ type: "nature", name: "Nature Reserves" },
{ type: "views", name: "Panoramic Views" },
],
"18": [
{ type: "street-food", name: "Street Food" },
{ type: "markets", name: "Local Markets" },
{ type: "tacos", name: "Authentic Tacos" },
{ type: "desserts", name: "Traditional Desserts" },
{ type: "culture", name: "Local Culture" },
],
"19": [
{ type: "delis", name: "Classic Delis" },
{ type: "food-trucks", name: "Food Trucks" },
{ type: "food-markets", name: "Food Markets" },
{ type: "ethnic-food", name: "Ethnic Cuisine" },
{ type: "desserts", name: "Trendy Desserts" },
],
"20": [
{ type: "pizza", name: "Authentic Pizza" },
{ type: "street-food", name: "Street Food" },
{ type: "historic-streets", name: "Historic Streets" },
{ type: "local-cuisine", name: "Local Cuisine" },
{ type: "markets", name: "Local Markets" },
],
"21": [
{ type: "ramen", name: "Ramen Shops" },
{ type: "sushi", name: "Sushi Bars" },
{ type: "izakayas", name: "Izakayas" },
{ type: "street-food", name: "Street Food" },
{ type: "local-gems", name: "Hidden Local Gems" },
],
"22": [
{ type: "kebabs", name: "Kebabs" },
{ type: "sweets", name: "Traditional Sweets" },
{ type: "bazaars", name: "Historic Bazaars" },
{ type: "spices", name: "Spices" },
{ type: "tea", name: "Turkish Tea" },
],
"23": [
{ type: "blue-domes", name: "Blue Dome Churches" },
{ type: "sunsets", name: "Dramatic Sunsets" },
{ type: "caldera", name: "Caldera Views" },
{ type: "villages", name: "Picturesque Villages" },
{ type: "beaches", name: "Unique Beaches" },
],
"24": [
{ type: "bridges", name: "Iconic Bridges" },
{ type: "skyline", name: "City Skyline" },
{ type: "parks", name: "Scenic Parks" },
{ type: "views", name: "Panoramic Views" },
{ type: "street-photography", name: "Street Photography" },
],
"25": [
{ type: "temples", name: "Traditional Temples" },
{ type: "bamboo-groves", name: "Bamboo Groves" },
{ type: "cherry-blossoms", name: "Cherry Blossoms" },
{ type: "gardens", name: "Zen Gardens" },
{ type: "geisha-districts", name: "Geisha Districts" },
],
"26": [
{ type: "statues", name: "Christ the Redeemer" },
{ type: "beaches", name: "Famous Beaches" },
{ type: "mountains", name: "Sugarloaf Mountain" },
{ type: "favelas", name: "Colorful Favelas" },
{ type: "views", name: "City Views" },
],
"27": [
{ type: "eiffel-tower", name: "Eiffel Tower Views" },
{ type: "bridges", name: "Seine Bridges" },
{ type: "cafes", name: "Charming Cafes" },
{ type: "museums", name: "Museum Exteriors" },
{ type: "street-scenes", name: "Parisian Street Scenes" },
],
"28": [
{ type: "skyline", name: "Futuristic Skyline" },
{ type: "landmarks", name: "Luxury Landmarks" },
{ type: "desert", name: "Desert Landscapes" },
{ type: "beaches", name: "Man-made Beaches" },
{ type: "architecture", name: "Modern Architecture" },
],
"29": [
{ type: "neighborhoods", name: "Colorful Neighborhoods" },
{ type: "trams", name: "Historic Trams" },
{ type: "river-views", name: "Tagus River Views" },
{ type: "viewpoints", name: "Scenic Viewpoints" },
{ type: "castles", name: "Castles" },
],
"30": [
{ type: "renaissance-art", name: "Renaissance Art" },
{ type: "cathedrals", name: "Iconic Cathedrals" },
{ type: "bridges", name: "Historic Bridges" },
{ type: "river-walks", name: "Arno River Walks" },
{ type: "palaces", name: "Palaces" },
],
"31": [
{ type: "modern-districts", name: "Modern Districts" },
{ type: "traditional-markets", name: "Traditional Markets" },
{ type: "palaces", name: "Historic Palaces" },
{ type: "street-food", name: "Street Food" },
{ type: "shopping", name: "Shopping Areas" },
],
"32": [
{ type: "old-town", name: "Medieval Old Town" },
{ type: "castle", name: "Historic Castle" },
{ type: "views", name: "City Views" },
{ type: "history", name: "Rich History" },
{ type: "pubs", name: "Traditional Pubs" },
],
"33": [
{ type: "tango", name: "Tango Streets" },
{ type: "colorful-districts", name: "Colorful Districts" },
{ type: "markets", name: "Local Markets" },
{ type: "cemeteries", name: "Historic Cemeteries" },
{ type: "culture", name: "Vibrant Culture" },
],
"34": [
{ type: "glaciers", name: "Glaciers" },
{ type: "waterfalls", name: "Waterfalls" },
{ type: "volcanoes", name: "Volcanic Landscapes" },
{ type: "hot-springs", name: "Hot Springs" },
{ type: "fjords", name: "Fjords" },
],
"35": [
{ type: "alpine-lakes", name: "Alpine Lakes" },
{ type: "mountain-peaks", name: "Mountain Peaks" },
{ type: "hiking-trails", name: "Challenging Hiking Trails" },
{ type: "panoramas", name: "Breathtaking Panoramas" },
{ type: "nature", name: "Pristine Nature" },
],
"36": [
{ type: "fjords", name: "Norwegian Fjords" },
{ type: "northern-lights", name: "Northern Lights" },
{ type: "arctic-landscapes", name: "Arctic Landscapes" },
{ type: "coastal-drives", name: "Scenic Coastal Drives" },
{ type: "wildlife", name: "Arctic Wildlife" },
],
"37": [
{ type: "desert-dunes", name: "Desert Dunes" },
{ type: "oases", name: "Oases" },
{ type: "berber-culture", name: "Berber Culture" },
{ type: "camel-treks", name: "Camel Treks" },
{ type: "gorges", name: "Dramatic Gorges" },
],
"38": [
{ type: "outback", name: "Australian Outback" },
{ type: "coastline", name: "Stunning Coastline" },
{ type: "national-parks", name: "National Parks" },
{ type: "wildlife", name: "Unique Wildlife" },
{ type: "road-trip", name: "Epic Road Trip Views" },
],
"39": [
{ type: "volcanoes", name: "Volcanoes" },
{ type: "rainforests", name: "Rainforests" },
{ type: "wildlife", name: "Rich Wildlife" },
{ type: "cloud-forests", name: "Cloud Forests" },
{ type: "beaches", name: "Pacific Beaches" },
],
"40": [
{ type: "cafes", name: "Cozy Cafes" },
{ type: "bakeries", name: "Artisan Bakeries" },
{ type: "bistros", name: "Charming Bistros" },
{ type: "restaurants", name: "Acclaimed Restaurants" },
{ type: "food-markets", name: "Local Food Markets" },
],
}

const data = whatYouWillSeeData[routeId] || whatYouWillSeeData["0"] // Changed fallback key to "0"
return data.map((item) => ({
...item,
type: item.type === "photo-tour" ? "photo-spots" : item.type,
}))
}

const getPlaceTypeIcon = (type: string) => {
const iconSize = 18

if (type === "photo-tour") {
return <ImageIcon size={iconSize} />
}

switch (type) {
case "murals":
case "graffiti":
case "street-art":
case "photo-spots":
case "eiffel-tower":
case "parisian-street-scenes":
case "cherry-blossoms":
return <ImageIcon size={iconSize} />
case "monuments":
case "architecture":
case "palaces":
case "historic-sites":
case "old-town":
case "colorful-districts":
case "modern-architecture":
case "royal-residences":
case "skyline":
case "landmarks":
case "favelas":
case "neighborhoods":
case "castle":
return <Building size={iconSize} />
case "art-objects":
case "hidden-gems":
case "local-gems":
case "renaissance-art":
return <Star size={iconSize} />
case "galleries":
case "museums":
case "museum-exteriors":
return <GalleryHorizontal size={iconSize} />
case "temples":
case "churches":
case "cathedrals":
case "cemeteries":
case "blue-domes":
return <Church size={iconSize} />
case "gardens":
case "nature":
case "bamboo-groves":
case "zen-gardens":
case "rainforests":
case "cloud-forests":
case "pristine-nature":
case "national-parks":
case "oases":
return <Leaf size={iconSize} />
case "markets":
case "shopping":
case "bazaars":
case "traditional-markets":
return <ShoppingBag size={iconSize} />
case "waterfalls":
case "coastline":
case "beaches":
case "canals":
case "rivers":
case "alpine-lakes":
case "hot-springs":
case "fjords":
case "unique-beaches":
case "river-walks":
case "lakes":
return <Waves size={iconSize} />
case "landscapes":
case "mountains":
case "elevation":
case "mountain-peaks":
case "gorges":
case "desert-dunes":
case "volcanoes":
return <Mountain size={iconSize} />
case "wildlife":
case "arctic-wildlife":
return <Bird size={iconSize} />
case "theaters":
return <Theater size={iconSize} />
case "bridges":
case "seine-bridges":
return <Bridge size={iconSize} />
case "squares":
case "food":
case "street-food":
case "tacos":
case "desserts":
case "delis":
case "food-trucks":
case "ethnic-food":
case "pizza":
case "historic-streets":
case "local-cuisine":
case "ramen":
case "sushi":
case "izakayas":
case "kebabs":
case "sweets":
case "tea":
case "cafes":
case "pubs":
case "bakeries":
case "bistros":
case "restaurants":
return <Utensils size={iconSize} />
case "views":
case "panoramas":
case "panoramic-views":
case "viewpoints":
return <Eye size={iconSize} />
case "wall":
return <Wall size={iconSize} />
case "history":
return <History size={iconSize} />
case "culture":
return <Building size={iconSize} />
case "berber-culture":
case "tango":
return <Users size={iconSize} />
case "road-trip":
case "coastal-drives":
case "trams":
return <Car size={iconSize} />
case "sunsets":
case "northern-lights":
return <Sun size={iconSize} />
case "glaciers":
case "arctic-landscapes":
return <Snowflake size={iconSize} />
case "trails":
case "hiking-trails":
return <Road size={iconSize} />
case "villages":
case "neighborhoods":
return <Home size={iconSize} />
case "camel-treks":
return <Caravan size={iconSize} />
default:
return <Plane size={iconSize} />
}
}

const isAdmin = () => {
return !!user
}

const openModerationModal = () => {
setModerationModalOpen(true)
document.body.style.overflow = "hidden"
}

const closeModerationModal = () => {
setModerationModalOpen(false)
setSelectedModerationAction("")
setModerationComment("")
document.body.style.overflow = "auto"
}

const selectModerationAction = (action: string) => {
setSelectedModerationAction(action)
}

const applyModerationAction = () => {
if (!selectedModerationAction) return

alert(`Action "${selectedModerationAction}" will be implemented later`)
closeModerationModal()
}

const applyModeration = () => {
if (!selectedModerationAction) return

if (selectedModerationAction === "hide") {
setRouteModerationStatus("hidden")
} else if (selectedModerationAction === "delete") {
setRouteModerationStatus("deleted")
}

console.log("Moderation action:", selectedModerationAction, "Comment:", moderationComment)
closeModerationModal()
}

const formatDate = (dateString: string) => {
const date = new Date(dateString)
return date.toLocaleDateString("en-US", {
year: "numeric",
month: "short",
day: "numeric",
})
}

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

const BlockedContent = ({ status }: { status: "hidden" | "deleted" }) => (
<div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
<div className="max-w-md w-full text-center border border-[#27272f] rounded-xl p-8 bg-[#080809]">
<div className="mb-6">
<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
  <Shield size={32} className="text-red-400" />
</div>
<h1 className="text-xl font-medium mb-3">Content Unavailable</h1>
<p className="text-gray-400 text-sm leading-relaxed">
  This route content is currently unavailable due to a violation of our community guidelines.
</p>
</div>

<Link
href="/"
className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
>
Return to Home
</Link>
</div>
</div>
)

const closeShareModal = () => {
setShareModalOpen(false)
document.body.style.overflow = "auto"
setCopiedLink(false); // Reset copied state when modal closes
}

const closeReportModal = () => {
setReportModalOpen(false)
document.body.style.overflow = "auto"
}

const copyRouteLink = () => {
const routeUrl = `${window.location.origin}/list/${routeId}` // Changed to /list/ for list page
navigator.clipboard.writeText(routeUrl)
setCopiedLink(true); // Set copied state to true
setTimeout(() => setCopiedLink(false), 2000); // Reset after 2 seconds
}

const shareToSocial = (platform: string) => {
const routeUrl = `${window.location.origin}/list/${routeId}` // Changed to /list/ for list page
const text = `Check out this amazing list: ${route?.name} in ${route?.location}` // Changed text for list

let shareUrl = ""

switch (platform) {
case "twitter":
shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(routeUrl)}`
break
case "facebook":
shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(routeUrl)}`
break
case "telegram":
shareUrl = `https://t.me/share/url?url=${encodeURIComponent(routeUrl)}&text=${encodeURIComponent(text)}`
break
case "whatsapp":
shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + routeUrl)}`
break
}

if (shareUrl) {
window.open(shareUrl, "_blank", "width=600,height=400")
}
}

const submitReport = (reason: string, comment: string) => {
console.log("Report submitted:", { routeId, reason, comment })
alert("Report submitted successfully!")
closeReportModal()
}

const buyButtonStyles = {
backgroundColor: buyButtonHover ? "transparent" : "white",
backgroundImage: buyButtonHover ? "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)" : "none",
backgroundSize: "200% 100%",
backgroundPosition: buyButtonHover ? "100% 0%" : "0% 0%",
color: buyButtonHover ? "white" : "black",
}

return (
<>
{routeModerationStatus !== "active" ? (
<BlockedContent status={routeModerationStatus as "hidden" | "deleted"} />
) : (
<main className="min-h-screen bg-black text-white pb-24">
<header className="fixed top-0 left-0 right-0 w-full z-50 bg-black border-b border-[#1a1a1a]">
  <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
    <Link href="/" className="flex items-center min-w-[77px]">
      <Image src="/logo.png" alt="Logo" width={77} height={40} />
    </Link>

    <div className="flex items-center gap-4">
      <div className="relative hidden">
        <button className="flex items-center gap-1 px-3 py-1.5" onClick={toggleLangMenu}>
          <Globe size={18} />
          <span>{currentLang}</span>
        </button>

        {langMenuOpen && (
          <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-[#18181c] border border-[#27272f] overflow-hidden z-50">
            <div className="p-3 pr-2">
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`flex items-center w-full px-3 py-2.5 text-left rounded-md mb-1 ${
                      currentLang === lang.code
                        ? "bg-[#4b4b65] text-white"
                        : "hover:bg-[#27272f] text-gray-200"
                    }`}
                    onClick={() => selectLanguage(lang.code)}
                  >
                    <span className="w-8 text-sm font-medium">{lang.code}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <UserMenu />
    </div>
  </div>
</header>

<div className="max-w-[1300px] mx-auto px-4 pt-24">
  <div className="flex justify-between items-center mb-6">
    <Link href="/" className="text-gray-400 hover:text-white transition-colors underline">
      Back to home
    </Link>

    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center justify-center w-[35px] h-[35px] border border-gray-600/50 rounded-full text-gray-400 hover:text-gray-300 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[#18181c] rounded-xl shadow-lg border border-[#27272f] overflow-hidden z-50">
            <div className="py-2">
              <button
                onClick={() => {
                  setUserMenuOpen(false)
                  setShareModalOpen(true)
                  document.body.style.overflow = "hidden"
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#27272f] transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16,6 12,2 8,6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                <span>Share route</span>
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false)
                  setReportModalOpen(true)
                  document.body.style.overflow = "hidden"
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#27272f] transition-colors text-red-400"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9s10.3-3.9 14.2 0 3.9 10.3 0 14.2-10.3 3.9-14.2 0z" />
                  <path d="M9 9h6v6H9z" />
                </svg>
                <span>Report route</span>
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false)
                  alert("Added to wishlist!")
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#27272f] transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>Add to wishlist</span>
              </button>
              {isAdmin() && (
                <button
                  onClick={() => {
                    setUserMenuOpen(false)
                    openModerationModal()
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#27272f] transition-colors text-red-400"
                >
                  <Shield size={18} />
                  <span>Moderate route</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  </div>

  <div className="flex justify-between items-start mb-6">
    <div>
      <h1 className="text-2xl font-medium mb-1">{route?.name}</h1>
      <p className="text-gray-400">{route?.location}</p>
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

      {showAuthorTooltip && authorData && (
        <div
          ref={authorTooltipRef}
          className="absolute right-0 mt-2 w-64 bg-[#2a2a30] rounded-lg shadow-xl border border-[#3a3a45] z-50 overflow-hidden animate-fadeIn"
          style={{
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="p-4">
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

  <div className="mb-8 relative border border-[#1a1a1a] rounded-xl bg-[#080809] md:h-[410px]">
    <div className="hidden md:flex flex-wrap h-full">
      <div className="w-[40%] h-full p-1.5">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]">
          {route?.gallery && route?.gallery?.length > 0 && (
            <Image
              src={`/${route?.gallery[0]}`}
              alt={`${route?.name} - image 1`}
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>

      <div className="w-[40%] h-full p-1.5">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]">
          {route?.gallery && route?.gallery?.length > 1 && (
            <Image
              src={`/${route?.gallery[1]}`}
              alt={`${route?.name} - image 2`}
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>

      <div className="w-[20%] h-full flex flex-col">
        <div className="h-1/2 p-1.5 pb-0.75">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]">
            {route?.gallery && route?.gallery?.length > 2 && (
              <Image
                src={`/${route?.gallery[2]}`}
                alt={`${route?.name} - image 3`}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="h-1/2 p-1.5 pt-0.75 relative">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]">
            {route?.gallery && route?.gallery?.length > 3 && (
              <Image
                src={`/${route?.gallery[3]}`}
                alt={`${route?.name} - image 4`}
                fill
                className="object-cover"
              />
            )}
          </div>

          <button
            className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors"
            onClick={openGallery}
          >
            View all
          </button>
        </div>
      </div>
    </div>

    <div className="md:hidden relative">
      <div className="relative w-full md:p-1.5">
        <div
          className="relative w-full rounded-lg overflow-hidden bg-[#0c0c0e] border border-[#1a1a1a]"
          style={{ aspectRatio: "4/3" }}
        >
          {route?.gallery && route?.gallery?.length > 0 && (
            <Image
              src={`/${route?.gallery[currentImageIndex]}`}
              alt={`${route?.name} - image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
          )}
        </div>

        {route?.gallery && route?.gallery?.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (prev) => (prev - 1 + (route?.gallery?.length || 1)) % (route?.gallery?.length || 1),
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/30 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % (route?.gallery?.length || 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/30 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}

        {route?.gallery && route?.gallery?.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-sm py-1 px-2 rounded-full border border-white/30">
            {currentImageIndex + 1} / {route?.gallery?.length}
          </div>
        )}

        <button
          className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors"
          onClick={openGallery}
        >
          View all
        </button>
      </div>
    </div>
  </div>

  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#27272f] to-transparent my-8"></div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] relative">
      <h3 className="text-lg font-medium mb-4 text-white">Overview</h3>
      <div className="space-y-3">
        {[
          { icon: getTypeIcon(), text: route?.categoryDisplay },
          {
            icon: <Road size={16} className="text-gray-400 flex-shrink-0" />,
            text: route?.distance ? `${route?.distance} meters` : "N/A",
          },
          {
            icon: <Map size={16} className="text-gray-400 flex-shrink-0" />,
            text: `${route?.points} points`,
          },
          { icon: <Clock size={16} className="text-gray-400 flex-shrink-0" />, text: route?.duration },
          { icon: getDifficultyIcon(), text: `${route?.difficulty} difficulty` },
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
      {6 > 5 && (
        <button
          className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors"
          onClick={openDetailsModal}
        >
          View all
        </button>
      )}
    </div>

    <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] relative">
      <h3 className="text-lg font-medium mb-4 text-white">What you'll see</h3>
      <div className="space-y-3">
        {getWhatYouWillSee(routeId)
          .slice(0, 5)
          .map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-300">
              <div className="text-gray-400 flex-shrink-0">{getPlaceTypeIcon(item.type)}</div>
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
      </div>
      {getWhatYouWillSee(routeId).length > 5 && (
        <button className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors">
          View all
        </button>
      )}
    </div>

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
      {4 > 5 && (
        <button className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors">
          View all
        </button>
      )}
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] relative">
      <h3 className="text-lg font-medium mb-4 text-white">Description</h3>
      <div className="text-gray-300 text-sm leading-relaxed overflow-hidden line-clamp-[12]">
        {route?.description}
      </div>

      <button
        className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-full border border-white/30 hover:bg-black/70 transition-colors"
        onClick={openDescriptionModal}
      >
        Read more
      </button>
    </div>

    <div className="bg-[#080809] rounded-xl p-5 border border-[#1a1a1a] flex flex-col">
      <h3 className="text-lg font-medium mb-4 text-white">Map</h3>
      <div className="relative flex-1 rounded-lg overflow-hidden" style={{ minHeight: "300px" }}>
        <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      </div>
    </div>
  </div>

  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#27272f] to-transparent my-8"></div>

  <div className="mb-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-medium">Reviews</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-sm">({getReviewCount(routeId)})</span>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{getAverageRating(routeId)}</span>
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
    <div className="text-xl font-medium">
      {route?.price === 0 ? "Free" : `$${routeExtendedInfo.price.toFixed(2)}`}
    </div>
    <div className="flex gap-3">
      {route?.price === 0 ? (
        <Link
          href={route.routeType === "route" ? `/route-navigation/${routeId}` : `/list-navigation/${routeId}`}
          className="font-medium px-6 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <Play size={18} />
          Open Map
        </Link>
      ) : (
        <button
          onClick={handlePurchase}
          onMouseEnter={() => setBuyButtonHover(true)}
          onMouseLeave={() => setBuyButtonHover(false)}
          className="font-medium px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 overflow-hidden relative"
          style={buyButtonStyles}
        >
          <ShoppingCart size={18} />
          Buy
        </button>
      )}
    </div>
  </div>
</div>

{loginRequiredModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="w-full max-w-md mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
        <h2 className="text-xl font-medium">Login Required</h2>
        <button
          className="text-gray-400 hover:text-white transition-colors p-1"
          onClick={closeLoginRequiredModal}
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6 text-center">
        <div className="mb-4">
          <LogIn size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-300 mb-2">You need to be logged in to purchase routes.</p>
          <p className="text-sm text-gray-400">Sign in to your account or create a new one to continue.</p>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-lg border border-[#2c2c30] text-gray-300 hover:bg-[#18181c] transition-colors"
            onClick={closeLoginRequiredModal}
          >
            Cancel
          </button>
          <Link
            href="/login"
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium hover:opacity-90 transition-opacity text-center"
            onClick={closeLoginRequiredModal}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  </div>
)}

{galleryOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="w-full max-w-5xl mx-4 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
        <h2 className="text-xl font-medium">Gallery</h2>
        <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeGallery}>
          <X size={24} />
        </button>
      </div>

      <div className="relative h-[70vh] my-4">
        {route?.gallery && route?.gallery?.length > 0 && (
          <Image
            src={`/${route?.gallery[currentGalleryImage]}`}
            alt={`${route?.name} - image ${currentGalleryImage + 1}`}
            fill
            className="object-contain"
          />
        )}

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

      <div className="flex justify-center overflow-x-auto gap-2 py-4 px-2 custom-scrollbar max-w-3xl mx-auto">
        {route?.gallery &&
          route?.gallery.map((image, index) => (
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

      <div className="text-center text-gray-400 py-2">
        {currentGalleryImage + 1} / {route?.gallery ? route?.gallery?.length : 0}
      </div>
    </div>
  </div>
)}

{detailsModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="w-full max-w-4xl mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
        <h2 className="text-xl font-medium">Detailed Information</h2>
        <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeDetailsModal}>
          <X size={24} />
        </button>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">{getTypeIcon()}</div>
              <span className="text-sm text-gray-400">Route type</span>
            </div>
            <div className="font-medium text-white">{route?.categoryDisplay}</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <Road size={16} />
              </div>
              <span className="text-sm text-gray-400">Distance</span>
            </div>
            <div className="font-medium text-white">
              {route?.distance ? `${route?.distance} meters` : "N/A"}
            </div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <Map size={16} />
              </div>
              <span className="text-sm text-gray-400">Points</span>
            </div>
            <div className="font-medium text-white">{route?.points}</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <Clock size={16} />
              </div>
              <span className="text-sm text-gray-400">Duration</span>
            </div>
            <div className="font-medium text-white">{route?.duration}</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">{getDifficultyIcon()}</div>
              <span className="text-sm text-gray-400">Difficulty</span>
            </div>
            <div className="font-medium text-white">{route?.difficulty}</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <Star size={16} />
              </div>
              <span className="text-sm text-gray-400">Rating</span>
            </div>
            <div className="font-medium text-white">{routeExtendedInfo.rating} / 5</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <DollarSign size={16} />
              </div>
              <span className="text-sm text-gray-400">Paid attractions</span>
            </div>
            <div className="font-medium text-white">{routeExtendedInfo.paidAttractions ? "Yes" : "No"}</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <Coffee size={16} />
              </div>
              <span className="text-sm text-gray-400">Food options</span>
            </div>
            <div className="font-medium text-white">{routeExtendedInfo.foodOptions ? "Yes" : "No"}</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <Baby size={16} />
              </div>
              <span className="text-sm text-gray-400">Family friendly</span>
            </div>
            <div className="font-medium text-white">{routeExtendedInfo.familyFriendly ? "Yes" : "No"}</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <Thermometer size={16} />
              </div>
              <span className="text-sm text-gray-400">Best season</span>
            </div>
            <div className="font-medium text-white">{routeExtendedInfo.bestSeason}</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-lg p-4 border border-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-400">
                <Footprints size={16} />
              </div>
              <span className="text-sm text-gray-400">Surface</span>
            </div>
            <div className="font-medium text-white">{routeExtendedInfo.surface}</div>
          </div>

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

{descriptionModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="w-full max-w-4xl mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
        <h2 className="text-xl font-medium">Route Description</h2>
        <button
          className="text-gray-400 hover:text-white transition-colors p-1"
          onClick={closeDescriptionModal}
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <p className="text-gray-300 text-sm leading-relaxed">{route?.description}</p>
      </div>
    </div>
  </div>
)}

{purchaseModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="w-full max-w-md mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
        <h2 className="text-xl font-medium">Purchase Options</h2>
        <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closePurchaseModal}>
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <button
            onClick={() => selectPaymentOption("onetime")}
            className={`flex items-center justify-between w-full p-4 rounded-lg border ${
              selectedPaymentOption === "onetime" ? "border-[#6366f1]" : "border-[#2c2c30]"
            } hover:bg-[#18181c] transition-colors`}
          >
            <div>
              <h3 className="font-medium text-white">One-Time Purchase</h3>
              <p className="text-sm text-gray-400">Pay once and get lifetime access to this route.</p>
            </div>
            <div className="text-xl font-medium">
              {route?.price === 0 ? "Free" : `$${routeExtendedInfo.price.toFixed(2)}`}
            </div>
          </button>

          <button
            onClick={() => selectPaymentOption("subscription")}
            className={`flex items-center justify-between w-full p-4 rounded-lg border ${
              selectedPaymentOption === "subscription" ? "border-[#6366f1]" : "border-[#2c2c30]"
            } hover:bg-[#18181c] transition-colors`}
          >
            <div>
              <h3 className="font-medium text-white">Subscription</h3>
              <p className="text-sm text-gray-400">Subscribe for unlimited access to all routes.</p>
            </div>
            <div className="text-xl font-medium">$9.99/month</div>
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 py-2.5 rounded-lg border border-[#2c2c30] text-gray-300 hover:bg-[#18181c] transition-colors"
            onClick={closePurchaseModal}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium hover:opacity-90 transition-opacity"
            onClick={completePurchase}
            disabled={!selectedPaymentOption}
            style={{
              opacity: selectedPaymentOption ? 1 : 0.5,
              cursor: selectedPaymentOption ? "pointer" : "not-allowed",
            }}
          >
            Complete Purchase
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{moderationModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="w-full max-w-md mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
        <h2 className="text-xl font-medium">Moderate Route</h2>
        <button
          className="text-gray-400 hover:text-white transition-colors p-1"
          onClick={closeModerationModal}
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <button
            onClick={() => selectModerationAction("hide")}
            className={`flex items-center justify-between w-full p-4 rounded-lg border ${
              selectedModerationAction === "hide" ? "border-[#6366f1]" : "border-[#2c2c30]"
            } hover:bg-[#18181c] transition-colors`}
          >
            <div>
              <h3 className="font-medium text-white">Hide Route</h3>
              <p className="text-sm text-gray-400">Hide this route from public view.</p>
            </div>
            <Eye size={20} className="text-gray-400" />
          </button>

          <button
            onClick={() => selectModerationAction("delete")}
            className={`flex items-center justify-between w-full p-4 rounded-lg border ${
              selectedModerationAction === "delete" ? "border-[#6366f1]" : "border-[#2c2c30]"
            } hover:bg-[#18181c] transition-colors`}
          >
            <div>
              <h3 className="font-medium text-white">Delete Route</h3>
              <p className="text-sm text-gray-400">Permanently delete this route.</p>
            </div>
            <Trash2 size={20} className="text-gray-400" />
          </button>

          <div>
            <label htmlFor="moderationComment" className="block text-sm font-medium text-gray-300 mb-1">
              Comment
            </label>
            <textarea
              id="moderationComment"
              className="w-full p-3 rounded-lg bg-[#0c0c0e] border border-[#2c2c30] text-white text-sm focus:outline-none focus:border-[#6366f1]"
              placeholder="Add a comment..."
              value={moderationComment}
              onChange={(e) => setModerationComment(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 py-2.5 rounded-lg border border-[#2c2c30] text-gray-300 hover:bg-[#18181c] transition-colors"
            onClick={closeModerationModal}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium hover:opacity-90 transition-opacity"
            onClick={applyModeration}
            disabled={!selectedModerationAction}
            style={{
              opacity: selectedModerationAction ? 1 : 0.5,
              cursor: selectedModerationAction ? "pointer" : "not-allowed",
            }}
          >
            Apply Action
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{shareModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="w-full max-w-md mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
        <h2 className="text-xl font-medium">Share Route</h2>
        <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeShareModal}>
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        {route && ( // Ensure route data is available before rendering MapPreviewCard
          <div className="mb-6">
            <MapPreviewCard
              routeId={route.id}
              routeName={route.name}
              routeLocation={route.location}
              routeDescription={route.description}
              routeType={route.routeType}
              mapCenter={getInitialMapCoordinates().center}
              mapZoom={getInitialMapCoordinates().zoom}
              landmarks={route.landmarks}
            />
          </div>
        )}

        {/* New Copy Link Block */}
        <div className="mb-6">
          <div className="flex items-center justify-between py-2 px-2 bg-[#121214] border border-[#2c2c30] rounded-full pl-4">
            <span className="text-gray-300 text-sm truncate">
              {`${window.location.origin}/list/${routeId}`}
            </span>
            <button
              onClick={copyRouteLink}
              className={`ml-4 px-4 py-1.5 rounded-full transition-colors text-sm flex items-center gap-1 ${
                copiedLink ? "bg-green-600 text-white" : "bg-[#27272f] hover:bg-[#3a3a3a] text-white"
              }`}
              aria-label="Copy link"
            >
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              {copiedLink ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => shareToSocial("twitter")}
              className="w-12 h-12 rounded-full border border-[#2c2c30] hover:bg-[#18181c] transition-colors flex items-center justify-center"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => shareToSocial("facebook")}
              className="w-12 h-12 rounded-full border border-[#2c2c30] hover:bg-[#18181c] transition-colors flex items-center justify-center"
            >
              <Facebook size={20} />
            </button>
            <button
              onClick={() => shareToSocial("telegram")}
              className="w-12 h-12 rounded-full border border-[#2c2c30] hover:bg-[#18181c] transition-colors flex items-center justify-center"
            >
              <Send size={20} />
            </button>
            <button
              onClick={() => shareToSocial("whatsapp")}
              className="w-12 h-12 rounded-full border border-[#2c2c30] hover:bg-[#18181c] transition-colors flex items-center justify-center"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{reportModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="w-full max-w-md mx-4 bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2c30]">
        <h2 className="text-xl font-medium">Report Route</h2>
        <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeReportModal}>
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="reportReason" className="block text-sm font-medium text-gray-300 mb-1">
              Reason for Report
            </label>
            <select
              id="reportReason"
              className="w-full p-3 rounded-lg bg-[#0c0c0e] border border-[#2c2c30] text-white text-sm focus:outline-none focus:border-[#6366f1]"
              defaultValue=""
            >
              <option value="" disabled>
                Select a reason
              </option>
              <option value="inaccurate">Inaccurate Information</option>
              <option value="offensive">Offensive Content</option>
              <option value="spam">Spam or Misleading</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="reportComment" className="block text-sm font-medium text-gray-300 mb-1">
              Comment
            </label>
            <textarea
              id="reportComment"
              className="w-full p-3 rounded-lg bg-[#0c0c0e] border border-[#2c2c30] text-white text-sm focus:outline-none focus:border-[#6366f1]"
              placeholder="Add a comment..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 py-2.5 rounded-lg border border-[#2c2c30] text-gray-300 hover:bg-[#18181c] transition-colors"
            onClick={closeReportModal}
          >
            Cancel
          </button>
          <button className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium hover:opacity-90 transition-opacity">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</main>
)}
</>
)
}
