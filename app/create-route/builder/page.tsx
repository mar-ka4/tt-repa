"use client"

import React from "react"
import ReactDOM from "react-dom/client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Info,
  Tag,
  MapPin,
  DollarSign,
  Send,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Heart,
  Users,
  Mountain,
  Utensils,
  Camera,
  TreePine,
  Building,
  Music,
  Coffee,
  ShoppingBag,
  Gamepad2,
  Dumbbell,
  Book,
  Car,
  Check,
  Baby,
  Trash2,
  X,
  Pencil,
  ChevronUp,
  ChevronDown,
  Shuffle,
  Grid3X3,
} from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

import { locations, type Location } from "@/data/locations"
import { getIconComponentBySubcategoryId } from "@/data/icons"
import { listCategories, getListCategory } from "@/data/list-categories"

const routeSteps = [
  { id: 1, title: "Basic Information", icon: Info, active: true },
  { id: 2, title: "Route Type", icon: Tag, active: false },
  { id: 3, title: "Route Points & Map", icon: MapPin, active: false },
  { id: 4, title: "Route Details", icon: Coffee, active: false },
  { id: 5, title: "Pricing Policy", icon: DollarSign, active: false },
  { id: 6, title: "Publication", icon: Send, active: false },
]

const pointsSteps = [
  { id: 1, title: "Basic Information", icon: Info, active: true },
  { id: 2, title: "List Category", icon: Tag, active: false },
  { id: 3, title: "List Points & Map", icon: MapPin, active: false },
  { id: 4, title: "List Details", icon: Coffee, active: false },
  { id: 5, title: "List Pricing Policy", icon: DollarSign, active: false },
  { id: 6, title: "Publication", icon: Send, active: false },
]

const routeTypes = [
  {
    id: "walking",
    title: "On Foot",
    icon: "/icons/walking.png",
    description: "Perfect for exploring cities and short distances",
    transport: "walking",
    pace: "Slow pace",
  },
  {
    id: "cycling",
    title: "By Bicycle",
    icon: "/icons/cyclist.png",
    description: "Eco-friendly option for medium distances",
    transport: "cycling",
    pace: "Medium pace",
  },
  {
    id: "car",
    title: "By Car",
    icon: "/icons/car-travel.png",
    description: "Best for long distances and comfort",
    transport: "driving",
    pace: "Fast pace",
  },
]

const categories = [
  { id: "best-photo-locations", name: "Best Photo Locations", icon: Camera, description: "Scenic spots & viewpoints" },
  { id: "gastronomy", name: "Gastronomy", icon: Utensils, description: "Food & dining experiences" },
  { id: "nature", name: "Nature", icon: TreePine, description: "Parks, trails & wildlife" },
  { id: "culture", name: "Culture", icon: Building, description: "Museums & historic sites" },
  { id: "urban", name: "Urban", icon: Building, description: "City exploration" },
  { id: "romantic", name: "Romantic", icon: Heart, description: "Perfect for couples" },
  { id: "adventure", name: "Adventure", icon: Mountain, description: "Thrilling activities" },
  { id: "family", name: "Family", icon: Users, description: "Kid-friendly routes" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, description: "Markets & boutiques" },
  { id: "nightlife", name: "Nightlife", icon: Music, description: "Bars & entertainment" },
  { id: "wellness", name: "Wellness", icon: Dumbbell, description: "Spas & relaxation" },
  { id: "sports", name: "Sports", icon: Gamepad2, description: "Active experiences" },
  { id: "cafes", name: "Cafes", icon: Coffee, description: "Coffee shops and cafes" },
  { id: "bakeries", name: "Bakeries", icon: Utensils, description: "Freshly baked goods" },
  { id: "restaurants", name: "Restaurants", icon: Utensils, description: "Dining establishments" },
  {
    id: "general-route",
    name: "General Route",
    icon: MapPin,
    description: "A general route without a specific category",
  },
]

const whatYouWillSeeCategories = [
  {
    id: "nature",
    name: "Nature",
    icon: TreePine,
    items: [
      { id: "waterfalls", name: "Waterfalls" },
      { id: "mountains", name: "Mountains" },
      { id: "rivers", name: "Rivers" },
      { id: "volcanoes", name: "Volcanoes" },
      { id: "forests", name: "Forests" },
      { id: "lakes", name: "Lakes" },
      { id: "beaches", name: "Beaches" },
      { id: "caves", name: "Caves" },
      { id: "valleys", name: "Valleys" },
      { id: "cliffs", name: "Cliffs" },
    ],
  },
  {
    id: "gastronomy",
    name: "Gastronomy",
    icon: Utensils,
    items: [
      { id: "restaurants", name: "Restaurants" },
      { id: "cafes", name: "Cafes" },
      { id: "coffee-shops", name: "Coffee Shops" },
      { id: "bistros", name: "Bistros" },
      { id: "fast-food", name: "Fast Food" },
      { id: "bakeries", name: "Bakeries" },
      { id: "bars", name: "Bars" },
      { id: "pubs", name: "Pubs" },
      { id: "street-food", name: "Street Food" },
      { id: "food-markets", name: "Food Markets" },
    ],
  },
  {
    id: "culture",
    name: "Culture",
    icon: Building,
    items: [
      { id: "museums", name: "Museums" },
      { id: "galleries", name: "Art Galleries" },
      { id: "theaters", name: "Theaters" },
      { id: "monuments", name: "Monuments" },
      { id: "churches", name: "Churches" },
      { id: "temples", name: "Temples" },
      { id: "palaces", name: "Palaces" },
      { id: "castles", name: "Castles" },
      { id: "libraries", name: "Libraries" },
      { id: "cultural-centers", name: "Cultural Centers" },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Gamepad2,
    items: [
      { id: "parks", name: "Parks" },
      { id: "amusement-parks", name: "Amusement Parks" },
      { id: "zoos", name: "Zoos" },
      { id: "aquariums", name: "Aquariums" },
      { id: "cinemas", name: "Cinemas" },
      { id: "clubs", name: "Nightclubs" },
      { id: "casinos", name: "Casinos" },
      { id: "sports-venues", name: "Sports Venues" },
      { id: "festivals", name: "Festivals" },
      { id: "concerts", name: "Concert Halls" },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: ShoppingBag,
    items: [
      { id: "malls", name: "Shopping Malls" },
      { id: "boutiques", name: "Boutiques" },
      { id: "markets", name: "Markets" },
      { id: "antiques", name: "Antique Shops" },
      { id: "bookstores", name: "Bookstores" },
      { id: "souvenirs", name: "Souvenir Shops" },
      { id: "department-stores", name: "Department Stores" },
      { id: "local-crafts", name: "Local Crafts" },
      { id: "vintage", name: "Vintage Stores" },
      { id: "jewelry", name: "Jewelry Stores" },
    ],
  },
  {
    id: "architecture",
    name: "Architecture",
    icon: Building,
    items: [
      { id: "historic-buildings", name: "Historic Buildings" },
      { id: "modern-architecture", name: "Modern Architecture" },
      { id: "bridges", name: "Bridges" },
      { id: "squares", name: "Squares" },
      { id: "fountains", name: "Fountains" },
      { id: "statues", name: "Statues" },
      { id: "towers", name: "Towers" },
      { id: "gates", name: "Gates" },
      { id: "courtyards", name: "Courtyards" },
      { id: "facades", name: "Historic Facades" },
    ],
  },
]

const goodToKnowCategories = [
  {
    id: "accessibility",
    name: "Accessibility & Comfort",
    icon: Users,
    items: [
      { id: "wheelchair-accessible", name: "Wheelchair accessible", icon: Users },
      { id: "family-friendly", name: "Family friendly", icon: Baby },
      { id: "pet-friendly", name: "Pet friendly", icon: Heart },
      { id: "elderly-friendly", name: "Suitable for elderly", icon: Users },
      { id: "stroller-friendly", name: "Stroller friendly", icon: Baby },
      { id: "accessible-restrooms", name: "Accessible restrooms", icon: Users },
    ],
  },
  {
    id: "practical",
    name: "Practical Information",
    icon: Coffee,
    items: [
      { id: "free-wifi", name: "Free WiFi available", icon: Coffee },
      { id: "parking-available", name: "Parking available", icon: Car },
      { id: "public-transport", name: "Public transport nearby", icon: Car },
      { id: "atm-nearby", name: "ATM nearby", icon: DollarSign },
      { id: "luggage-storage", name: "Luggage storage", icon: ShoppingBag },
      { id: "charging-stations", name: "Phone charging stations", icon: Coffee },
    ],
  },
  {
    id: "food-drink",
    name: "Food & Drink",
    icon: Utensils,
    items: [
      { id: "food-options", name: "Food options available", icon: Coffee },
      { id: "vegetarian-options", name: "Vegetarian options", icon: Utensils },
      { id: "halal-food", name: "Halal food available", icon: Utensils },
      { id: "kosher-food", name: "Kosher food available", icon: Utensils },
      { id: "water-fountains", name: "Water fountains", icon: Coffee },
      { id: "picnic-areas", name: "Picnic areas", icon: TreePine },
    ],
  },
  {
    id: "costs",
    name: "Costs & Payments",
    icon: DollarSign,
    items: [
      { id: "paid-attractions", name: "Some paid attractions", icon: DollarSign },
      { id: "free-entry", name: "Free entry", icon: Check },
      { id: "card-payments", name: "Card payments accepted", icon: DollarSign },
      { id: "cash-only", name: "Cash only", icon: DollarSign },
      { id: "student-discounts", name: "Student discounts", icon: Book },
      { id: "group-discounts", name: "Group discounts", icon: Users },
    ],
  },
  {
    id: "activities",
    name: "Activities & Services",
    icon: Camera,
    items: [
      { id: "photography-allowed", name: "Photography allowed", icon: Camera },
      { id: "guided-tours", name: "Guided tours available", icon: Users },
      { id: "audio-guides", name: "Audio guides available", icon: Music },
      { id: "interactive-exhibits", name: "Interactive exhibits", icon: Gamepad2 },
      { id: "workshops", name: "Workshops available", icon: Book },
      { id: "events", name: "Regular events", icon: Music },
    ],
  },
  {
    id: "safety-rules",
    name: "Safety & Rules",
    icon: Check,
    items: [
      { id: "safe-area", name: "Safe area", icon: Check },
      { id: "well-lit", name: "Well lit at night", icon: Check },
      { id: "security-present", name: "Security present", icon: Users },
      { id: "no-smoking", name: "No smoking area", icon: Check },
      { id: "quiet-zone", name: "Quiet zone", icon: Check },
      { id: "dress-code", name: "Dress code required", icon: Users },
    ],
  },
]

const currencies = [
  { code: "EUR", symbol: "€", name: "Euro", rate: 1 },
  { code: "USD", symbol: "$", name: "Dollar", rate: 1.1 },
  { code: "GBP", symbol: "£", name: "Pound", rate: 0.85 },
  { code: "JPY", symbol: "¥", name: "Yen", rate: 130 },
  { code: "UAH", symbol: "₴", name: "Hryvnia", rate: 40 },
  { code: "GEL", symbol: "₾", name: "Lari", rate: 2.8 },
]

// Define hex colors for main categories
const CATEGORY_HEX_COLORS: { [key: string]: string } = {
  // Route Builder Categories
  "best-photo-locations": "#FF3B30",
  gastronomy: "#FF9500",
  nature: "#34C759",
  culture: "#AF52DE",
  urban: "#5AC8FA",
  romantic: "#FF2D55",
  adventure: "#FF9500",
  family: "#007AFF",
  shopping: "#FFCC00",
  nightlife: "#5856D6",
  wellness: "#34C759",
  sports: "#FF3B30",
  cafes: "#FF9500",
  bakeries: "#FF9500",
  restaurants: "#FF9500",
  "general-route": "#888888",

  // List Builder Main Categories (from list-categories.ts)
  places: "#FF3B30",
  "nature-list": "#34C759",
  "food-drink-list": "#FF9500",
  "culture-list": "#AF52DE",
  "activities-hobbies-list": "#007AFF",
  "unique-abstract-list": "#FFCC00",
  "travel-transport-list": "#5AC8FA",
  "people-community-list": "#5856D6",
}

// Helper to get the hex color for a given category ID
const getCategoryHexColor = (categoryId: string): string => {
  return CATEGORY_HEX_COLORS[categoryId] || "#888888"
}

type PointType = "route" | "info"
type ListType = "mix" | "category"

interface RoutePoint {
  id: number
  name: string
  description: string
  images: string[]
  type: PointType
  coordinates?: [number, number]
  groupId?: string
}

interface GroupingBlock {
  id: string
  name: string
  color: string
  pointIds: number[]
  subcategoryId?: string
  mainCategoryId?: string
}

interface PricingData {
  [currencyCode: string]: {
    price: number
    isManuallySet: boolean
  }
}

type FormattingOption = "normal" | "bold" | "italic" | "underline" | "strikethrough" | "list"

declare global {
  interface Window {
    mapboxgl: any
  }
}

const createCustomMarkerElement = (
  innerCircleBackgroundColor: string,
  isTemp = false,
  IconComponent?: React.ElementType | string,
) => {
  const markerContainer = document.createElement("div")
  markerContainer.className = `v0-custom-marker ${isTemp ? "opacity-60" : ""}`

  const markerShape = document.createElement("div")
  markerShape.style.cssText = `
width: 36px;
height: 36px;
background-color: rgb(24, 24, 28);
border: 2px solid rgb(39, 39, 47);
border: 2px solid rgb(39, 39, 47);
border-radius: 18px 18px 5px;
transform: rotate(45deg);
box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 2px;
display: flex;
align-items: center;
justify-content: center;
overflow: hidden;
`

  const innerCircleDiv = document.createElement("div")
  innerCircleDiv.style.cssText = `
width: 30px;
height: 30px;
border-radius: 50%;
background-color: ${innerCircleBackgroundColor};
display: flex;
align-items: center;
justify-content: center;
transform: rotate(-45deg);
color: white;
`

  if (typeof IconComponent === "string") {
    const emojiSpan = document.createElement("span")
    emojiSpan.className = "text-lg"
    emojiSpan.textContent = IconComponent
    innerCircleDiv.appendChild(emojiSpan)
  } else if (IconComponent) {
    const iconRoot = ReactDOM.createRoot(innerCircleDiv)
    iconRoot.render(React.createElement(IconComponent, { size: 20, className: "text-white" }))
  }

  markerShape.appendChild(innerCircleDiv)
  markerContainer.appendChild(markerShape)

  return markerContainer
}

export default function RouteBuilderPage() {
  const searchParams = useSearchParams()
  const builderType = searchParams.get("type") || "route"
  const isListBuilder = builderType !== "route"

  const steps = builderType === "route" ? routeSteps : pointsSteps

  const [currentStep, setCurrentStep] = useState(1)
  const [routeName, setRouteName] = useState("")
  const [routeDescription, setRouteDescription] = useState("")
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [nextPointId, setNextPointId] = useState(1)

  const [selectedListType, setSelectedListType] = useState<ListType | null>(null)
  const [selectedListCategory, setSelectedListCategory] = useState<string | null>(null)
  const [showCategoryChangeWarning, setShowCategoryChangeWarning] = useState(false)
  const [pendingNewListCategory, setPendingNewListCategory] = useState<string | null>(null)

  const [groupingBlocks, setGroupingBlocks] = useState<GroupingBlock[]>([])
  const [nextGroupingBlockId, setNextGroupingBlockId] = useState(1)
  const [selectedGroupingBlockId, setSelectedGroupingBlockId] = useState<string | null>(null)
  const [editingBlockName, setEditingBlockName] = useState<{ id: string; name: string } | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const [showSubcategorySelectionModal, setShowSubcategorySelectionModal] = useState(false)
  const [subcategoriesForModal, setSubcategoriesForModal] = useState<
    { id: string; name: string; icon: React.ElementType | null | string }[]
  >([])

  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPointName, setEditingPointName] = useState("")
  const [editingPointDescription, setEditingPointDescription] = useState("")
  const [termsAgreed, setTermsAgreed] = useState(false)

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationQuery, setLocationQuery] = useState("")
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])

  const [currentSlide, setCurrentSlide] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedRouteType, setSelectedRouteType] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedPoints, setExpandedPoints] = useState<number[]>([])

  const [uploadedImages, setUploadedImages] = useState<{ file: File; previewUrl: string }[]>([])
  const [selectedWhatYouSee, setSelectedWhatYouSee] = useState<string[]>([])
  const [selectedGoodToKnow, setSelectedGoodToKnow] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }))
      setUploadedImages((prev) => [...prev, ...newImages])
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => {
      const newImages = prev.filter((_, index) => index !== indexToRemove)
      URL.revokeObjectURL(prev[indexToRemove].previewUrl)
      return newImages
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    }
  }, [uploadedImages])

  const [currentEditingPoint, setCurrentEditingPoint] = useState<RoutePoint | null>(null)
  const [editingPointChanges, setEditingPointChanges] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  })

  const [editingPointImages, setEditingPointImages] = useState<{ file: File | null; previewUrl: string }[]>([])
  const pointFileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFormatting, setSelectedFormatting] = useState<FormattingOption>("normal")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [pricing, setPricing] = useState<PricingData>({
    EUR: { price: 0, isManuallySet: false },
    USD: { price: 0, isManuallySet: false },
    GBP: { price: 0, isManuallySet: false },
    JPY: { price: 0, isManuallySet: false },
    UAH: { price: 0, isManuallySet: false },
    GEL: { price: 0, isManuallySet: false },
  })
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [editingPrice, setEditingPrice] = useState("")

  const [isFreeRoute, setIsFreeRoute] = useState(false)

  const priceInputRef = useRef<HTMLInputElement>(null)

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const [showDeleteBlockModal, setShowDeleteBlockModal] = useState(false)
  const [blockToDelete, setBlockToDelete] = useState<GroupingBlock | null>(null)

  const [showDeletePointModal, setShowDeletePointModal] = useState(false)
  const [pointToDelete, setPointToDelete] = useState<RoutePoint | null>(null)

  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [selectedPointForMap, setSelectedPointForMap] = useState<RoutePoint | null>(null)
  const [tempMarker, setTempMarker] = useState<any>(null)
  // Ref to keep the current temp marker instance in sync inside map callbacks
  const tempMarkerRef = useRef<any>(null)
  // Ref to track if the add-point-from-map modal is open (avoids stale closure)
  const showAddPointFromMapModalRef = useRef(false)
  // Consistent grey color for draft marker
  const TEMP_MARKER_COLOR = "#808080"
  const MARKER_OFFSET: [number, number] = [0, -25]
  const [showConfirmButton, setShowConfirmButton] = useState(false)
  const [currentRouteGeometry, setCurrentRouteGeometry] = useState<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const selectedPointForMapRef = useRef<RoutePoint | null>(null)

  const previewMapContainerRef = useRef<HTMLDivElement>(null)
  const [previewMap, setPreviewMap] = useState<any>(null)

  const [leftPanelWidth, setLeftPanelWidth] = useState(60)
  const [isResizing, setIsResizing] = useState(false)

  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  const [isSidebarToggleOn, setIsSidebarToggleOn] = useState(false)
  const mainContentRef = useRef<HTMLDivElement>(null)

  const [currentPreviewImageIndex, setCurrentPreviewImageIndex] = useState(0)

  // New state for adding a point directly from map clicks
  const [showAddPointFromMapModal, setShowAddPointFromMapModal] = useState(false)
  useEffect(() => {
    showAddPointFromMapModalRef.current = showAddPointFromMapModal
  }, [showAddPointFromMapModal])
  const [pendingMapCoords, setPendingMapCoords] = useState<[number, number] | null>(null)
  const [pendingPointCoordsForNewBlock, setPendingPointCoordsForNewBlock] = useState<[number, number] | null>(null)

  const [showPlacePreviewCard, setShowPlacePreviewCard] = useState(false)
  const [placePreviewPosition, setPlacePreviewPosition] = useState<{ x: number; y: number } | null>(null)
  const [placePreviewData, setPlacePreviewData] = useState<{ title: string; description: string } | null>(null)

  const closePlacePreview = () => {
    setShowPlacePreviewCard(false)
    setPlacePreviewPosition(null)
    setPlacePreviewData(null)
  }

  const handleAddFromPreview = () => {
    // Закрываем карточку и открываем существующий модал выбора категории
    setShowPlacePreviewCard(false)
    setShowAddPointFromMapModal(true)
  }

  const setSelectedPointForMapWithRef = (point: RoutePoint | null) => {
    setSelectedPointForMap(point)
    selectedPointForMapRef.current = point
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

  useEffect(() => {
    if (locationQuery.trim()) {
      const filtered = locations
        .filter(
          (location) =>
            location.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
            location.country.toLowerCase().includes(locationQuery.toLowerCase()),
        )
        .slice(0, 8)
      setFilteredLocations(filtered)
      setShowLocationDropdown(true)
    } else {
      setFilteredLocations([])
      setShowLocationDropdown(false)
    }
  }, [locationQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".location-dropdown-container")) {
        setShowLocationDropdown(false)
      }
    }

    if (showLocationDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showLocationDropdown])

  useEffect(() => {
    if (!mapboxLoaded || currentStep !== 3 || !mapContainerRef.current || map) {
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

        const initialCenter: [number, number] = selectedLocation
          ? [selectedLocation.longitude, selectedLocation.latitude]
          : [2.3522, 48.8566]

        mapInstance = new window.mapboxgl.Map({
          container: container,
          style: "mapbox://styles/mapbox/streets-v11",
          center: initialCenter,
          zoom: 12,
          attributionControl: false,
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

          setMap(mapInstance)

          try {
            const pointsWithCoords = routePoints.filter((point) => point.coordinates && point.type === "route")
            pointsWithCoords.forEach((point) => {
              if (point.coordinates && isMounted) {
                const group = groupingBlocks.find((g) => g.id === point.groupId)
                const markerColor = group ? group.color : getCategoryHexColor("general-route")
                const IconComponent = group ? getGroupingBlockIcon(builderType, selectedListType, group) : MapPin
                new window.mapboxgl.Marker({
                  element: createCustomMarkerElement(markerColor, false, IconComponent),
                  offset: MARKER_OFFSET,
                })
                  .setLngLat(point.coordinates)
                  .addTo(mapInstance)
              }
            })

            if (builderType === "route" && pointsWithCoords.length >= 2 && selectedRouteType && isMounted) {
              const coordsForRoute = pointsWithCoords.map((point) => point.coordinates!)
              setTimeout(() => {
                if (isMounted) {
                  drawRoute(coordsForRoute)
                }
              }, 1000)
            }
          } catch (error) {
            console.warn("Error adding markers or drawing route:", error)
          }
        })

        mapInstance.on("error", (e: any) => {
          console.error("Mapbox error:", e.error)
        })

        mapInstance.on("click", (e: any) => {
          if (!isMounted) return

          try {
            const coords = e.lngLat
            const tuple: [number, number] = [coords.lng, coords.lat]

            if (!selectedPointForMapRef.current) {
              if (tempMarkerRef.current) {
                tempMarkerRef.current.setLngLat(coords)
              } else {
                const newTemp = new window.mapboxgl.Marker({
                  element: createCustomMarkerElement(TEMP_MARKER_COLOR, true, MapPin),
                  offset: MARKER_OFFSET,
                })
                  .setLngLat(coords)
                  .addTo(mapInstance)
                tempMarkerRef.current = newTemp
                setTempMarker(newTemp)
              }

              setPendingMapCoords(tuple)
              setShowConfirmButton(false)

              // Сохранить заготовленные данные превью места (позже заменим реальными из API)
              setPlacePreviewData({
                title: "Название локации",
                description: "Короткое описание места...",
              })

              // Позиционируем карточку над точкой клика (центрируем по X и поднимаем на 100% высоты карточки + отступ)
              setPlacePreviewPosition({ x: e.point.x, y: e.point.y })
              setShowPlacePreviewCard(true)
              return
            }

            // If a point is selected but it's not of type 'route'
            if (selectedPointForMapRef.current.type !== "route") {
              alert("This type of point does not require map coordinates.")
              return
            }

            // A point from the list is selected: use/move single grey temp marker for confirmation
            if (tempMarkerRef.current) {
              tempMarkerRef.current.setLngLat(coords)
            } else {
              const newTemp = new window.mapboxgl.Marker({
                element: createCustomMarkerElement(TEMP_MARKER_COLOR, true, MapPin),
                offset: MARKER_OFFSET,
              })
                .setLngLat(coords)
                .addTo(mapInstance)
              tempMarkerRef.current = newTemp
              setTempMarker(newTemp)
            }

            setShowConfirmButton(true)
          } catch (error) {
            console.error("Error handling map click:", error)
          }
        })
      } catch (error) {
        console.error("Map initialization error:", error)
      }
    }

    initializeMap()

    return () => {
      isMounted = false
      if (mapInstance && mapInstance !== map) {
        try {
          mapInstance.remove()
        } catch (e) {
          console.warn("Error removing map on unmount:", e)
        }
      }
    }
  }, [mapboxLoaded, currentStep, selectedLocation])

  useEffect(() => {
    if (!map) return

    const handleResize = () => {
      if (map && map.getCanvas) {
        setTimeout(() => {
          map.resize()
        }, 100)
      }
    }

    const mapContainer = mapContainerRef.current
    if (mapContainer && window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(mapContainer)

      return () => {
        resizeObserver.disconnect()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [map])

  useEffect(() => {
    if (!map || currentStep !== 3) return

    try {
      const existingMarkers = document.querySelectorAll(".v0-custom-marker")
      existingMarkers.forEach((marker) => {
        marker.remove()
      })

      if (map.getSource && map.getSource("route")) {
        if (map.getLayer && map.getLayer("route")) {
          map.removeLayer("route")
        }
        map.removeSource("route")
      }

      const pointsWithCoords = routePoints.filter((point) => point.coordinates && point.type === "route")
      pointsWithCoords.forEach((point) => {
        if (point.coordinates) {
          const group = groupingBlocks.find((g) => g.id === point.groupId)
          const markerColor = group ? group.color : getCategoryHexColor("general-route")
          const IconComponent = group ? getGroupingBlockIcon(builderType, selectedListType, group) : MapPin
          new window.mapboxgl.Marker({
            element: createCustomMarkerElement(markerColor, false, IconComponent),
            offset: MARKER_OFFSET,
          })
            .setLngLat(point.coordinates)
            .addTo(map)
        }
      })

      if (builderType === "route" && pointsWithCoords.length >= 2 && selectedRouteType) {
        const coordsForRoute = pointsWithCoords.map((point) => point.coordinates!)
        drawRoute(coordsForRoute)
      }
    } catch (error) {
      console.warn("Error updating map with route points:", error)
    }
  }, [map, routePoints, selectedRouteType, builderType, currentStep, groupingBlocks, selectedListType])

  useEffect(() => {
    if (currentStep !== 3 && map) {
      if (tempMarkerRef.current) {
        try {
          tempMarkerRef.current.remove()
        } catch (error) {
          console.warn("Error removing temp marker:", error)
        }
        tempMarkerRef.current = null
        setTempMarker(null)
      }
      setShowConfirmButton(false)
      setSelectedPointForMapWithRef(null)
      setShowPlacePreviewCard(false)
      setPlacePreviewPosition(null)
      setPlacePreviewData(null)

      try {
        map.remove()
      } catch (error) {
        console.warn("Error removing map:", error)
      }
      setMap(null)
    }
  }, [currentStep])

  useEffect(() => {
    if (map && currentStep === 3) {
      setTimeout(() => {
        map.resize()
      }, 300)
    }
  }, [leftPanelWidth, map, currentStep])

  useEffect(() => {
    if (mapboxLoaded && currentStep === 6 && currentSlide === 3 && previewMapContainerRef.current && !previewMap) {
      let isMounted = true

      const initializePreviewMap = async () => {
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

          const container = previewMapContainerRef.current
          if (!container || !isMounted) {
            return
          }

          container.innerHTML = ""

          const pointsWithCoords = routePoints.filter((point) => point.coordinates && point.type === "route")
          let center: [number, number] = selectedLocation
            ? [selectedLocation.longitude, selectedLocation.latitude]
            : [2.3522, 48.8566]

          if (pointsWithCoords.length > 0) {
            const avgLng =
              pointsWithCoords.reduce((sum, point) => sum + point.coordinates![0], 0) / pointsWithCoords.length
            const avgLat =
              pointsWithCoords.reduce((sum, point) => sum + point.coordinates![1], 0) / pointsWithCoords.length
            center = [avgLng, avgLat]
          }

          const previewMapInstance = new window.mapboxgl.Map({
            container: container,
            style: "mapbox://styles/mapbox/streets-v11",
            center: center,
            zoom: pointsWithCoords.length > 1 ? 12 : 12,
            attributionControl: false,
            interactive: false,
            dragPan: false,
            scrollZoom: false,
            boxZoom: false,
            dragRotate: false,
            keyboard: false,
            doubleClickZoom: false,
            touchZoomRotate: false,
          })

          previewMapInstance.on("load", () => {
            if (!isMounted) {
              try {
                previewMapInstance.remove()
              } catch (e) {
                console.warn("Error removing preview map on unmount:", e)
              }
              return
            }

            setPreviewMap(previewMapInstance)

            try {
              pointsWithCoords.forEach((point) => {
                if (point.coordinates && isMounted) {
                  const group = groupingBlocks.find((g) => g.id === point.groupId)
                  const markerColor = group ? group.color : getCategoryHexColor("general-route")
                  const IconComponent = group ? getGroupingBlockIcon(builderType, selectedListType, group) : MapPin
                  new window.mapboxgl.Marker({
                    element: createCustomMarkerElement(markerColor, false, IconComponent),
                    offset: MARKER_OFFSET,
                  })
                    .setLngLat(point.coordinates)
                    .addTo(previewMapInstance)
                }
              })

              if (builderType === "route" && pointsWithCoords.length >= 2 && selectedRouteType && isMounted) {
                const coordsForRoute = pointsWithCoords.map((point) => point.coordinates!)
                if (currentRouteGeometry) {
                  displayPreviewRoute(previewMapInstance, currentRouteGeometry)
                  setTimeout(() => {
                    if (isMounted && previewMapInstance) {
                      try {
                        const bounds = new window.mapboxgl.LngLatBounds()
                        pointsWithCoords.forEach((point) => {
                          if (point.coordinates) bounds.extend(point.coordinates)
                        })
                        previewMapInstance.fitBounds(bounds, { padding: 50, maxZoom: 15 })
                      } catch (error) {
                        console.warn("Error fitting bounds:", error)
                      }
                    }
                  }, 500)
                } else {
                  drawPreviewRoute(previewMapInstance, coordsForRoute)
                }
              } else if (pointsWithCoords.length > 1 && isMounted) {
                setTimeout(() => {
                  if (isMounted && previewMapInstance) {
                    try {
                      const bounds = new window.mapboxgl.LngLatBounds()
                      pointsWithCoords.forEach((point) => {
                        if (point.coordinates) bounds.extend(point.coordinates)
                      })
                      previewMapInstance.fitBounds(bounds, { padding: 50, maxZoom: 15 })
                    } catch (error) {
                      console.warn("Error fitting bounds:", error)
                    }
                  }
                }, 500)
              }
            } catch (error) {
              console.warn("Error adding markers or drawing route on preview map:", error)
            }
          })

          previewMapInstance.on("error", (e: any) => {
            console.error("Preview map error:", e.error)
          })
        } catch (error) {
          console.error("Error initializing preview map:", error)
        }
      }

      setTimeout(() => {
        if (isMounted) {
          initializePreviewMap()
        }
      }, 100)

      return () => {
        isMounted = false
      }
    }
  }, [
    mapboxLoaded,
    currentStep,
    currentSlide,
    routePoints,
    selectedRouteType,
    builderType,
    currentRouteGeometry,
    groupingBlocks,
    selectedLocation,
    selectedListType,
  ])

  useEffect(() => {
    if ((currentStep !== 6 || currentSlide !== 3) && previewMap) {
      try {
        previewMap.remove()
      } catch (error) {
        console.warn("Error removing preview map:", error)
      }
      setPreviewMap(null)
    }
  }, [currentStep, currentSlide, previewMap])

  useEffect(() => {
    return () => {
      if (map) {
        try {
          map.remove()
        } catch (error) {
          console.warn("Error removing map:", error)
        }
      }
      if (previewMap) {
        try {
          previewMap.remove()
        } catch (error) {
          console.warn("Error removing preview map:", error)
        }
      }
    }
  }, [map, previewMap])

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0
    }
  }, [currentStep])

  const confirmMapPoint = () => {
    if (tempMarkerRef.current && map && selectedPointForMapRef.current) {
      const coords = tempMarkerRef.current.getLngLat()
      const newCoords: [number, number] = [coords.lng, coords.lat]

      const updatedPoints = routePoints.map((point) =>
        point.id === selectedPointForMapRef.current!.id ? { ...point, coordinates: newCoords } : point,
      )
      setRoutePoints(updatedPoints)

      try {
        const selectedPointGroup = groupingBlocks.find((g) => g.id === selectedPointForMapRef.current!.groupId)
        const confirmedMarkerColor = selectedPointGroup
          ? selectedPointGroup.color
          : getCategoryHexColor("general-route")
        const IconComponent = selectedPointGroup
          ? getGroupingBlockIcon(builderType, selectedListType, selectedPointGroup)
          : MapPin
        new window.mapboxgl.Marker({
          element: createCustomMarkerElement(confirmedMarkerColor, false, IconComponent),
          offset: MARKER_OFFSET,
        })
          .setLngLat(coords)
          .addTo(map)
      } catch (error) {
        console.warn("Error adding confirmed marker:", error)
      }

      try {
        tempMarkerRef.current.remove()
      } catch (error) {
        console.warn("Error removing temp marker:", error)
      }
      tempMarkerRef.current = null
      setTempMarker(null)
      setShowConfirmButton(false)
      setSelectedPointForMapWithRef(null)

      const pointsWithCoords = updatedPoints.filter((point) => point.coordinates && point.type === "route")
      if (builderType === "route" && pointsWithCoords.length >= 2) {
        const coordsForRoute = pointsWithCoords.map((point) => point.coordinates!) as [number, number][]
        drawRoute(coordsForRoute)
      }
    }
  }

  const drawRoute = async (points: [number, number][]) => {
    if (!selectedRouteType || !map || !window.mapboxgl) return

    try {
      const selectedType = routeTypes.find((type) => type.id === selectedRouteType)
      const transport = selectedType?.transport || "driving"

      const coordsString = points.map((p) => p.join(",")).join(";")

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transport}/${coordsString}?geometries=geojson&access_token=${window.mapboxgl.accessToken}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry
        setCurrentRouteGeometry(routeGeometry)
        displayRoute(routeGeometry)
      } else {
        console.error("No route data:", data)
      }
    } catch (error) {
      console.error("Error building route:", error)
    }
  }

  const displayRoute = (geometry: any) => {
    if (!map) return

    try {
      if (map.getSource && map.getSource("route")) {
        if (map.getLayer && map.getLayer("route")) {
          map.removeLayer("route")
        }
        map.removeSource("route")
      }

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: geometry,
        },
      })

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      })
    } catch (error) {
      console.error("Error displaying route:", error)
    }
  }

  const drawPreviewRoute = async (mapInstance: any, points: [number, number][]) => {
    if (!selectedRouteType || !window.mapboxgl) return

    try {
      const selectedType = routeTypes.find((type) => type.id === selectedRouteType)
      const transport = selectedType?.transport || "driving"

      const coordsString = points.map((p) => p.join(",")).join(";")

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transport}/${coordsString}?geometries=geojson&access_token=${window.mapboxgl.accessToken}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry
        displayPreviewRoute(mapInstance, routeGeometry)

        setTimeout(() => {
          if (mapInstance) {
            try {
              const bounds = new window.mapboxgl.LngLatBounds()
              points.forEach((point) => bounds.extend(point))
              mapInstance.fitBounds(bounds, { padding: 50, maxZoom: 15 })
            } catch (error) {
              console.warn("Error fitting bounds after route draw:", error)
            }
          }
        }, 500)
      }
    } catch (error) {
      console.error("Error drawing preview route:", error)
    }
  }

  const displayPreviewRoute = (mapInstance: any, geometry: any) => {
    if (!mapInstance) return

    try {
      if (mapInstance.getSource && mapInstance.getSource("preview-route")) {
        if (mapInstance.getLayer && mapInstance.getLayer("preview-route")) {
          mapInstance.removeLayer("preview-route")
        }
        mapInstance.removeSource("preview-route")
      }

      mapInstance.addSource("preview-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: geometry,
        },
      })

      mapInstance.addLayer({
        id: "preview-route",
        type: "line",
        source: "preview-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      })
    } catch (error) {
      console.error("Error displaying preview route:", error)
    }
  }

  useEffect(() => {
    if (isEditingPrice && priceInputRef.current) {
      priceInputRef.current.focus()
    }
  }, [isEditingPrice])

  const isStepAccessible = (stepId: number) => {
    if (stepId === 1) return true
    return completedSteps.includes(stepId - 1) || completedSteps.includes(stepId)
  }

  const isCurrentStepCompleted = () => {
    switch (currentStep) {
      case 1:
        if (builderType === "route") {
          return routeName.trim().length > 0 && selectedDifficulty !== null && selectedLocation !== null
        }
        return routeName.trim().length > 0 && selectedLocation !== null
      case 2:
        if (builderType === "route") {
          return selectedRouteType !== null && selectedCategory !== null
        } else {
          return selectedListType !== null && (selectedListType === "mix" || selectedListCategory !== null)
        }
      case 3:
        return groupingBlocks.length > 0 && routePoints.length > 0
      case 4:
        return true
      case 5:
        return pricing.EUR.price > 0 || isFreeRoute
      case 6:
        return termsAgreed
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (isCurrentStepCompleted() && currentStep < steps.length) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(currentStep + 1)
      setCurrentSlide(1)
    }
  }

  const handleStepClick = (stepId: number) => {
    if (isStepAccessible(stepId)) {
      if (stepId !== 3 && map) {
        try {
          if (tempMarkerRef.current) {
            tempMarkerRef.current.remove()
            setTempMarker(null)
          }
          map.remove()
          setMap(null)
        } catch (error) {
          console.warn("Error cleaning up map:", error)
        }
        setShowConfirmButton(false)
        setSelectedPointForMapWithRef(null)
      }

      if (stepId !== 6 && previewMap) {
        try {
          previewMap.remove()
        } catch (error) {
          console.warn("Error cleaning up preview map:", error)
        }
      }

      setCurrentStep(stepId)
      setCurrentSlide(1)
    }
  }

  const getGroupingBlockIcon = (
    builderType: string,
    selectedListType: ListType | null,
    group: GroupingBlock,
  ): React.ElementType | string => {
    if (builderType === "route") {
      if (group.mainCategoryId === "general-route") {
        return MapPin
      }
      const category = categories.find((cat) => group.mainCategoryId === cat.id)
      return category?.icon || MapPin
    } else {
      if (selectedListType === "mix") {
        const mainCategory = listCategories.find((cat) => cat.id === group.subcategoryId)
        return mainCategory?.icon || "❓"
      } else if (selectedListType === "category" && group.subcategoryId) {
        return getIconComponentBySubcategoryId(group.subcategoryId) || MapPin
      }
    }
    return MapPin
  }

  const handleOpenAddSubcategoryModal = () => {
    setShowPlacePreviewCard(false)
    setPlacePreviewPosition(null)
    if (builderType === "route") {
      if (!selectedCategory) {
        alert("Please select a main category in 'Route Type' step first.")
        return
      }

      const selectedMainCategoryData = whatYouWillSeeCategories.find((cat) => cat.id === selectedCategory)

      if (selectedMainCategoryData) {
        const mappedSubcategories = selectedMainCategoryData.items.map((item) => ({
          id: item.id,
          name: item.name,
          icon: getIconComponentBySubcategoryId(item.id) || Camera,
        }))
        setSubcategoriesForModal(mappedSubcategories)
        setShowSubcategorySelectionModal(true)
      } else {
        alert("Could not find subcategories for the selected main category.")
      }
    } else {
      if (!selectedListType) {
        alert("Please select a list type first (Mix List or Category List).")
        return
      }

      if (selectedListType === "mix") {
        const mappedCategories = listCategories.map((category) => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
        }))
        setSubcategoriesForModal(mappedCategories)
        setShowSubcategorySelectionModal(true)
      } else if (selectedListType === "category" && selectedListCategory) {
        const selectedCategoryData = getListCategory(selectedListCategory)
        if (selectedCategoryData && selectedCategoryData.subcategories.length > 0) {
          const mappedSubcategories = selectedCategoryData.subcategories.map((subcategory) => ({
            id: subcategory.id,
            name: subcategory.name,
            icon: getIconComponentBySubcategoryId(subcategory.id) || Camera,
          }))
          setSubcategoriesForModal(mappedSubcategories)
          setShowSubcategorySelectionModal(true)
        } else {
          alert("This category has no subcategories or category not found.")
        }
      } else {
        alert("Please select a category first for your specialized list.")
      }
    }
  }

  // Modified: confirmAddSubcategory can also add a point at pending coords (if set)
  const confirmAddSubcategory = (subcategoryId: string, subcategoryName: string) => {
    const uniqueBlockId = `${subcategoryId}-${nextGroupingBlockId}`

    let blockColor: string
    let mainCatId: string | undefined

    if (builderType === "route") {
      mainCatId = selectedCategory || "default"
      blockColor = getCategoryHexColor(mainCatId === "default" ? "general-route" : mainCatId)
    } else {
      if (selectedListType === "mix") {
        mainCatId = subcategoryId
        blockColor = getCategoryHexColor(mainCatId + "-list")
      } else if (selectedListType === "category" && selectedListCategory) {
        mainCatId = selectedListCategory
        blockColor = getCategoryHexColor(mainCatId + "-list")
      } else {
        blockColor = getCategoryHexColor("general-route")
      }
    }

    const newBlock: GroupingBlock = {
      id: uniqueBlockId,
      name: subcategoryName,
      color: blockColor,
      pointIds: [],
      subcategoryId: subcategoryId,
      mainCategoryId: mainCatId,
    }

    setGroupingBlocks((prev) => [...prev, newBlock])
    setNextGroupingBlockId((prev) => prev + 1)
    setSelectedGroupingBlockId(uniqueBlockId)
    setExpandedGroups((prev) => [...prev, uniqueBlockId])
    setShowSubcategorySelectionModal(false)

    // If we were adding a point from a map click, create it now inside the new block
    if (pendingPointCoordsForNewBlock) {
      addPointAtCoordsToGroup(pendingPointCoordsForNewBlock, newBlock)
      setPendingPointCoordsForNewBlock(null)
    }
  }

  const addPointToSelectedGroup = (type: PointType, targetGroupId?: string) => {
    const newPointId = nextPointId
    setNextPointId((prev) => prev + 1)

    setGroupingBlocks((prevBlocks) => {
      let actualTargetGroupId: string | undefined
      const updatedBlocks = [...prevBlocks]

      if (targetGroupId && updatedBlocks.some((block) => block.id === targetGroupId)) {
        actualTargetGroupId = targetGroupId
      } else if (selectedGroupingBlockId && updatedBlocks.some((block) => block.id === selectedGroupingBlockId)) {
        actualTargetGroupId = selectedGroupingBlockId
      } else if (updatedBlocks.length > 0) {
        actualTargetGroupId = updatedBlocks[0].id
        setSelectedGroupingBlockId(actualTargetGroupId)
      } else {
        const newBlockId = `default-group-${nextGroupingBlockId}`
        const defaultMainCatId =
          builderType === "route" ? selectedCategory || "general-route" : selectedListCategory || "places"
        const newBlock: GroupingBlock = {
          id: newBlockId,
          name: `Default Category ${nextGroupingBlockId}`,
          color: getCategoryHexColor(defaultMainCatId),
          pointIds: [],
          mainCategoryId: defaultMainCatId,
        }
        updatedBlocks.push(newBlock)
        setNextGroupingBlockId((prev) => prev + 1)
        actualTargetGroupId = newBlockId
        setSelectedGroupingBlockId(newBlockId)
        setExpandedGroups((prev) => [...prev, newBlockId])
      }

      const newPoint: RoutePoint = {
        id: newPointId,
        name: "",
        description: "",
        images: [],
        type: type,
        coordinates: type === "route" ? undefined : undefined,
        groupId: actualTargetGroupId,
      }

      setRoutePoints((prevPoints) => [...prevPoints, newPoint])

      return updatedBlocks.map((block) =>
        block.id === actualTargetGroupId ? { ...block, pointIds: [...block.pointIds, newPointId] } : block,
      )
    })
  }

  // Helper: Add a new point with given coords into a specific block, update map markers, and close temp artifacts
  const addPointAtCoordsToGroup = (coords: [number, number], group: GroupingBlock) => {
    const newPointId = nextPointId
    setNextPointId((prev) => prev + 1)

    const newPoint: RoutePoint = {
      id: newPointId,
      name: "",
      description: "",
      images: [],
      type: "route",
      coordinates: coords,
      groupId: group.id,
    }

    setRoutePoints((prev) => [...prev, newPoint])
    setGroupingBlocks((prev) =>
      prev.map((b) => (b.id === group.id ? { ...b, pointIds: [...b.pointIds, newPointId] } : b)),
    )

    // Add a permanent marker
    try {
      if (map && window.mapboxgl) {
        const IconComponent = getGroupingBlockIcon(builderType, selectedListType, group)
        new window.mapboxgl.Marker({
          element: createCustomMarkerElement(group.color, false, IconComponent),
          offset: MARKER_OFFSET,
        })
          .setLngLat({ lng: coords[0], lat: coords[1] })
          .addTo(map)
      }
    } catch (error) {
      console.warn("Error adding marker for new point:", error)
    }

    // Clean up temp marker and modal
    if (tempMarkerRef.current) {
      try {
        tempMarkerRef.current.remove()
      } catch {}
      tempMarkerRef.current = null
      setTempMarker(null)
    }
    setShowAddPointFromMapModal(false)
    setPendingMapCoords(null)

    // Auto-select this point (optional)
    setSelectedPointForMapWithRef(newPoint)

    // If it's a route and enough points exist, redraw route
    const pointsWithCoords = [...routePoints, newPoint].filter((p) => p.coordinates && p.type === "route")
    if (builderType === "route" && pointsWithCoords.length >= 2 && selectedRouteType) {
      const coordsForRoute = pointsWithCoords.map((p) => p.coordinates!) as [number, number][]
      drawRoute(coordsForRoute)
    }
  }

  const openPointModal = (point: RoutePoint) => {
    setSelectedPoint(point)
    setEditingPointName(point.name)
    setEditingPointDescription(point.description)
    setHasUnsavedChanges(false)
    setIsModalOpen(true)
  }

  const closePointModal = () => {
    if (hasUnsavedChanges) {
      const cancelBtn = document.querySelector("[data-cancel-btn]")
      const saveBtn = document.querySelector("[data-save-btn]")

      if (cancelBtn && saveBtn) {
        cancelBtn.classList.add("animate-pulse")
        saveBtn.classList.add("animate-pulse")
        setTimeout(() => {
          cancelBtn.classList.remove("animate-pulse")
          saveBtn.classList.remove("animate-pulse")
          saveBtn.classList.remove("animate-pulse")
        }, 1000)
      }
      return
    }

    setIsModalOpen(false)
    setSelectedPoint(null)
    setEditingPointName("")
    setEditingPointDescription("")
    setHasUnsavedChanges(false)
  }

  const savePointChanges = () => {
    if (selectedPoint) {
      const updatedPoints = routePoints.map((point) =>
        point.id === selectedPoint.id
          ? { ...point, name: editingPointName, description: editingPointDescription }
          : point,
      )
      setRoutePoints(updatedPoints)
    }
    setIsModalOpen(false)
    setSelectedPoint(null)
    setEditingPointName("")
    setEditingPointDescription("")
    setHasUnsavedChanges(false)
  }

  const handlePointNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEditingPointName(newValue)

    if (selectedPoint && (newValue !== selectedPoint.name || editingPointDescription !== selectedPoint.description)) {
      setHasUnsavedChanges(true)
    } else {
      setHasUnsavedChanges(false)
    }
  }

  const handlePointDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setEditingPointDescription(newValue)

    if (selectedPoint && (editingPointName !== selectedPoint.name || newValue !== selectedPoint.description)) {
      setHasUnsavedChanges(true)
    } else {
      setHasUnsavedChanges(false)
    }
  }

  const cancelPointChanges = () => {
    setIsModalOpen(false)
    setSelectedPoint(null)
    setEditingPointName("")
    setEditingPointDescription("")
    setHasUnsavedChanges(false)
  }

  const handleFormattingClick = (format: FormattingOption) => {
    const textarea = textareaRef.current
    if (!textarea) {
      setSelectedFormatting(format)
      return
    }

    try {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = routeDescription.substring(start, end)

      if (selectedText) {
        const formattedText = applyFormatting(selectedText, format)
        const newValue = routeDescription.substring(0, start) + formattedText + routeDescription.substring(end)
        setRouteDescription(newValue)

        requestAnimationFrame(() => {
          if (textarea && document.contains(textarea)) {
            textarea.focus()
            textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
          }
        })
      } else {
        setSelectedFormatting(format)
      }
    } catch (error) {
      console.warn("Formatting error:", error)
      setSelectedFormatting(format)
    }
  }

  const applyFormatting = (text: string, format: FormattingOption) => {
    switch (format) {
      case "bold":
        return `**${text}**`
      case "italic":
        return `*${text}*`
      case "underline":
        return `_${text}_`
      case "strikethrough":
        return `~~${text}~~`
      case "list":
        return text
          .split("\n")
          .map((line) => (line.trim() ? `• ${line}` : line))
          .join("\n")
      default:
        return text
    }
  }

  const removeFormatting = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      .replace(/~~(.*?)~~/g, "$1")
      .replace(/^• /gm, "")
  }

  const getFormattingButtonClass = (format: FormattingOption) => {
    const baseClass = "px-[17px] py-[2px] transition-colors mr-1 rounded-xl"
    if (selectedFormatting === format) {
      return `${baseClass} bg-[#1a1a1a] text-white`
    }
    return `${baseClass} text-gray-400 hover:text-white`
  }

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    try {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const currentValue = routeDescription

      const newValue = currentValue.substring(0, start) + text + currentValue.substring(end)
      setRouteDescription(newValue)

      requestAnimationFrame(() => {
        if (textarea && document.contains(textarea)) {
          textarea.focus()
          textarea.setSelectionRange(start + text.length, start + text.length)
        }
      })
    } catch (error) {
      console.warn("Insert text error:", error)
    }
  }

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && selectedFormatting === "list") {
      e.preventDefault()
      insertTextAtCursor("\n• ")
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const textarea = e.target

    try {
      const cursorPosition = textarea.selectionStart
      const lastChar = value[cursorPosition - 1]

      if (lastChar && cursorPosition > 0 && selectedFormatting !== "normal") {
        let formattedText = value
        let newCursorPosition = cursorPosition

        if (lastChar === " " && selectedFormatting !== "list") {
          const beforeSpace = value.substring(0, cursorPosition - 1)
          const afterSpace = value.substring(cursorPosition)

          const words = beforeSpace.split(" ")
          if (words.length > 0) {
            const lastWord = words[words.length - 1]
            if (lastWord && !isAlreadyFormatted(lastWord, selectedFormatting)) {
              const formattedWord = applyFormatting(lastWord, selectedFormatting)
              words[words.length - 1] = formattedWord
              formattedText = words.join(" ") + " " + afterSpace
              newCursorPosition = cursorPosition + (formattedWord.length - lastWord.length)
            }
          }
        } else if (lastChar === "\n" && selectedFormatting === "list") {
          formattedText = value + "• "
          newCursorPosition = cursorPosition + 2
        }

        setRouteDescription(formattedText)

        if (newCursorPosition !== cursorPosition) {
          requestAnimationFrame(() => {
            if (textarea && document.contains(textarea)) {
              textarea.focus()
              textarea.setSelectionRange(newCursorPosition, newCursorPosition)
            }
          })
        }
      } else {
        setRouteDescription(value)
      }

      textarea.style.height = "200px"
      if (textarea.scrollHeight > 200) {
        textarea.style.height = textarea.scrollHeight + "px"
      }
    } catch (error) {
      console.warn("Textarea input error:", error)
      setRouteDescription(value)
    }
  }

  const isAlreadyFormatted = (text: string, format: FormattingOption) => {
    switch (format) {
      case "bold":
        return text.startsWith("**") && text.endsWith("**")
      case "italic":
        return text.startsWith("*") && text.endsWith("*") && !text.startsWith("**")
      case "underline":
        return text.startsWith("_") && text.endsWith("_")
      case "strikethrough":
        return text.startsWith("~~") && text.endsWith("~~")
      case "list":
        return false
      default:
        return false
    }
  }

  const updatePricing = (currencyCode: string, newPrice: number, isManual = true) => {
    const newPricing: PricingData = {
      EUR: { ...pricing.EUR },
      USD: { ...pricing.USD },
      GBP: { ...pricing.GBP },
      JPY: { ...pricing.JPY },
      UAH: { ...pricing.UAH },
      GEL: { ...pricing.GEL },
    }

    if (currencyCode === "EUR") {
      newPricing.EUR = { price: newPrice, isManuallySet: isManual }
      currencies.forEach((currency) => {
        if (currency.code !== "EUR" && !newPricing[currency.code].isManuallySet) {
          const convertedPrice = Math.ceil(newPrice * currency.rate)
          newPricing[currency.code] = { price: convertedPrice, isManuallySet: false }
        }
      })
    } else {
      newPricing[currencyCode] = { price: newPrice, isManuallySet: true }
    }

    setPricing(newPricing)
  }

  const adjustPrice = (delta: number) => {
    const currentPrice = pricing[selectedCurrency].price
    const newPrice = Math.max(0, currentPrice + delta)
    updatePricing(selectedCurrency, newPrice)
  }

  const getCurrentCurrency = () => {
    return currencies.find((c) => c.code === selectedCurrency) || currencies[0]
  }

  const calculateServiceFee = (price: number) => {
    return Math.ceil(price * 0.1)
  }

  const calculateCreatorEarnings = (price: number) => {
    return price - calculateServiceFee(price)
  }

  const startEditingPrice = () => {
    setEditingPrice(pricing[selectedCurrency].price.toString())
    setIsEditingPrice(true)
  }

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setEditingPrice(value)
  }

  const handlePriceInputBlur = () => {
    const newPrice = Number.parseInt(editingPrice) || 0
    updatePricing(selectedCurrency, newPrice)
    setIsEditingPrice(false)
  }

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePriceInputBlur()
    } else if (e.key === "Escape") {
      setIsEditingPrice(false)
    }
  }

  const handleSaveDraft = () => {
    setShowDraftModal(true)
    setTimeout(() => {
      setShowDraftModal(false)
    }, 3000)
  }

  const handlePublish = () => {
    if (isCurrentStepCompleted()) {
      setShowPublishModal(true)
      setTimeout(() => {
        setShowPublishModal(false)
      }, 5000)
    }
  }

  const getCurrentStepTitle = () => {
    if (builderType === "route") {
      switch (currentStep) {
        case 1:
          return "Basic Information"
        case 2:
          return "Select Route Type"
        case 3:
          return "Create Route Points & Map"
        case 4:
          return "Route Details"
        case 5:
          return "Set Route Price"
        case 6:
          return "Publish Your Route"
        default:
          return ""
      }
    } else {
      switch (currentStep) {
        case 1:
          return "Basic Information"
        case 2:
          return "List Category"
        case 3:
          return "List Points & Map"
        case 4:
          return "List Details"
        case 5:
          return "List Pricing Policy"
        case 6:
          return "Publication"
        default:
          return ""
      }
    }
  }

  const togglePointExpansion = (pointId: number) => {
    const clickedPoint = routePoints.find((p) => p.id === pointId)
    if (!clickedPoint) return

    if (expandedPoints.includes(pointId)) {
      if (currentEditingPoint) {
        saveCurrentPointChanges()
      }
      setExpandedPoints([])
      setCurrentEditingPoint(null)
      setEditingPointChanges({ name: "", description: "" })
      setEditingPointImages([])
      return
    }

    if (currentEditingPoint && expandedPoints.length > 0) {
      saveCurrentPointChanges()
    }

    setExpandedPoints([pointId])
    setCurrentEditingPoint(clickedPoint)
    setEditingPointChanges({
      name: clickedPoint.name,
      description: clickedPoint.description,
    })
    setEditingPointImages(clickedPoint.images.map((url) => ({ file: null, previewUrl: url })))
  }

  const saveCurrentPointChanges = () => {
    if (currentEditingPoint) {
      const updatedPoints = routePoints.map((point) =>
        point.id === currentEditingPoint.id
          ? {
              ...point,
              name: editingPointChanges.name,
              description: editingPointChanges.description,
              images: editingPointImages.map((img) => img.previewUrl),
            }
          : point,
      )
      setRoutePoints(updatedPoints)
    }
  }

  const handlePointImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files)
        .filter((_, i) => editingPointImages.length + i < 3)
        .map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        }))
      setEditingPointImages((prev) => [...prev, ...newImages])
    }
  }

  const handleRemovePointImage = (indexToRemove: number) => {
    setEditingPointImages((prev) => {
      const newImages = prev.filter((_, index) => index !== indexToRemove)
      if (prev[indexToRemove].file) {
        URL.revokeObjectURL(prev[indexToRemove].previewUrl)
      }
      return newImages
    })
  }

  const triggerPointFileInput = () => {
    pointFileInputRef.current?.click()
  }

  const updatePointInline = (pointId: number, field: "name" | "description", value: string) => {
    const updatedPoints = routePoints.map((point) => (point.id === pointId ? { ...point, [field]: value } : point))
    setRoutePoints(updatedPoints)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const container = document.querySelector(".resizable-container")
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

    const constrainedWidth = Math.min(Math.max(newLeftWidth, 30), 80)
    setLeftPanelWidth(constrainedWidth)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing])

  const handleDeleteBlock = (group: GroupingBlock) => {
    setBlockToDelete(group)
    setShowDeleteBlockModal(true)
  }

  const confirmDeleteBlock = () => {
    if (blockToDelete) {
      setRoutePoints((prevPoints) => prevPoints.filter((point) => point.groupId !== blockToDelete.id))
      setGroupingBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== blockToDelete.id))
      if (selectedGroupingBlockId === blockToDelete.id) {
        setSelectedGroupingBlockId(null)
      }
      setExpandedGroups((prev) => prev.filter((id) => id !== blockToDelete.id))
      setBlockToDelete(null)
      setShowDeleteBlockModal(false)
    }
  }

  const cancelDeleteBlock = () => {
    setBlockToDelete(null)
    setShowDeleteBlockModal(false)
  }

  const handleDeletePoint = (point: RoutePoint) => {
    setPointToDelete(point)
    setShowDeletePointModal(true)
  }

  const confirmDeletePoint = () => {
    if (pointToDelete) {
      const updatedPoints = routePoints.filter((p) => p.id !== pointToDelete.id)
      setRoutePoints(updatedPoints)
      setGroupingBlocks((prevBlocks) =>
        prevBlocks.map((b) =>
          b.id === pointToDelete.groupId ? { ...b, pointIds: b.pointIds.filter((pId) => pId !== pointToDelete.id) } : b,
        ),
      )
      setExpandedPoints((prev) => prev.filter((id) => id !== pointToDelete.id))
      setPointToDelete(null)
      setShowDeletePointModal(false)
    }
  }

  const cancelDeletePoint = () => {
    setPointToDelete(null)
    setShowDeletePointModal(false)
  }

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleListCategoryChange = (categoryId: string) => {
    if (
      builderType !== "route" && // или используйте isListBuilder
      selectedListType === "category" &&
      (groupingBlocks.length > 0 || routePoints.length > 0) &&
      selectedListCategory !== categoryId
    ) {
      setPendingNewListCategory(categoryId)
      setShowCategoryChangeWarning(true)
    } else {
      setSelectedListCategory(categoryId)
    }
  }

  const confirmCategoryChange = () => {
    if (pendingNewListCategory) {
      setSelectedListCategory(pendingNewListCategory)
      setGroupingBlocks([])
      setNextGroupingBlockId(1)
      setSelectedGroupingBlockId(null)
      setExpandedGroups([])
      setRoutePoints([])
      setNextPointId(1)
      setSelectedPointForMap(null)
      if (tempMarker) {
        tempMarker.remove()
        setTempMarker(null)
      }
      setShowConfirmButton(false)
      setCurrentRouteGeometry(null)
      setUploadedImages([])
      setSelectedWhatYouSee([])
      setSelectedGoodToKnow([])
      setShowCategoryChangeWarning(false)
      setPendingNewListCategory(null)
    }
  }

  const cancelCategoryChange = () => {
    setShowCategoryChangeWarning(false)
    setPendingNewListCategory(null)
  }

  const renderCombinedPointsAndMap = () => (
    <div className="flex flex-col md:flex-row h-full resizable-container" style={{ gap: "2px" }}>
      <div
        className="flex flex-col"
        style={{
          width: typeof window !== "undefined" && window.innerWidth >= 768 ? `${leftPanelWidth}%` : "100%",
          minWidth: typeof window !== "undefined" && window.innerWidth >= 768 ? "300px" : "auto",
        }}
      >
        <div className="flex-1 bg-[#141415] border border-gray-600 rounded-lg md:rounded-xl overflow-hidden relative">
          <div className="absolute top-3 md:top-4 left-3 md:left-4 z-10 w-48 md:w-80">
            <input
              type="text"
              placeholder="Поиск"
              className="w-full bg-black/50 backdrop-blur-sm border border-gray-600 rounded-full px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 text-sm md:text-base"
            />
          </div>

          <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
          {showPlacePreviewCard && pendingMapCoords && placePreviewPosition && (
            <div
              className="absolute z-20"
              style={{
                top: placePreviewPosition.y,
                left: placePreviewPosition.x,
                // подняли карточку ещё на 50px
                transform: "translate(-50%, calc(-100% - 62px))",
              }}
            >
              <div className="relative w-72 rounded-xl border border-[#404040] bg-[#1a1a1a] shadow-xl">
                {/* Close button for the entire card */}
                <button
                  onClick={closePlacePreview}
                  className="absolute right-2 top-2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                  aria-label="Закрыть"
                >
                  <X size={14} />
                </button>

                <div className="p-3">
                  {/* 16:9 image placeholder with same rounding as the action button */}
                  <div className="relative w-full overflow-hidden rounded-lg bg-[#2a2a2a] border border-[#404040]">
                    {/* 16:9 ratio via padding box */}
                    <div style={{ paddingTop: "56.25%" }} />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Camera size={20} />
                    </div>
                  </div>

                  <div className="mt-3 text-sm font-semibold text-white line-clamp-1">
                    {placePreviewData?.title || "Название локации"}
                  </div>
                  <div className="mt-1 text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {placePreviewData?.description || "Короткое описание места..."}
                  </div>

                  <button
                    onClick={handleAddFromPreview}
                    className="mt-3 w-full rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-100 transition-colors"
                  >
                    {"Добавить как точку"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!mapboxLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#141415]">
              <div className="text-white">Loading map...</div>
            </div>
          )}

          {showConfirmButton && selectedPointForMap && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={confirmMapPoint}
                className="bg-[#007AFF] hover:bg-[#0056CC] text-white rounded-full px-5 py-2 text-base font-medium transition-all duration-200 shadow-lg flex items-center gap-2"
              >
                <Check size={18} />
                Confirm location
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="hidden md:flex items-center justify-center w-2 cursor-col-resize hover:bg-gray-600 transition-colors rounded-full group"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-8 bg-gray-500 rounded-full group-hover:bg-gray-400 transition-colors"></div>
      </div>

      <div className="flex-1 h-full flex flex-col">
        <div className="flex items-center gap-3 pb-1.5 border-b border-[#404040]">
          <button
            onClick={handleOpenAddSubcategoryModal}
            className="flex items-center justify-center bg-[#34C759] hover:bg-[#28A745] text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
          >
            <Plus size={16} className="mr-2" />
            Add Subcategory
          </button>
          <button
            onClick={() => addPointToSelectedGroup("route")}
            className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
          >
            <Plus size={16} className="mr-2" />
            Add default point
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {groupingBlocks.map((group) => {
              const isEditingThisBlockName = editingBlockName?.id === group.id
              const isGroupExpanded = expandedGroups.includes(group.id)
              const GroupIconComponentOrEmoji = getGroupingBlockIcon(builderType, selectedListType, group)

              return (
                <div key={group.id} className="bg-[#1c1c1e] border border-[#404040] rounded-2xl overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: group.color }}
                        >
                          {typeof GroupIconComponentOrEmoji === "string" ? (
                            <span className="text-lg">{GroupIconComponentOrEmoji}</span>
                          ) : (
                            <GroupIconComponentOrEmoji size={18} className="text-white" />
                          )}
                        </div>
                        {isEditingThisBlockName ? (
                          <input
                            type="text"
                            value={editingBlockName.name}
                            onChange={(e) => setEditingBlockName({ id: group.id, name: e.target.value })}
                            onBlur={() => {
                              setGroupingBlocks((prev) =>
                                prev.map((b) => (b.id === group.id ? { ...b, name: editingBlockName.name } : b)),
                              )
                              setEditingBlockName(null)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur()
                              }
                            }}
                            className="flex-1 bg-transparent border-none text-white text-lg font-semibold focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <h3
                            className="text-white text-lg font-semibold cursor-pointer flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingBlockName({ id: group.id, name: group.name })
                            }}
                          >
                            {group.name}
                          </h3>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addPointToSelectedGroup("route", group.id)
                          }}
                          className="bg-[#404040] hover:bg-[#505050] text-white rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-1"
                        >
                          <Plus size={14} />
                          Add point
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleGroupExpansion(group.id)
                          }}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          {isGroupExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isGroupExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      {routePoints
                        .filter((point) => point.groupId === group.id)
                        .map((point) => {
                          const isSelected = selectedPointForMap?.id === point.id
                          const isExpanded = expandedPoints.includes(point.id)

                          return (
                            <div
                              key={point.id}
                              onClick={() => {
                                if (!isExpanded) {
                                  setSelectedPointForMapWithRef(point)
                                }
                              }}
                              className={`bg-[#2c2c2e] border border-[#404040] rounded-xl p-3 transition-all duration-200 ${
                                isSelected ? "border-[#007AFF]" : ""
                              } ${!isExpanded ? "cursor-pointer" : ""}`}
                            >
                              <div className="flex items-start gap-3">
                                {!isExpanded && (
                                  <div className="flex-shrink-0 w-12 h-12 bg-[#404040] rounded-lg flex items-center justify-center overflow-hidden">
                                    {point.images && point.images.length > 0 ? (
                                      <Image
                                        src={point.images[0] || "/placeholder.svg"}
                                        alt={point.name || `Point ${point.id}`}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <Camera size={16} className="text-gray-400" />
                                    )}
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  {isExpanded ? (
                                    <input
                                      type="text"
                                      value={editingPointChanges.name}
                                      onChange={(e) => handleEditingPointNameChange(e.target.value)}
                                      placeholder="Enter point name"
                                      className="w-full bg-[#141415] border border-[#404040] rounded-lg px-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:border-[#007AFF] transition-all text-sm mb-1"
                                    />
                                  ) : (
                                    <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">
                                      {point.name || "Untitled Point"}
                                    </h4>
                                  )}
                                  {isExpanded ? null : (
                                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                                      {point.description || "Add a description for this point..."}
                                    </p>
                                  )}
                                </div>

                                {!isExpanded && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => togglePointExpansion(point.id)}
                                      className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#404040]"
                                    >
                                      <Pencil size={14} />
                                    </button>

                                    {point.type === "route" && (
                                      <button
                                        onClick={() => setSelectedPointForMapWithRef(point)}
                                        className={`transition-colors p-1.5 rounded-lg hover:bg-[#404040] ${
                                          isSelected
                                            ? "text-[#007AFF]"
                                            : point.coordinates
                                              ? "text-[#34C759]"
                                              : "text-gray-400 hover:text-white"
                                        }`}
                                      >
                                        <MapPin size={14} />
                                      </button>
                                    )}

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeletePoint(point)
                                      }}
                                      className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#404040]"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                    {/* COMPACT POINT CARD ACTION BUTTONS - UPDATE HERE */}
                                  </div>
                                )}
                              </div>

                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-[#404040] space-y-3">
                                  <textarea
                                    value={editingPointChanges.description}
                                    onChange={(e) => handleEditingPointDescriptionChange(e.target.value)}
                                    placeholder="Add point description..."
                                    className="w-full bg-[#141415] border border-[#404040] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#007AFF] transition-all text-sm resize-none"
                                    rows={4}
                                  />

                                  <div>
                                    <label className="block text-white text-sm font-medium mb-2">Point Images</label>
                                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-2 text-center hover:border-gray-500 transition-colors cursor-pointer bg-[#2a2a2a] relative flex flex-col items-center overflow-hidden">
                                      {editingPointImages.length > 0 && (
                                        <div className="flex gap-3 overflow-x-auto w-full justify-start mb-4 custom-image-scrollbar">
                                          {editingPointImages.map((image, idx) => (
                                            <div
                                              key={idx}
                                              className="relative flex-shrink-0 w-[100px] h-16 bg-[#3a3a3a] rounded-lg border border-gray-600 flex items-center p-2 group"
                                            >
                                              <Image
                                                src={image.previewUrl || "/placeholder.svg"}
                                                alt={`Point image ${idx}`}
                                                width={48}
                                                height={48}
                                                className="object-cover w-full h-full"
                                              />
                                              <div className="flex flex-col text-left overflow-hidden">
                                                <div className="text-xs text-gray-200 truncate">
                                                  {image.file?.name || `Image ${idx + 1}`}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                  {image.file ? `${(image.size / 1024).toFixed(2)}KB` : "Existing"}
                                                </div>
                                              </div>
                                              <button
                                                onClick={() => handleRemovePointImage(idx)}
                                                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                aria-label="Remove image"
                                              >
                                                <X size={12} />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {editingPointImages.length < 3 ? (
                                        <div className="flex flex-col items-center justify-center flex-1">
                                          <p className="text-gray-300 text-sm mb-3">
                                            Drag & drop images here or click to browse
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center justify-center flex-1">
                                          <p className="text-gray-400 text-sm mb-3">
                                            Maximum 3 images uploaded for this point.
                                          </p>
                                        </div>
                                      )}
                                      <button
                                        onClick={triggerPointFileInput}
                                        disabled={editingPointImages.length >= 3}
                                        className={`bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm ${
                                          editingPointImages.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                      >
                                        Upload
                                      </button>
                                      <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        ref={pointFileInputRef}
                                        onChange={handlePointImageUpload}
                                      />
                                    </div>
                                  </div>

                                  <button
                                    onClick={savePointManually}
                                    className="w-full bg-[#007AFF] hover:bg-[#0056CC] text-white py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                  >
                                    Save changes
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="pt-1.5 border-t border-[#404040]">
          <button
            onClick={handleNextStep}
            disabled={!isCurrentStepCompleted() || currentStep >= steps.length}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
              isCurrentStepCompleted() && currentStep < steps.length
                ? "bg-[#404040] hover:bg-[#505050] text-white"
                : "bg-[#2c2c2e] text-gray-500 cursor-not-allowed"
            }`}
          >
            Next step
          </button>
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo()
      case 2:
        return renderListCategoryStep()
      case 3:
        return renderCombinedPointsAndMap()
      case 4:
        return renderRouteDetails()
      case 5:
        return renderPricing()
      case 6:
        return renderPublication()
      default:
        return null
    }
  }

  const renderListCategoryStep = () => {
    if (builderType === "route") {
      return (
        <div className="flex flex-col h-full">
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6">
            <h2 className="text-white text-xl md:text-2xl font-medium mb-2 text-left">Choose Route Category</h2>
            <p className="text-gray-400 text-sm md:text-base mb-6 text-left">
              Select the category that best describes your route
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon
                const isSelected = selectedCategory === category.id

                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex flex-col items-center justify-center bg-[#1a1a1a] border rounded-lg md:rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected ? "border-v0_purple bg-v0_purple" : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <div className="mb-2">
                      <IconComponent size={24} className="text-gray-300 md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-white text-sm md:text-base font-medium mb-1 text-center">{category.name}</h3>
                    <p className="text-gray-300 text-xs text-center leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 md:mt-12">
              <h2 className="text-white text-xl md:text-2xl font-medium mb-2 text-left">Travel Mode</h2>
              <p className="text-gray-400 text-sm md:text-base mb-6 text-left">
                How will you be traveling on this route?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {routeTypes.map((routeType) => (
                  <div
                    key={routeType.id}
                    onClick={() => setSelectedRouteType(routeType.id)}
                    className={`flex flex-col items-center bg-[#1a1a1a] border rounded-xl p-5 cursor-pointer transition-all ${
                      selectedRouteType === routeType.id
                        ? "border-v0_purple bg-v0_purple"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <div className="mb-3">
                      <Image
                        src={routeType.icon || "/placeholder.svg"}
                        alt={routeType.title}
                        width={40}
                        height={40}
                        className="opacity-80 md:w-12 md:h-12"
                      />
                    </div>
                    <h3 className="text-white text-base md:text-lg font-medium mb-1 text-center">{routeType.title}</h3>
                    <p className="text-gray-300 text-xs md:text-sm text-center leading-relaxed line-clamp-2">
                      {routeType.description}
                    </p>
                    <div className="flex items-center text-gray-300 text-xs mt-2">
                      <Info size={12} className="mr-1" />
                      <span>{routeType.pace}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6">
          <h2 className="text-white text-xl md:text-2xl font-medium mb-2 text-left">Choose List Type</h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 text-left">
            Select the type of list you want to create
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
            <div
              onClick={() => {
                setSelectedListType("mix")
                setSelectedListCategory(null)
              }}
              className={`flex flex-col items-center bg-[#1a1a1a] border rounded-xl p-6 cursor-pointer transition-all ${
                selectedListType === "mix" ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"
              }`}
            >
              <div className="mb-4">
                <Shuffle size={48} className="text-blue-400" />
              </div>
              <h3 className="text-white text-lg md:text-xl font-medium mb-2 text-center">Mix List</h3>
              <p className="text-gray-300 text-sm md:text-base text-center leading-relaxed">
                Create a list that can include places from different categories: restaurants, attractions, nature, and
                others
              </p>
            </div>

            <div
              onClick={() => setSelectedListType("category")}
              className={`flex flex-col items-center bg-[#1a1a1a] border rounded-xl p-6 cursor-pointer transition-all ${
                selectedListType === "category"
                  ? "border-green-500 bg-green-500/10"
                  : "border-gray-600 hover:border-gray-500"
              }`}
            >
              <div className="mb-4">
                <Grid3X3 size={48} className="text-green-400" />
              </div>
              <h3 className="text-white text-lg md:text-xl font-medium mb-2 text-center">Category List</h3>
              <p className="text-gray-300 text-sm md:text-base text-center leading-relaxed">
                Create a specialized list for a specific category with its subcategories
              </p>
            </div>
          </div>

          {selectedListType === "category" && (
            <div>
              <h2 className="text-white text-xl md:text-xl font-medium mb-2 text-left">Choose Category</h2>
              <p className="text-gray-400 text-sm md:text-base mb-6 text-left">
                Select the main category for your specialized list
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
                {listCategories.map((category) => {
                  const isSelected = selectedListCategory === category.id

                  return (
                    <div
                      key={category.id}
                      onClick={() => handleListCategoryChange(category.id)}
                      className={`flex flex-col items-center justify-center bg-[#1a1a1a] border rounded-lg md:rounded-xl p-4 cursor-pointer transition-all ${
                        isSelected ? "border-purple-500 bg-purple-500/10" : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <div className="mb-3 text-3xl">{category.icon}</div>
                      <h3 className="text-white text-sm md:text-base font-medium mb-1 text-center">{category.name}</h3>
                      <p className="text-gray-400 text-xs text-center">
                        {category.subcategories.length > 0
                          ? `${category.subcategories.length} subcategories`
                          : "No subcategories"}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderBasicInfo = () => (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <label className="block text-white text-lg md:text-xl font-medium mb-2">
            {builderType === "route" ? "Route Name" : "List Name"}
          </label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder={builderType === "route" ? "Enter route name" : "Enter list name"}
            className="w-full bg-[#141415] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-all text-base"
            maxLength={50}
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-lg md:text-xl font-medium mb-2">Location</label>
          <div className="relative location-dropdown-container">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value)
                if (!e.target.value.trim()) {
                  setSelectedLocation(null)
                }
              }}
              onFocus={() => {
                if (locationQuery.trim()) {
                  setShowLocationDropdown(true)
                }
              }}
              placeholder="Select a city or region"
              className="w-full bg-[#141415] border border-gray-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-all text-base"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <MapPin size={20} className="text-blue-400" />
            </div>

            {showLocationDropdown && filteredLocations.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border border-gray-600 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredLocations.map((location, index) => (
                  <button
                    key={`${location.city}-${location.country}-${index}`}
                    onClick={() => {
                      setSelectedLocation(location)
                      setLocationQuery(`${location.city}, ${location.country}`)
                      setShowLocationDropdown(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[#3a3a3a] transition-colors border-b border-gray-700 last:border-b-0 flex items-center gap-3"
                  >
                    <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">{location.city}</div>
                      <div className="text-gray-400 text-sm">{location.country}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-lg md:text-xl font-medium mb-2">
            {builderType === "route" ? "Route Images" : "List Images"}
          </label>

          <div className="border-2 border-dashed border-gray-600 rounded-xl p-2 text-center hover:border-gray-500 transition-colors cursor-pointer bg-[#141415] relative flex flex-col items-center overflow-hidden">
            {uploadedImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto w-full justify-start mb-4 custom-image-scrollbar">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-[200px] h-16 bg-[#3a3a3a] rounded-lg border border-gray-600 flex items-center p-2 group"
                  >
                    <Image
                      src={image.previewUrl || "/placeholder.svg"}
                      alt={image.file.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover mr-2"
                    />
                    <div className="flex flex-col text-left overflow-hidden">
                      <div className="text-xs text-gray-200 truncate">{image.file.name}</div>
                      <div className="text-xs text-gray-400">{`${(image.file.size / 1024).toFixed(2)}KB`}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadedImages.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-4">
                <p className="text-gray-300 text-base mb-4">Drag & drop images here or click to browse</p>
              </div>
            )}
            <button
              onClick={triggerFileInput}
              className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors w-40"
            >
              Upload
            </button>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-lg md:text-xl font-medium mb-2">
            {builderType === "route" ? "Route Description" : "List Description"}
          </label>
          <div className="relative">
            <textarea
              value={routeDescription}
              onChange={(e) => setRouteDescription(e.target.value)}
              placeholder={builderType === "route" ? "Describe your route..." : "Describe your list..."}
              className="w-full bg-[#141415] border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-all resize-none text-base"
              rows={6}
              maxLength={500}
            />
            <span className="absolute bottom-4 right-4 text-gray-400 text-sm">{routeDescription.length}/500</span>
          </div>
        </div>

        {builderType === "route" && (
          <div className="mb-6">
            <label className="block text-white text-lg md:text-xl font-medium mb-2">Difficulty Level</label>
            <div className="flex gap-4">
              {[
                { id: "easy", label: "Easy", icon: "🚶" },
                { id: "medium", label: "Medium", icon: "⚠️" },
                { id: "hard", label: "Hard", icon: "⛰️" },
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedDifficulty(level.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl border transition-all ${
                    selectedDifficulty === level.id
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-gray-600 bg-[#2a2a2a] text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <span className="text-lg">{level.icon}</span>
                  <span className="font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderPricing = () => (
    <div className="w-full md:w-[70%] mx-auto px-4 md:px-8">
      <div className="space-y-6 md:space-y-8 pt-4">
        <div className="flex items-center justify-between bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl p-4 md:p-6">
          <div>
            <h3 className="text-white text-xl md:text-2xl font-medium mb-4">
              {builderType === "route" ? "Free Route" : "Free List"}
            </h3>
            <p className="text-gray-400 text-sm md:text-base mb-4">
              {builderType === "route"
                ? "Make your route available for free to all users"
                : "Make your list available for free to all users"}
            </p>
          </div>
          <button
            onClick={() => setIsFreeRoute(!isFreeRoute)}
            className={`relative w-12 h-6 rounded-full transition-colors ${isFreeRoute ? "bg-blue-500" : "bg-gray-600"}`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                isFreeRoute ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {!isFreeRoute && (
          <>
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl p-4 md:p-6">
              <h3 className="text-white text-xl md:text-2xl font-medium mb-4">Select Currency</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency.code)}
                    className={`p-2 md:p-3 rounded-lg border transition-colors ${
                      selectedCurrency === currency.code
                        ? "border-white bg-[#2a2a2a]"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <div className="text-white font-medium text-sm md:text-base">{currency.symbol}</div>
                    <div className="text-gray-400 text-xs">{currency.code}</div>
                    {pricing[currency.code].isManuallySet && <div className="text-blue-400 text-xs mt-1">Manual</div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl p-4 md:p-6">
              <h3 className="text-white text-xl md:text-2xl font-medium mb-4">Set Price</h3>

              <div className="flex items-center justify-center mb-6 md:mb-8">
                <button
                  onClick={() => adjustPrice(-1)}
                  className="w-10 h-10 md:w-12 md:h-12 bg-[#2a2a2a] border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-500 transition-colors"
                >
                  <Minus size={16} className="text-white md:w-5 md:h-5" />
                </button>

                <div className="mx-4 md:mx-6">
                  {isEditingPrice ? (
                    <input
                      ref={priceInputRef}
                      type="text"
                      value={editingPrice}
                      onChange={handlePriceInputChange}
                      onBlur={handlePriceInputBlur}
                      onKeyDown={handlePriceKeyDown}
                      className="bg-transparent text-white text-2xl md:text-4xl font-bold text-center w-20 md:w-32 focus:outline-none"
                    />
                  ) : (
                    <div
                      onClick={startEditingPrice}
                      className="text-white text-2xl md:text-4xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
                    >
                      {getCurrentCurrency().symbol}
                      {pricing[selectedCurrency].price}
                    </div>
                  )}
                  <div className="text-gray-400 text-sm mt-1">{getCurrentCurrency().name}</div>
                </div>

                <button
                  onClick={() => adjustPrice(1)}
                  className="w-10 h-10 md:w-12 md:h-12 bg-[#2a2a2a] border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-500 transition-colors"
                >
                  <Plus size={16} className="text-white md:w-5 md:h-5" />
                </button>
              </div>

              {pricing[selectedCurrency].price > 0 && (
                <div className="bg-[#2a2a1a] rounded-lg p-3 md:p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{builderType === "route" ? "Route price" : "List price"}</span>
                    <span className="text-white">
                      {getCurrentCurrency().symbol}
                      {pricing[selectedCurrency].price}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Service fee (10%)</span>
                    <span className="text-red-400">
                      -{getCurrentCurrency().symbol}
                      {calculateServiceFee(pricing[selectedCurrency].price)}
                    </span>
                  </div>
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-white">You earn</span>
                      <span className="text-green-400">
                        {getCurrentCurrency().symbol}
                        {calculateCreatorEarnings(pricing[selectedCurrency].price)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl p-4 md:p-6">
              <h3 className="text-white text-xl md:text-2xl font-medium mb-4">Price in Other Currencies</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {currencies
                  .filter((currency) => currency.code !== selectedCurrency)
                  .map((currency) => (
                    <div key={currency.code} className="bg-[#2a2a1a] rounded-lg p-3 text-center">
                      <div className="text-white font-medium">
                        {currency.symbol}
                        {pricing[currency.code].price}
                      </div>
                      <div className="text-gray-400 text-xs">{currency.code}</div>
                      {pricing[currency.code].isManuallySet && <div className="text-blue-400 text-xs mt-1">Manual</div>}
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  const handlePrevImage = () => {
    setCurrentPreviewImageIndex((prevIndex) => (prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1))
  }

  const handleNextImage = () => {
    setCurrentPreviewImageIndex((prevIndex) => (prevIndex === uploadedImages.length - 1 ? 0 : prevIndex + 1))
  }

  const renderPublication = () => {
    const slides = [
      {
        title: builderType === "route" ? "Route Preview" : "List Preview",
        content: (
          <div className="w-full max-w-3xl mx-auto px-4 md:px-8 space-y-6">
            <div className="text-center">
              <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
                {routeName || `${builderType === "route" ? "Untitled Route" : "Untitled List"}`}
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm md:text-base mb-2">
                {builderType === "route" ? (
                  selectedCategory ? (
                    <>
                      <Tag size={16} />
                      <span>{categories.find((cat) => cat.id === selectedCategory)?.name || "General"}</span>
                    </>
                  ) : (
                    <span>No category selected</span>
                  )
                ) : (
                  selectedListType && (
                    <>
                      {selectedListType === "mix" ? <Shuffle size={16} /> : <Grid3X3 size={16} />}
                      <span>
                        {selectedListType === "mix"
                          ? "Mix List"
                          : selectedListCategory
                            ? getListCategory(selectedListCategory)?.name
                            : "Category List"}
                      </span>
                    </>
                  )
                )}
                {selectedLocation && (
                  <>
                    <span className="mx-1">•</span>
                    <MapPin size={16} />
                    <span>{`${selectedLocation.city}, ${selectedLocation.country}`}</span>
                  </>
                )}
              </div>
            </div>

            <div className="relative w-full h-64 md:h-96 bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-600">
              {uploadedImages.length > 0 ? (
                <>
                  <Image
                    src={uploadedImages[currentPreviewImageIndex].previewUrl || "/placeholder.svg"}
                    alt={routeName || "Route/List Image"}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                  {uploadedImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {uploadedImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPreviewImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              currentPreviewImageIndex === index ? "bg-white" : "bg-gray-400"
                            }`}
                            aria-label={`View image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500">No images uploaded</div>
              )}
            </div>

            <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl p-4 md:p-6">
              <h3 className="text-white text-xl font-medium mb-3">Description</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {removeFormatting(routeDescription) || "No description provided."}
              </p>
            </div>

            {selectedWhatYouSee.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl p-4 md:p-6">
                <h3 className="text-white text-xl font-medium mb-3">What you'll see</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedWhatYouSee.map((itemId) => {
                    const item = whatYouWillSeeCategories.flatMap((cat) => cat.items).find((item) => item.id === itemId)
                    return item ? (
                      <span key={itemId} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        {item.name}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}

            {selectedGoodToKnow.length > 0 && (
              <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl p-4 md:p-6">
                <h3 className="text-white text-xl font-medium mb-3">Good to know</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGoodToKnow.map((itemId) => {
                    const item = goodToKnowCategories.flatMap((cat) => cat.items).find((item) => item.id === itemId)
                    return item ? (
                      <span key={itemId} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                        {item.name}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        title: builderType === "route" ? "Route Points" : "List Points",
        content: (
          <div className="w-full md:w-[70%] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routePoints
                .filter((p) => p.type === "route")
                .slice(0, 6)
                .map((point, index) => (
                  <div
                    key={point.id}
                    className="bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl overflow-hidden"
                  >
                    <div className="w-full h-32 bg-gray-600 flex items-center justify-center overflow-hidden">
                      {point.images && point.images.length > 0 ? (
                        <Image
                          src={point.images[0] || "/placeholder.svg"}
                          alt={point.name || `Point ${point.id}`}
                          width={300}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-white font-medium text-lg">{index + 1}</span>
                      )}
                    </div>

                    <div className="p-4">
                      <h4 className="text-white font-medium mb-2 line-clamp-1">{point.name || `Point ${point.id}`}</h4>
                      {point.description && (
                        <p className="text-gray-400 text-sm line-clamp-3 mb-3">{point.description}</p>
                      )}
                      {point.coordinates && (
                        <div className="flex items-center text-xs text-green-400">
                          <Check size={12} className="mr-1" />
                          Coordinates set
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {routePoints.filter((p) => p.type === "route").length > 6 && (
                <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-2xl font-bold mb-2">
                      +{routePoints.filter((p) => p.type === "route").length - 6}
                    </div>
                    <p className="text-gray-400 text-sm">more points</p>
                  </div>
                </div>
              )}
            </div>

            {routePoints.filter((p) => p.type === "route").length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p>No points added yet</p>
              </div>
            )}
          </div>
        ),
      },
      {
        title: builderType === "route" ? "Route Map" : "List Map",
        content: (
          <div className="w-full md:w-[70%] mx-auto px-4 md:px-8 space-y-6">
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl p-4 md:p-6">
              <div className="h-64 md:h-80 bg-[#2a2a2a] rounded-lg overflow-hidden">
                <div ref={previewMapContainerRef} className="w-full h-full" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  {routePoints.filter((p) => p.coordinates).length} of{" "}
                  {routePoints.filter((p) => p.type === "route").length} points have coordinates
                </p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl p-4 md:p-6">
              <h3 className="text-white text-xl font-medium mb-3">Price</h3>
              {isFreeRoute ? (
                <span className="text-green-400 text-2xl font-bold">FREE</span>
              ) : (
                <span className="text-white text-2xl font-bold">
                  {getCurrentCurrency().symbol}
                  {pricing[selectedCurrency].price}
                </span>
              )}
              {!isFreeRoute && pricing[selectedCurrency].price > 0 && (
                <div className="bg-[#2a2a1a] rounded-lg p-3 md:p-4 space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">You earn</span>
                    <span className="text-green-400">
                      {getCurrentCurrency().symbol}
                      {calculateCreatorEarnings(pricing[selectedCurrency].price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Service fee</span>
                    <span className="text-red-400">
                      {getCurrentCurrency().symbol}
                      {calculateServiceFee(pricing[selectedCurrency].price)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg md:rounded-xl p-4 md:p-6">
              <h3 className="text-white text-lg md:text-xl font-medium mb-4">Terms & Conditions</h3>
              <div className="text-gray-400 text-sm md:text-base leading-relaxed">
                <p className="mb-4">
                  By publishing this {builderType === "route" ? "route" : "list"}, you agree to our{" "}
                  <Link href="/terms" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="termsAgreed"
                    checked={termsAgreed}
                    onChange={() => setTermsAgreed(!termsAgreed)}
                    className="mr-2 h-5 w-5 rounded text-blue-500 focus:ring-blue-500 bg-[#2a2a2a] border-gray-600"
                  />
                  <label htmlFor="termsAgreed">I agree to the terms and conditions</label>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ]

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col">
          <h2 className="text-white text-xl md:text-2xl font-medium mb-4 md:mb-6 text-left">
            {slides[currentSlide - 1].title}
          </h2>
          <div className="flex-1">{slides[currentSlide - 1].content}</div>
        </div>

        <div className="flex items-center justify-between mt-4 md:mt-6 px-4 md:px-0">
          <button
            onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
            disabled={currentSlide === 1}
            className={`p-2 rounded-full ${
              currentSlide === 1 ? "text-gray-600 cursor-not-allowed" : "text-white hover:bg-[#2a2a2a]"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index + 1)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index + 1 ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(Math.min(slides.length, currentSlide + 1))}
            disabled={currentSlide === slides.length}
            className={`p-2 rounded-full ${
              currentSlide === slides.length ? "text-gray-600 cursor-not-allowed" : "text-white hover:bg-[#2a2a2a]"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  const renderRouteDetails = () => {
    const orderedWhatYouWillSeeCategories = [...whatYouWillSeeCategories]
    if (builderType === "points" && selectedListCategory) {
      const selectedCatIndex = orderedWhatYouWillSeeCategories.findIndex((cat) => cat.id === selectedListCategory)
      if (selectedCatIndex > -1) {
        const [selectedCat] = orderedWhatYouWillSeeCategories.splice(selectedCatIndex, 1)
        orderedWhatYouWillSeeCategories.unshift(selectedCat)
      }
    }

    return (
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6">
        <div className="mb-10">
          <h2 className="text-white text-xl md:text-2xl font-medium mb-2 text-left">What you'll see</h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 text-left">
            Select the types of places or attractions users will encounter on your{" "}
            {builderType === "route" ? "route" : "list"}.
          </p>
          <div className="flex overflow-x-auto gap-4 pb-[10px] custom-scrollbar">
            {orderedWhatYouWillSeeCategories.map((category) => {
              const IconComponent = category.icon
              const isSelectedCategoryInList = builderType === "points" && selectedListCategory === category.id

              return (
                <div
                  key={category.id}
                  className={`flex-shrink-0 w-[280px] bg-[#1a1a1a] border rounded-xl p-4 ${
                    isSelectedCategoryInList ? "border-green-500" : "border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2a2a2a]">
                      <IconComponent size={18} className="text-gray-400" />
                    </div>
                    <h3 className="text-white text-lg font-medium">{category.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isSelected = selectedWhatYouSee.includes(item.id)
                      return (
                        <label key={item.id} className="flex items-center text-gray-300 text-sm cursor-pointer">
                          <Checkbox
                            id={`what-you-see-${item.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              setSelectedWhatYouSee((prev) =>
                                checked ? [...prev, item.id] : prev.filter((id) => id !== item.id),
                              )
                            }}
                            className="mr-2 border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                          />
                          {item.name}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl font-medium mb-2 text-left">Good to know</h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 text-left">
            Provide useful information and tips for users following your {builderType === "route" ? "route" : "list"}.
          </p>
          <div className="flex overflow-x-auto gap-4 pb-[10px] custom-scrollbar">
            {goodToKnowCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.id}
                  className="flex-shrink-0 w-[280px] bg-[#1a1a1a] border border-gray-600 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2a2a2a]">
                      <IconComponent size={18} className="text-gray-400" />
                    </div>
                    <h3 className="text-white text-lg font-medium">{category.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isSelected = selectedGoodToKnow.includes(item.id)
                      const ItemIconComponent = item.icon
                      return (
                        <label key={item.id} className="flex items-center text-gray-300 text-sm cursor-pointer">
                          <Checkbox
                            id={`good-to-know-${item.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              setSelectedGoodToKnow((prev) =>
                                checked ? [...prev, item.id] : prev.filter((id) => id !== item.id),
                              )
                            }}
                            className="mr-2 border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                          />
                          {ItemIconComponent && <ItemIconComponent size={16} className="mr-1" />}
                          {item.name}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const handleEditingPointNameChange = (value: string) => {
    setEditingPointChanges((prev) => ({ ...prev, name: value }))
  }

  const handleEditingPointDescriptionChange = (value: string) => {
    setEditingPointChanges((prev) => ({ ...prev, description: value }))
  }

  const savePointManually = () => {
    if (currentEditingPoint) {
      saveCurrentPointChanges()
      setExpandedPoints([])
      setCurrentEditingPoint(null)
      setEditingPointChanges({ name: "", description: "" })
      setEditingPointImages([])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="md:hidden bg-black border-b border-gray-800 px-4 py-3">
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {steps.map((step) => {
            const IconComponent = step.icon
            const isActive = currentStep === step.id
            const isCompleted = completedSteps.includes(step.id)
            const isAccessible = isStepAccessible(step.id)

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                disabled={!isAccessible}
                className={`flex items-center p-2 rounded-xl border transition-all duration-300 min-w-[120px] flex-shrink-0 ${
                  isActive
                    ? "border-white bg-[#1a1a1a]"
                    : isCompleted
                      ? "border-green-500 bg-green-500/10"
                      : isAccessible
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-700 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="mr-2">
                  {isCompleted ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <IconComponent size={16} className={isActive ? "text-white" : "text-gray-400"} />
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-white" : "text-gray-400"}`}>{step.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex h-screen">
        <div
          className={`hidden md:flex ${isSidebarCollapsed ? "w-20 px-2" : "w-80 px-6"} bg-black transition-all duration-300 flex-col`}
        >
          <Link
            href="/"
            className={`flex ${isSidebarCollapsed ? "justify-center" : "justify-start"} items-center py-4 mt-0`}
          >
            <Image
              src="/logo.png"
              alt="Travel Platform Logo"
              width={isSidebarCollapsed ? 55 : 65}
              height={isSidebarCollapsed ? 55 : 65}
              className="transition-all duration-300"
            />
          </Link>

          <div className="flex-1 space-y-4 mt-0">
            {steps.map((step) => {
              const IconComponent = step.icon
              const isActive = currentStep === step.id
              const isCompleted = completedSteps.includes(step.id)
              const isAccessible = isStepAccessible(step.id)

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isAccessible}
                  className={`w-full flex ${isSidebarCollapsed ? "flex-col justify-center text-center py-5" : "items-center p-4"} rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "border-white bg-[#1a1a1a]"
                      : isCompleted
                        ? "border-green-500 bg-green-500/10"
                        : isAccessible
                          ? "border-gray-600 hover:border-gray-500"
                          : "border-gray-700 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className={`${isSidebarCollapsed ? "mb-1 mx-auto" : "mr-4"}`}>
                    {isCompleted ? (
                      <Check size={20} className="text-green-400" />
                    ) : (
                      <IconComponent size={20} className={isActive ? "text-white" : "text-gray-400"} />
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="text-left">
                      <div className={`font-medium ${isActive ? "text-white" : "text-gray-400"}`}>{step.title}</div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className={`mt-auto py-4 ${isSidebarCollapsed ? "flex justify-center" : ""}`}>
            <button
              onClick={() => setIsSidebarToggleOn(!isSidebarToggleOn)}
              className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} w-full p-3 rounded-xl border transition-all duration-300 ${
                isSidebarToggleOn
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 bg-[#1a1a1a] hover:border-gray-500"
              }`}
            >
              {!isSidebarCollapsed && <span className="text-white font-medium">Toggle Feature</span>}
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${isSidebarToggleOn ? "bg-blue-500" : "bg-gray-600"}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isSidebarToggleOn ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#0F0F10] border border-gray-600 rounded-xl h-full flex flex-col p-3 md:p-4 min-w-0 overflow-hidden relative">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex absolute top-1/2 left-[-15px] transform -translate-y-1/2 translate-x-1/2 text-gray-400 hover:text-gray-300 transition-colors z-10"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>

          <div ref={mainContentRef} className="flex-1 overflow-y-auto">
            {renderStepContent()}
          </div>

          {currentStep !== 3 && (
            <div className="bg-[#1a1a1a] border border-gray-600/50 rounded-lg p-2 mt-2">
              <div className="flex justify-between items-center">
                <div className="text-gray-400 text-sm">
                  {builderType === "route" ? "Creating Route" : "Creating List"}
                </div>
                <button
                  onClick={handleNextStep}
                  disabled={!isCurrentStepCompleted() || currentStep >= steps.length}
                  className={`px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 w-full md:w-auto ${
                    isCurrentStepCompleted() && currentStep < steps.length
                      ? "border border-white text-white hover:bg-white hover:text-black"
                      : "border border-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {currentStep === steps.length ? "Complete" : "Next step"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDraftModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium mb-4">Draft Saved!</h2>
            <p className="text-gray-400">Your progress has been saved as a draft.</p>
          </div>
        </div>
      )}

      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium mb-4">
              {builderType === "route" ? "Route Published!" : "List Published!"}
            </h2>
            <p className="text-gray-400">
              Your {builderType === "route" ? "route" : "list"} has been successfully published.
            </p>
          </div>
        </div>
      )}

      {showDeleteBlockModal && blockToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 text-center border border-gray-600">
            <h2 className="text-xl font-medium mb-4">Confirm Deletion</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete the block "
              <span className="font-semibold text-white">{blockToDelete.name}</span>"?
              <br />
              This will also delete all points within this block.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDeleteBlock}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBlock}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeletePointModal && pointToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 text-center border border-gray-600">
            <h2 className="text-xl font-medium mb-4">Confirm Deletion</h2>
            <p className="text-400 mb-6">
              Are you sure you want to delete the point "
              <span className="font-semibold text-white">{pointToDelete.name || `Point ${pointToDelete.id}`}</span>"?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDeletePoint}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePoint}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New: Add point from map click modal */}
      <Dialog
        open={showAddPointFromMapModal}
        onOpenChange={(open) => {
          setShowAddPointFromMapModal(open)
          if (!open) {
            if (tempMarkerRef.current) {
              try {
                tempMarkerRef.current.remove()
              } catch {}
              tempMarkerRef.current = null
              setTempMarker(null)
            }
            setPendingMapCoords(null)
            setPlacePreviewData(null)
          }
        }}
      >
        <DialogContent className="bg-[#1a1a1a] text-white border border-gray-600 rounded-lg p-6 w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Выберите категорию для точки</DialogTitle>
            {/* Preview snippet instead of coordinates */}
            <div className="mt-3 rounded-lg border border-[#333] bg-[#1f1f1f] p-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-md bg-[#2a2a2a] text-gray-400 flex-shrink-0">
                  <Camera size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white line-clamp-1">
                    {placePreviewData?.title || "Название локации"}
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-2">
                    {placePreviewData?.description || "Короткое описание места..."}
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Existing groups */}
            {groupingBlocks.length > 0 && (
              <div>
                <h4 className="text-sm text-gray-300 mb-2">Add to existing</h4>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {groupingBlocks.map((group) => {
                    const IconOrEmoji = getGroupingBlockIcon(builderType, selectedListType, group)
                    return (
                      <div
                        key={group.id}
                        className="flex items-center justify-between bg-[#2a2a2a] border border-[#404040] rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: group.color }}
                          >
                            {typeof IconOrEmoji === "string" ? (
                              <span className="text-lg">{IconOrEmoji}</span>
                            ) : (
                              <IconOrEmoji size={18} className="text-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">{group.name}</div>
                            <div className="text-xs text-gray-400">{group.pointIds.length} points</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (!pendingMapCoords) return
                            addPointAtCoordsToGroup(pendingMapCoords, group)
                          }}
                          className="px-3 py-1.5 rounded-md bg-[#404040] hover:bg-[#505050] transition-colors text-sm"
                        >
                          Add here
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-[#333] flex-1" />
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px bg-[#333] flex-1" />
            </div>

            {/* Create new subcategory flow */}
            <div className="bg-[#2a2a2a] border border-[#404040] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Create in new subcategory</div>
                  <div className="text-xs text-gray-400">
                    {builderType === "route"
                      ? "Choose a subcategory under your selected route category"
                      : selectedListType === "mix"
                        ? "Choose a main category for your mix list"
                        : "Choose a subcategory under the selected category"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!pendingMapCoords) return
                    setPendingPointCoordsForNewBlock(pendingMapCoords)
                    // Open the existing subcategory modal with proper data
                    handleOpenAddSubcategoryModal()
                    // Keep the add-point modal open or close it? We'll close it to avoid stacking.
                    setShowAddPointFromMapModal(false)
                  }}
                  className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-gray-100 transition-colors text-sm"
                >
                  Choose category
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Existing Subcategory Selection Modal */}
      <Dialog open={showSubcategorySelectionModal} onOpenChange={setShowSubcategorySelectionModal}>
        <DialogContent className="bg-[#1a1a1a] text-white border border-gray-600 rounded-lg p-6 w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Select a Subcategory</DialogTitle>
            <DialogDescription>Choose a subcategory for your new grouping block.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {subcategoriesForModal.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => confirmAddSubcategory(subcategory.id, subcategory.name)}
                className="flex flex-col items-center justify-center bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#3a3a3a] transition-colors"
              >
                {subcategory.icon && (
                  <div className="w-8 h-8 rounded-full bg-[#404040] flex items-center justify-center mb-2">
                    {typeof subcategory.icon === "string" ? (
                      <span className="text-lg">{subcategory.icon}</span>
                    ) : (
                      <subcategory.icon size={18} className="text-white" />
                    )}
                  </div>
                )}
                <div className="text-sm font-medium">{subcategory.name}</div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryChangeWarning} onOpenChange={setShowCategoryChangeWarning}>
        <DialogContent className="bg-[#1a1a1a] text-white border border-gray-600 rounded-lg p-6 w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Change Category?</DialogTitle>
            <DialogDescription>
              Changing the list category will reset all points and grouping blocks you have created in the next steps.
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={cancelCategoryChange}
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmCategoryChange}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Change Category
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
