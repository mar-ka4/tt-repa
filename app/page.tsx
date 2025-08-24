"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Globe, X, MapPin, ChevronLeft, ChevronRight, Instagram, Send } from "lucide-react"
import { SiTiktok } from "react-icons/si" // Import SiTiktok from react-icons/si
import RouteCard from "@/components/route-card"
import { routes } from "@/data/routes"
import { locations } from "@/data/locations"
import type { Location } from "@/data/locations"
import UserMenu from "@/components/user-menu"
import { useAuth } from "@/context/auth-context"
import { useWishlist } from "@/context/wishlist-context"
import LoadingScreen from "@/components/loading-screen"
import FiltersModal from "@/components/filters-modal" // Import the new FiltersModal

// Available languages
const languages = [
  { code: "EN", name: "English" },
  { code: "RU", name: "Русский" },
  { code: "DE", name: "Deutsch" },
  { code: "FR", name: "Français" },
  { code: "ES", name: "Español" },
  { code: "IT", name: "Italiano" },
  { code: "PT", name: "Português" },
]

// Import users data
import { users } from "@/data/users"

// Hero banner images
const heroImages = [
  "/banner-mountain-lake.png",
  "/banner-tropical-beach.png",
  "/banner-desert-sunset.png",
  "/banner-lighthouse-sunset.png",
  "/banner-mont-saint-michel.png",
]

// Helper function to determine the display category for a route card
const getCardDisplayCategory = (sectionTitle: string, routeType: string) => {
  switch (sectionTitle) {
    case "Popular":
      // For popular, use the original route type, translated if possible
      if (routeType.includes("walking") || routeType.includes("пеший")) return "Walking"
      if (routeType.includes("camper") || routeType.includes("автодом")) return "Camper"
      if (routeType.includes("hiking") || routeType.includes("поход")) return "Hiking"
      return "Route" // Fallback
    case "Food Spots":
      return "Food Tour"
    case "Europe":
      return "City Tour"
    case "Asia":
      return "Culture"
    case "Adventure":
      return "Adventure"
    case "Road Trips":
      return "Road Trip"
    default:
      // Fallback for any other section titles or if route.type is not recognized
      if (routeType.includes("walking") || routeType.includes("пеший")) return "Walking"
      if (routeType.includes("camper") || routeType.includes("автодом")) return "Camper"
      if (routeType.includes("hiking") || routeType.includes("поход")) return "Hiking"
      return "Route"
  }
}

// Route sections configuration
const routeSections = [
  {
    title: "Popular",
    routes: (() => {
      const parisRoute = routes.find((route) => route.name === "Paris: Eiffel Tower and Seine Photography")
      const matterhornRouteName = "Swiss Alps: Matterhorn Trail Adventure"

      const otherPopularRoutes = routes
        .filter(
          (route) => route.name !== "Paris: Eiffel Tower and Seine Photography" && route.name !== matterhornRouteName,
        )
        .slice(0, 7)

      return parisRoute ? [parisRoute, ...otherPopularRoutes] : otherPopularRoutes
    })(),
  },
  {
    title: "Food Spots",
    routes: (() => {
      const copenhagenRoute = routes.find((route) => route.name === "Copenhagen: Culinary Delights and Cozy Cafes")
      const templesRoute = routes.find((route) => route.name === "Temples and Night Market Adventures")

      const otherFoodRoutes = routes.filter(
        (route) =>
          (route.name.includes("Night Market") ||
            route.name.includes("Street Food") ||
            route.name.includes("Ramen and Sushi") ||
            route.name.includes("Tacos") ||
            route.name.includes("Food") ||
            route.name.includes("Pizza") ||
            route.name.includes("Kebabs") ||
            route.name.includes("Culinary")) &&
          route.name !== "Copenhagen: Culinary Delights and Cozy Cafes" &&
          route.name !== "Temples and Night Market Adventures",
      )

      const orderedFoodRoutes = []
      if (copenhagenRoute) orderedFoodRoutes.push(copenhagenRoute)
      if (templesRoute) orderedFoodRoutes.push(templesRoute)
      orderedFoodRoutes.push(...otherFoodRoutes)

      return orderedFoodRoutes.slice(0, 6)
    })(),
  },
  {
    title: "Europe",
    routes: routes
      .filter(
        (route) =>
          route.location.includes("Germany") ||
          route.location.includes("London") ||
          route.location.includes("Paris") ||
          route.location.includes("Italy") ||
          route.location.includes("Spain"),
      )
      .slice(0, 6),
  },
  {
    title: "Asia",
    routes: routes
      .filter(
        (route) =>
          route.location.includes("Japan") ||
          route.location.includes("Tokyo") ||
          route.location.includes("China") ||
          route.location.includes("Thailand"),
      )
      .slice(0, 6),
  },
  {
    title: "Adventure",
    routes: (() => {
      const matterhornRoute = routes.find((route) => route.name === "Swiss Alps: Matterhorn Trail Adventure")
      const icelandHighlights = routes.find(
        (route) => route.id === "37" || route.name === "Iceland: Ultimate Nature Highlights",
      )

      const otherAdventureRoutes = routes.filter(
        (route) =>
          (route.type === "hiking" || route.difficulty === "hard" || route.location.includes("Iceland")) &&
          route.name !== "Swiss Alps: Matterhorn Trail Adventure" &&
          route.name !== "Iceland: Ultimate Nature Highlights",
      )

      const maxCount = 6
      const result: typeof routes = []

      if (matterhornRoute) result.push(matterhornRoute)
      if (icelandHighlights) result.push(icelandHighlights)

      const remaining = Math.max(0, maxCount - result.length)
      result.push(...otherAdventureRoutes.slice(0, remaining))

      return result
    })(),
  },
  {
    title: "Road Trips",
    routes: routes
      .filter((route) => route.type === "camper" || route.duration.includes("days") || route.duration.includes("дней"))
      .slice(0, 6),
  },
]

// Popular destinations for mobile search
const popularDestinations = [
  { city: "Berlin", country: "Germany" },
  { city: "Belgrade", country: "Serbia" },
  { city: "Barcelona", country: "Spain" },
  { city: "Budapest", country: "Hungary" },
  { city: "Brussels", country: "Belgium" },
  { city: "Paris", country: "France" },
  { city: "London", country: "United Kingdom" },
  { city: "Rome", country: "Italy" },
]

export default function Home() {
  const { user, isAuthenticated } = useAuth() // Destructure isAuthenticated
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("") // Separate state for applied search

  // New state for filters
  const [filters, setFilters] = useState({
    routeType: "all",
    minPrice: 0,
    maxPrice: 50,
    minDuration: 0,
    maxDuration: 24, // Default to hours
    durationType: "hours" as "hours" | "days",
    minPoints: 0,
    maxPoints: 30,
    difficulty: "all",
    categories: [] as string[],
  })

  const [filtersOpen, setFiltersOpen] = useState(false) // State for filters modal display
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("EN")

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Enhanced search states
  const [activeSearchTab, setActiveSearchTab] = useState<"locations" | "routes" | "users">("locations")
  const [locationResults, setLocationResults] = useState<Location[]>([])
  const [routeResults, setRouteResults] = useState<any[]>([])
  const [userResults, setUserResults] = useState<any[]>([])

  // Separate states for search and filters
  const [searchApplied, setSearchApplied] = useState(false)
  const [filtersApplied, setFiltersApplied] = useState(false)

  // Calculating approximate header height for content offset
  const headerHeight = "72px" // Height of top header only

  // State for user menu display
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  // State for language search
  const [langSearch, setLangSearch] = useState("")

  // States for search bar
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search destinations...")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchSuggestionsRef = useRef<HTMLDivElement>(null)

  // Refs for menus
  const langMenuRef = useRef<HTMLDivElement>(null)
  const langButtonRef = useRef<HTMLButtonElement>(null)

  // State for mobile search modal
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // Refs for scroll containers (for desktop navigation buttons)
  const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Ref for the "Popular" section to scroll to
  const popularSectionRef = useRef<HTMLElement>(null)

  // State for hero banner carousel
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)

  // Automatic slide transition for hero banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prevSlide) => (prevSlide + 1) % heroImages.length)
    }, 8000) // Change slide every 8 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  // Loading effect - simulate data loading
  useEffect(() => {
    const loadData = async () => {
      // Simulate loading time for routes, users, and other data
      await new Promise((resolve) => setTimeout(resolve, 2500)) // 2.5 seconds minimum loading time
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Function to scroll horizontally for desktop navigation buttons
  const scrollHorizontal = (sectionTitle: string, direction: "left" | "right") => {
    const container = scrollContainerRefs.current[sectionTitle]
    if (!container) return

    const cardWidth = 300 // Approximate card width
    const gap = 16 // Gap between cards
    const scrollAmount = cardWidth + gap

    if (direction === "right") {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  // Function to toggle language menu
  const toggleLangMenu = () => {
    setLangMenuOpen(!langMenuOpen)
    if (userMenuOpen) setUserMenuOpen(false)
  }

  // Function to open filters modal
  const openFilters = () => {
    setFiltersOpen(true)
    if (userMenuOpen) setUserMenuOpen(false)
    if (langMenuOpen) setLangMenuOpen(false)
  }

  // Function to close filters modal
  const closeFilters = () => {
    setFiltersOpen(false)
  }

  // Function to select language
  const selectLanguage = (code: string) => {
    setCurrentLang(code)
    setLangMenuOpen(false)
  }

  // Function to check if any filters are active (excluding search)
  const hasActiveFilters = () => {
    const defaultMaxDuration = filters.durationType === "hours" ? 24 : 30
    return (
      filters.routeType !== "all" ||
      filters.minPrice !== 0 ||
      filters.maxPrice !== 50 ||
      filters.minDuration !== 0 ||
      filters.maxDuration !== defaultMaxDuration ||
      filters.minPoints !== 0 ||
      filters.maxPoints !== 30 ||
      filters.difficulty !== "all" ||
      (filters.categories && filters.categories.length > 0)
    )
  }

  // Function to apply search
  const applySearch = () => {
    setAppliedSearchQuery(searchQuery)
    setSearchApplied(searchQuery !== "")
    setSearchFocused(false)
  }

  // Function to handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applySearch()
  }

  // Function to reset search
  const clearSearch = () => {
    setSearchQuery("")
    setAppliedSearchQuery("")
    setSearchApplied(false)
  }

  // Function to reset filters
  const clearFilters = () => {
    setFilters({
      routeType: "all",
      minPrice: 0,
      maxPrice: 50,
      minDuration: 0,
      maxDuration: 24,
      durationType: "hours",
      minPoints: 0,
      maxPoints: 30,
      difficulty: "all",
      categories: [],
    })
    setFiltersApplied(false)
  }

  // Function to clear all (search + filters)
  const clearAll = () => {
    clearSearch()
    clearFilters()
  }

  // Function to apply filters (called from FiltersModal)
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
    const defaultMaxDuration = newFilters.durationType === "hours" ? 24 : 30
    const isActive =
      newFilters.routeType !== "all" ||
      newFilters.minPrice !== 0 ||
      newFilters.maxPrice !== 50 ||
      newFilters.minDuration !== 0 ||
      newFilters.maxDuration !== defaultMaxDuration ||
      newFilters.minPoints !== 0 ||
      newFilters.maxPoints !== 30 ||
      newFilters.difficulty !== "all" ||
      (newFilters.categories && newFilters.categories.length > 0)
    setFiltersApplied(isActive)
  }

  // Function to get search results (based on search query only)
  const getSearchResults = () => {
    if (!searchApplied || appliedSearchQuery === "") {
      return routes
    }

    return routes.filter((route) => {
      const queryLower = appliedSearchQuery.toLowerCase()
      return (
        route.name.toLowerCase().includes(queryLower) ||
        route.location.toLowerCase().includes(queryLower) ||
        route.description.toLowerCase().includes(queryLower)
      )
    })
  }

  // Function to get filtered routes (based on filters only, applied to search results)
  const getFilteredRoutes = () => {
    const searchResults = getSearchResults()

    if (!filtersApplied) {
      return searchResults
    }

    const { routeType, minPrice, maxPrice, minDuration, maxDuration, durationType, minPoints, maxPoints, difficulty } =
      filters

    return searchResults.filter((route) => {
      // Route type filter
      const matchesRouteType =
        routeType === "all" ||
        route.type.toLowerCase().includes(routeType.toLowerCase()) ||
        (routeType === "walking" && (route.type.includes("пеший") || route.type.includes("walking"))) ||
        (routeType === "cycling" && route.type.includes("cycling")) ||
        (routeType === "camper" && (route.type.includes("автодом") || route.type.includes("camper"))) ||
        (routeType === "hiking" && (route.type.includes("поход") || route.type.includes("hiking"))) ||
        (routeType === "car" && route.type.includes("car"))

      // Price filter (assuming routes have a price property, defaulting to 0 for free routes)
      const routePrice = route.price || 0
      const matchesPrice = routePrice >= minPrice && routePrice <= maxPrice

      // Duration filter
      const matchesDuration = (() => {
        const durationStr = route.duration.toLowerCase()
        let routeDurationValue = 0

        if (durationStr.includes("hour") || durationStr.includes("час")) {
          const match = durationStr.match(/(\d+)/)
          if (match) {
            routeDurationValue = Number.parseInt(match[1])
            if (durationType === "days") {
              routeDurationValue = Math.ceil(routeDurationValue / 24) // Convert hours to days
            }
          }
        } else if (durationStr.includes("day") || durationStr.includes("дн")) {
          const match = durationStr.match(/(\d+)/)
          if (match) {
            routeDurationValue = Number.parseInt(match[1])
            if (durationType === "hours") {
              routeDurationValue = routeDurationValue * 24 // Convert days to hours
            }
          }
        }

        return routeDurationValue >= minDuration && routeDurationValue <= maxDuration
      })()

      // Points filter
      const matchesPoints = route.points >= minPoints && route.points <= maxPoints

      // Difficulty filter
      const matchesDifficulty =
        difficulty === "all" ||
        route.difficulty.toLowerCase().includes(difficulty.toLowerCase()) ||
        (difficulty === "easy" && (route.difficulty.includes("легкая") || route.difficulty.includes("easy"))) ||
        (difficulty === "medium" && (route.difficulty.includes("средняя") || route.difficulty.includes("medium"))) ||
        (difficulty === "hard" && (route.difficulty.includes("сложная") || route.difficulty.includes("hard")))

      // Categories filter (match if route has any of the selected categories)
      const matchesCategories = (() => {
        const selected = filters.categories || []
        if (selected.length === 0) return true
        // Try common fields: categories, categoryIds, tags
        const raw = (route as any).categories || (route as any).categoryIds || (route as any).tags || []
        const ids: string[] = Array.isArray(raw)
          ? raw
              .map((c: any) => {
                if (!c) return null
                if (typeof c === "string") return c.toLowerCase()
                if (typeof c === "object" && "id" in c && typeof c.id === "string") return c.id.toLowerCase()
                return null
              })
              .filter(Boolean)
          : []
        return selected.some((s) => ids.includes(s.toLowerCase()))
      })()

      return (
        matchesRouteType && matchesPrice && matchesDuration && matchesPoints && matchesDifficulty && matchesCategories
      )
    })
  }

  // Enhanced search function with improved algorithm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setLocationResults([])
      setRouteResults([])
      setUserResults([])
      return
    }

    const queryLower = query.toLowerCase()

    // Search locations with priority for starts-with matches
    const locationMatches = locations
      .map((location) => {
        const cityLower = location.city.toLowerCase()
        const countryLower = location.country.toLowerCase()

        // Check if city or country starts with query
        const cityStartsWith = cityLower.startsWith(queryLower)
        const countryStartsWith = countryLower.startsWith(queryLower)

        // Check if city or country contains query
        const cityContains = cityLower.includes(queryLower)
        const countryContains = countryLower.includes(queryLower)

        if (cityStartsWith || countryStartsWith) {
          return { location, priority: 1 } // Highest priority for starts-with
        } else if (cityContains || countryContains) {
          return { location, priority: 2 } // Lower priority for contains
        }

        return null
      })
      .filter(Boolean)
      .sort((a, b) => a!.priority - b!.priority) // Sort by priority
      .map((item) => item!.location)
      .slice(0, 10)

    setLocationResults(locationMatches)

    // Search routes with priority for starts-with matches
    const routeMatches = routes
      .map((route) => {
        const nameLower = route.name.toLowerCase()
        const locationLower = route.location.toLowerCase()
        const descriptionLower = route.description.toLowerCase()

        // Check if any field starts with query
        const nameStartsWith = nameLower.startsWith(queryLower)
        const locationStartsWith = locationLower.startsWith(queryLower)

        // Check if any field contains query
        const nameContains = nameLower.includes(queryLower)
        const locationContains = locationLower.includes(queryLower)
        const descriptionContains = descriptionLower.includes(queryLower)

        if (nameStartsWith || locationStartsWith) {
          return { route, priority: 1 } // Highest priority for starts-with
        } else if (nameContains || locationContains || descriptionContains) {
          return { route, priority: 2 } // Lower priority for contains
        }

        return null
      })
      .filter(Boolean)
      .sort((a, b) => a!.priority - b!.priority) // Sort by priority
      .map((item) => item!.route)
      .slice(0, 8)

    setRouteResults(routeMatches)

    // Search users with priority for starts-with matches
    const userMatches = users
      .map((user) => {
        const nicknameLower = user.nickname.toLowerCase()
        const descriptionLower = user.description.toLowerCase()

        // Check if nickname starts with query
        const nicknameStartsWith = nicknameLower.startsWith(queryLower)

        // Check if nickname or description contains query
        const nicknameContains = nicknameLower.includes(queryLower)
        const descriptionContains = descriptionLower.includes(queryLower)

        if (nicknameStartsWith) {
          return { user, priority: 1 } // Highest priority for nickname starts-with
        } else if (nicknameContains || descriptionContains) {
          return { user, priority: 2 } // Lower priority for contains
        }

        return null
      })
      .filter(Boolean)
      .sort((a, b) => a!.priority - b!.priority) // Sort by priority
      .map((item) => item!.user)
      .slice(0, 8)

    setUserResults(userMatches)

    // Keep user on locations tab by default, don't auto-switch
    // User can manually switch tabs if needed
  }

  // Function to handle search focus
  const handleSearchFocus = () => {
    setSearchFocused(true)
    setSearchPlaceholder("")
  }

  // Function to handle search blur
  const handleSearchBlur = (e: React.FocusEvent) => {
    // Don't close if clicking within the search suggestions area
    if (searchSuggestionsRef.current && searchSuggestionsRef.current.contains(e.relatedTarget as Node)) {
      return
    }

    setTimeout(() => {
      setSearchFocused(false)
      if (searchQuery === "") {
        setSearchPlaceholder("Search destinations...")
      }
    }, 200)
  }

  // Function to select location from suggestions
  const [searchSuggestions, setSearchSuggestions] = useState<Location[]>([])
  const selectLocation = (location: Location) => {
    setSearchQuery(`${location.city}, ${location.country}`)
    setSearchSuggestions([])
    // Auto-apply search when location is selected
    setTimeout(() => {
      setAppliedSearchQuery(`${location.city}, ${location.country}`)
      setSearchApplied(true)
      setSearchFocused(false)
    }, 100)
  }

  // Filtering languages by search
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      lang.code.toLowerCase().includes(langSearch.toLowerCase()),
  )

  // Click handler outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check for language menu
      if (
        langMenuOpen &&
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node) &&
        langButtonRef.current &&
        !langButtonRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false)
      }

      // Check for search suggestions - only close if clicking completely outside
      if (
        searchFocused &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        searchSuggestionsRef.current &&
        !searchSuggestionsRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false)
        if (searchQuery === "") {
          setSearchPlaceholder("Search destinations...")
        }
      }
    }

    // Adding event handler
    document.addEventListener("mousedown", handleClickOutside)

    // Removing handler when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [langMenuOpen, searchFocused, searchQuery])

  // Handle Enter key for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && searchFocused && searchQuery.trim() !== "") {
        applySearch()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [searchFocused, searchQuery])

  // Blocking scroll when modal is open
  useEffect(() => {
    if (filtersOpen || mobileSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [filtersOpen, mobileSearchOpen])

  // Function to open mobile search
  const openMobileSearch = () => {
    setMobileSearchOpen(true)
  }

  // Function to close mobile search
  const closeMobileSearch = () => {
    setMobileSearchOpen(false)
    setSearchQuery("")
    setLocationResults([])
    setRouteResults([])
    setUserResults([])
  }

  // Function to scroll to the "Popular" section with an offset
  const scrollToPopularSection = () => {
    if (popularSectionRef.current) {
      const offset = 100 // Scroll 100 pixels less (i.e., stop 100px before the top of the element)
      const targetPosition = popularSectionRef.current.offsetTop - offset
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  }

  // Get final results (search + filters)
  const finalRoutes = getFilteredRoutes()

  // Get filter count for display (only filters, not search)
  const getFilterCount = () => {
    // If no filters are applied, return total routes count
    if (!filtersApplied) return routes.length

    // Otherwise, apply the current filters to all routes to get the count
    return routes.filter((route) => {
      const {
        routeType,
        minPrice,
        maxPrice,
        minDuration,
        maxDuration,
        durationType,
        minPoints,
        maxPoints,
        difficulty,
        categories,
      } = filters

      const matchesRouteType =
        routeType === "all" ||
        route.type.toLowerCase().includes(routeType.toLowerCase()) ||
        (routeType === "walking" && (route.type.includes("пеший") || route.type.includes("walking"))) ||
        (routeType === "cycling" && route.type.includes("cycling")) ||
        (routeType === "camper" && (route.type.includes("автодом") || route.type.includes("camper"))) ||
        (routeType === "hiking" && (route.type.includes("поход") || route.type.includes("hiking"))) ||
        (routeType === "car" && route.type.includes("car"))

      const routePrice = route.price || 0
      const matchesPrice = routePrice >= minPrice && routePrice <= maxPrice

      const matchesDuration = (() => {
        const durationStr = route.duration.toLowerCase()
        let routeDurationValue = 0

        if (durationStr.includes("hour") || durationStr.includes("час")) {
          const match = durationStr.match(/(\d+)/)
          if (match) {
            routeDurationValue = Number.parseInt(match[1])
            if (durationType === "days") {
              routeDurationValue = Math.ceil(routeDurationValue / 24)
            }
          }
        } else if (durationStr.includes("day") || durationStr.includes("дн")) {
          const match = durationStr.match(/(\d+)/)
          if (match) {
            routeDurationValue = Number.parseInt(match[1])
            if (durationType === "hours") {
              routeDurationValue = routeDurationValue * 24
            }
          }
        }

        return routeDurationValue >= minDuration && routeDurationValue <= maxDuration
      })()

      const matchesPoints = route.points >= minPoints && route.points <= maxPoints

      const matchesDifficulty =
        difficulty === "all" ||
        route.difficulty.toLowerCase().includes(difficulty.toLowerCase()) ||
        (difficulty === "easy" && (route.difficulty.includes("легкая") || route.difficulty.includes("easy"))) ||
        (difficulty === "medium" && (route.difficulty.includes("средняя") || route.difficulty.includes("medium"))) ||
        (difficulty === "hard" && (route.difficulty.includes("сложная") || route.difficulty.includes("hard")))

      const matchesCategories = (() => {
        const selected = categories || []
        if (selected.length === 0) return true
        const raw = (route as any).categories || (route as any).categoryIds || (route as any).tags || []
        const ids: string[] = Array.isArray(raw)
          ? raw
              .map((c: any) => {
                if (!c) return null
                if (typeof c === "string") return c.toLowerCase()
                if (typeof c === "object" && "id" in c && typeof c.id === "string") return c.id.toLowerCase()
                return null
              })
              .filter(Boolean)
          : []
        return selected.some((s) => ids.includes(s.toLowerCase()))
      })()

      return (
        matchesRouteType && matchesPrice && matchesDuration && matchesPoints && matchesDifficulty && matchesCategories
      )
    }).length
  }

  // Determine button text and link for "Become a Creator" / "Create Route"
  const creatorButtonText = isAuthenticated && user?.isVerifiedForRoutes ? "Create Route" : "Become a Creator"
  const creatorButtonLink = isAuthenticated && user?.isVerifiedForRoutes ? "/create-route" : "/become-creator"

  // Show loading screen while data is loading
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header with Navigation */}
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#1a1a1a]">
        {/* Header */}
        <header className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-[40px]">
            <Image src="/logo.png" alt="Logo" width={73} height={40} />
          </Link>

          {/* Search and Filters */}
          {/* Search and Filters - Desktop only */}
          <div className="hidden md:flex items-center gap-2 mx-4 ml-[7.5rem]">
            <div className="relative flex items-center">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  className={`w-96 bg-[#0D0D0E] border rounded-full py-2.5 pl-4 pr-12 text-xs text-white placeholder:text-gray-500 focus:outline-none h-10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-200 search-input ${
                    searchFocused ? "border-[#6C61FF] border-[1.5px]" : "border-[#27272f]"
                  }`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                <button
                  type="submit"
                  className="absolute right-1 p-2 rounded-full bg-[#0D0D0E] transition-all hover:bg-[#5951E6] group"
                  style={{
                    border: "1px solid transparent",
                    backgroundImage:
                      "linear-gradient(to right, transparent, transparent), linear-gradient(135deg, #6C61FF, #6C61FF)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  }}
                >
                  <Search size={16} className="text-white" />
                </button>
              </form>

              {/* Enhanced Search Dropdown with Tabs + Popular Destinations when empty */}
              {searchFocused && (
                <div
                  ref={searchSuggestionsRef}
                  className="absolute top-full left-0 mt-2 w-full bg-[#0D0D0E] border border-[#27272f] rounded-xl shadow-lg overflow-hidden z-10"
                >
                  {searchQuery.length > 0 ? (
                    <>
                      {/* Tab Navigation */}
                      <div className="flex border-b border-[#27272f]">
                        <button
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeSearchTab === "locations"
                              ? "text-[#6C61FF] border-b-2 border-[#6C61FF] bg-[#1f1f23]"
                              : "text-gray-400 hover:text-gray-300"
                          }`}
                          onClick={() => setActiveSearchTab("locations")}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          Locations ({locationResults.length})
                        </button>
                        <button
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeSearchTab === "routes"
                              ? "text-[#6C61FF] border-b-2 border-[#6C61FF] bg-[#1f1f23]"
                              : "text-gray-400 hover:text-gray-300"
                          }`}
                          onClick={() => setActiveSearchTab("routes")}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          Routes ({routeResults.length})
                        </button>
                        <button
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeSearchTab === "users"
                              ? "text-[#6C61FF] border-b-2 border-[#6C61FF] bg-[#1f1f23]"
                              : "text-gray-400 hover:text-gray-300"
                          }`}
                          onClick={() => setActiveSearchTab("users")}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          Users ({userResults.length})
                        </button>
                      </div>

                      {/* Tab Content */}
                      <div className="max-h-80 overflow-y-auto">
                        {activeSearchTab === "locations" && (
                          <div className="py-2">
                            {locationResults.length > 0 ? (
                              locationResults.map((location, index) => (
                                <button
                                  key={index}
                                  className="flex items-center w-full px-4 py-2.5 text-left hover:bg-[#27272f] text-gray-300"
                                  onClick={() => selectLocation(location)}
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  <MapPin size={16} className="mr-3 text-gray-400" />
                                  <span>
                                    {location.city} <span className="text-gray-500">({location.country})</span>
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-sm">No locations found</div>
                            )}
                          </div>
                        )}

                        {activeSearchTab === "routes" && (
                          <div className="py-2">
                            {routeResults.length > 0 ? (
                              routeResults.map((route, index) => (
                                <Link
                                  key={index}
                                  href={`/route/${index}`}
                                  className="flex items-center w-full px-4 py-3 text-left hover:bg-[#27272f] text-gray-300 border-b border-[#2a2a2e] last:border-b-0"
                                  onClick={() => {
                                    setSearchFocused(false)
                                    setSearchQuery("")
                                  }}
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                    <Image
                                      src={`/${route.gallery[0]}`}
                                      alt={route.name}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-white truncate">{route.name}</div>
                                    <div className="text-sm text-gray-400 truncate">{route.location}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                      <span>{route.type}</span>
                                      <span>•</span>
                                      <span>{route.duration}</span>
                                      <span>•</span>
                                      <span>{route.points} points</span>
                                    </div>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-sm">No routes found</div>
                            )}
                          </div>
                        )}

                        {activeSearchTab === "users" && (
                          <div className="py-2">
                            {userResults.length > 0 ? (
                              userResults.map((user, index) => (
                                <Link
                                  key={index}
                                  href={`/profile/${user.nickname}`}
                                  className="flex items-center w-full px-4 py-3 text-left hover:bg-[#27272f] text-gray-300 border-b border-[#2a2a2e] last:border-b-0"
                                  onClick={() => {
                                    setSearchFocused(false)
                                    setSearchQuery("")
                                  }}
                                >
                                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                    <Image
                                      src={user.avatar || "/placeholder.svg"}
                                      alt={user.nickname}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-white">@{user.nickname}</div>
                                    <div className="text-sm text-gray-400 truncate">
                                      {user.visitedCountries} countries • {user.createdRoutes} routes
                                    </div>
                                    {user.rating && (
                                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="text-yellow-400"
                                        >
                                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                        <span>{user.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-sm">No users found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    // Popular Destinations (Desktop) when query is empty
                    <div className="p-3">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 px-1 mb-2">Popular Destinations</h3>
                      <div className="max-h-80 overflow-y-auto">
                        {popularDestinations.map((destination, index) => (
                          <button
                            key={index}
                            className="flex items-center w-full px-3 py-2.5 text-left rounded-lg hover:bg-[#1f1f23] text-gray-300"
                            onClick={() => {
                              const value = `${destination.city}, ${destination.country}`
                              setSearchQuery(value)
                              setAppliedSearchQuery(value)
                              setSearchApplied(true)
                              setSearchFocused(false)
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <MapPin size={16} className="mr-3 text-gray-400" />
                            <span>
                              {destination.city} <span className="text-gray-500">({destination.country})</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              className={`px-4 h-10 bg-[#0D0D0E] border rounded-full text-sm flex items-center gap-1 whitespace-nowrap transition-colors ${
                hasActiveFilters() || filtersApplied
                  ? "border-[#6C61FF] text-[#6C61FF]"
                  : "border-[#27272f] text-white hover:border-[#3c3c40]"
              }`}
              onClick={openFilters}
            >
              <Filter size={16} />
              <span>Filters</span>
              {(hasActiveFilters() || filtersApplied) && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#6C61FF] text-white text-xs rounded-full">
                  {getFilterCount()}
                </span>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search - Mobile only */}
            <button
              className="md:hidden p-2 rounded-full bg-[#0D0D0E] border border-[#27272f] transition-all hover:bg-[#27272f]"
              onClick={openMobileSearch}
            >
              <Search size={20} className="text-white" />
            </button>

            {/* Language Selector - Desktop only */}
            <div className="relative hidden md:hidden">
              <button ref={langButtonRef} className="flex items-center gap-1 px-3 py-1.5" onClick={toggleLangMenu}>
                <Globe size={18} />
                <span>{currentLang}</span>
              </button>

              {/* Language Menu Dropdown */}
              {langMenuOpen && (
                <div
                  ref={langMenuRef}
                  className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-[#0D0D0E] border border-[#27272f] overflow-hidden z-50"
                >
                  <div className="p-3 pr-2">
                    {/* Search Language */}
                    <div className="mb-2">
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        className="w-full bg-[#0D0D0E] border border-[#383842] rounded-md py-2 px-3 text-sm text-gray-300 focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]"
                      />
                    </div>

                    {/* Language List */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {filteredLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          className={`flex items-center w-full px-3 py-2.5 text-left rounded-md mb-1 ${
                            currentLang === lang.code ? "bg-[#4b4b65] text-white" : "hover:bg-[#27272f] text-gray-200"
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

            {/* User Menu - using common component */}
            <UserMenu onClose={() => setUserMenuOpen(false)} />
          </div>
        </header>
      </div>

      {/* Main Content - with top margin for fixed header */}
      <div className="max-w-[1300px] mx-auto px-4 py-6" style={{ marginTop: headerHeight }}>
        {searchApplied || filtersApplied ? (
          // Search/Filtered Results View
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {searchApplied ? (
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-normal text-white hidden md:block">Search Results</h1>
                    {/* Mobile search query block - increased size by 20% */}
                    <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 border border-[#27272f] rounded-full bg-[#0D0D0E]">
                      <span className="text-sm font-normal text-white truncate max-w-[180px]">
                        {appliedSearchQuery}
                      </span>
                      <button
                        onClick={clearSearch}
                        className="p-0.5 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {/* Desktop version with clear button */}
                    <div className="hidden md:flex items-center gap-2">
                      <span className="text-sm text-gray-400">for</span>
                      <div className="flex items-center gap-2 px-3 py-1.5 border border-[#27272f] rounded-full bg-[#0D0D0E]">
                        <span className="text-sm font-normal text-white">"{appliedSearchQuery}"</span>
                        <button
                          onClick={clearSearch}
                          className="p-0.5 text-gray-400 hover:text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <h1 className="text-2xl font-normal text-white">Filtered Results</h1>
                )}
              </div>
            </div>

            {/* Results Grid */}
            {finalRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {finalRoutes.map((route, index) => (
                  <RouteCard key={index} route={route} index={routes.findIndex((r) => r.name === route.name)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <Image src="/disappointed.png" alt="No routes found" width={70} height={70} className="opacity-60" />
                </div>
                <div className="text-gray-400 text-lg mb-2">
                  {searchApplied && locationResults.some((loc) => `${loc.city}, ${loc.country}` === appliedSearchQuery)
                    ? "Oops, looks like there are no routes in this location yet"
                    : "No routes found"}
                </div>
                <p className="text-gray-500 mb-4">
                  {searchApplied && locationResults.some((loc) => `${loc.city}, ${loc.country}` === appliedSearchQuery)
                    ? "Be the first to create a route for this destination!"
                    : "Try adjusting your search terms or filters"}
                </p>
                <button
                  onClick={clearAll}
                  className="px-6 py-2 bg-[#6C61FF] text-white rounded-full hover:bg-[#5951E6] transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        ) : (
          // Default Category View
          <div className="space-y-8">
            {/* New Banner Section with Carousel */}
            <section className="relative w-full rounded-2xl overflow-hidden mb-8">
              {heroImages.map((imageSrc, index) => (
                <Image
                  key={index}
                  src={imageSrc || "/placeholder.svg"}
                  alt="Discover your next adventure"
                  fill
                  sizes="100vw"
                  priority={index === 0} // Prioritize the first image for LCP [^1]
                  style={{ objectFit: "cover", transition: "opacity 1s ease-in-out" }}
                  className={`absolute inset-0 z-0 ${index === currentHeroSlide ? "opacity-100" : "opacity-0"}`}
                />
              ))}
              <div className="absolute inset-0 bg-black/50 z-10"></div> {/* Dark overlay */}
              <div className="relative z-20 flex flex-col items-start justify-center h-full py-10 px-10 md:px-16 text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl leading-tight">
                  Discover Your Next Adventure
                  <br />
                  with TripTipp
                </h1>
                <p className="text-base md:text-lg mb-8 max-w-xl text-gray-200">
                  Explore curated routes and hidden gems, or create your own unique travel experiences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {" "}
                  {/* Added w-full here */}
                  <Link
                    href={creatorButtonLink}
                    className="px-6 h-10 flex items-center justify-center bg-[#6C61FF] text-white rounded-full text-base font-medium hover:bg-[#5951E6] transition-colors shadow-lg w-full sm:w-auto" // Added w-full sm:w-auto and justify-center
                  >
                    {creatorButtonText}
                  </Link>
                  <button
                    onClick={scrollToPopularSection}
                    className="px-6 h-10 flex items-center justify-center border border-white/30 text-white rounded-full text-base font-medium hover:bg-white/10 transition-colors w-full sm:w-auto backdrop-blur-sm"
                  >
                    Explore Routes
                  </button>
                </div>
              </div>
            </section>

            {routeSections.map((section) => (
              <section
                key={section.title}
                className="space-y-4"
                ref={section.title === "Popular" ? popularSectionRef : null} // Assign ref to Popular section
              >
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-normal text-white">{section.title}</h2>
                  <div className="hidden md:flex items-center gap-1">
                    <button
                      onClick={() => scrollHorizontal(section.title, "left")}
                      className="p-1.5 rounded-full bg-[#18181c] border border-[#27272f] transition-colors hover:bg-[#27272f] text-white"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => scrollHorizontal(section.title, "right")}
                      className="p-1.5 rounded-full bg-[#18181c] border border-[#27272f] transition-colors hover:bg-[#27272f] text-white"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Routes carousel */}
                <div className="relative">
                  <div
                    ref={(el) => {
                      scrollContainerRefs.current[section.title] = el
                    }}
                    className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide"
                  >
                    {section.routes.map((route, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-full max-w-[300px] snap-start"
                        style={{ minWidth: "280px" }}
                      >
                        <RouteCard
                          route={route}
                          index={routes.findIndex((r) => r.name === route.name)}
                          displayCategory={getCardDisplayCategory(section.title, route.type)} // Pass the section title as displayCategory
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Filters modal - using the new component */}
      <FiltersModal
        isOpen={filtersOpen}
        onClose={closeFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={clearFilters}
        initialFilters={filters}
        filterCount={getFilterCount()}
      />

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black z-[100] md:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
              <h2 className="text-lg font-medium">Search</h2>
              <button onClick={closeMobileSearch} className="p-2 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-[#1a1a1a]">
              <div className="flex gap-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    applySearch()
                    closeMobileSearch()
                  }}
                  className="relative flex-1"
                >
                  <input
                    type="text"
                    placeholder="Search destinations, routes, users..."
                    className="w-full bg-[#0D0D0E] border border-[#27272f] rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C61FF] h-12"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                  <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Search size={16} className="text-gray-400" />
                  </button>
                  {/* Removed the conditional clear button for mobile search input */}
                </form>
                <button
                  onClick={() => {
                    closeMobileSearch()
                    openFilters()
                  }}
                  className="px-4 bg-[#0D0D0E] border border-[#27272f] rounded-full text-sm text-gray-300 flex items-center gap-1 h-12 whitespace-nowrap"
                >
                  <Filter size={14} />
                  Filters
                </button>
              </div>
            </div>

            {/* Search Results or Popular Destinations */}
            <div className="flex-1 overflow-y-auto">
              {searchQuery.length > 0 ? (
                // Search Results with Tabs
                <div className="flex flex-col h-full">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-[#27272f] bg-black sticky top-0 z-10">
                    <button
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeSearchTab === "locations"
                          ? "text-[#6C61FF] border-b-2 border-[#6C61FF] bg-[#1f1f23]"
                          : "text-gray-400"
                      }`}
                      onClick={() => setActiveSearchTab("locations")}
                    >
                      Locations ({locationResults.length})
                    </button>
                    <button
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeSearchTab === "routes"
                          ? "text-[#6C61FF] border-b-2 border-[#6C61FF] bg-[#1f1f23]"
                          : "text-gray-400"
                      }`}
                      onClick={() => setActiveSearchTab("routes")}
                    >
                      Routes ({routeResults.length})
                    </button>
                    <button
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeSearchTab === "users"
                          ? "text-[#6C61FF] border-b-2 border-[#6C61FF] bg-[#1f1f23]"
                          : "text-gray-400"
                      }`}
                      onClick={() => setActiveSearchTab("users")}
                    >
                      Users ({userResults.length})
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto">
                    {activeSearchTab === "locations" && (
                      <div className="py-2">
                        {locationResults.length > 0 ? (
                          locationResults.map((location, index) => (
                            <button
                              key={index}
                              className="flex items-center w-full px-4 py-3 text-left hover:bg-[#27272f] text-gray-300"
                              onClick={() => {
                                setSearchQuery(`${location.city}, ${location.country}`)
                                setAppliedSearchQuery(`${location.city}, ${location.country}`)
                                setSearchApplied(true)
                                closeMobileSearch()
                              }}
                            >
                              <MapPin size={16} className="mr-3 text-gray-400" />
                              <span>
                                {location.city} <span className="text-gray-500">({location.country})</span>
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">No locations found</div>
                        )}
                      </div>
                    )}

                    {activeSearchTab === "routes" && (
                      <div className="py-2">
                        {routeResults.length > 0 ? (
                          routeResults.map((route, index) => (
                            <Link
                              key={index}
                              href={`/route/${index}`}
                              className="flex items-center w-full px-4 py-3 text-left hover:bg-[#27272f] text-gray-300 border-b border-[#2a2a2e] last:border-b-0"
                              onClick={closeMobileSearch}
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                <Image
                                  src={`/${route.gallery[0]}`}
                                  alt={route.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white truncate">{route.name}</div>
                                <div className="text-sm text-gray-400 truncate">{route.location}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                  <span>{route.type}</span>
                                  <span>•</span>
                                  <span>{route.duration}</span>
                                  <span>•</span>
                                  <span>{route.points} points</span>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">No routes found</div>
                        )}
                      </div>
                    )}

                    {activeSearchTab === "users" && (
                      <div className="py-2">
                        {userResults.length > 0 ? (
                          userResults.map((user, index) => (
                            <Link
                              key={index}
                              href={`/profile/${user.nickname}`}
                              className="flex items-center w-full px-4 py-3 text-left hover:bg-[#27272f] text-gray-300 border-b border-[#2a2a2e] last:border-b-0"
                              onClick={closeMobileSearch}
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                <Image
                                  src={user.avatar || "/placeholder.svg"}
                                  alt={user.nickname}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white">@{user.nickname}</div>
                                <div className="text-sm text-gray-400 truncate">
                                  {user.visitedCountries} countries • {user.createdRoutes} routes
                                </div>
                                {user.rating && (
                                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="text-yellow-400"
                                    >
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    <span>{user.rating}</span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">No users found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Popular Destinations
                <div className="p-4">
                  <h3 className="text-sm text-gray-400 mb-3">Popular Destinations</h3>
                  <div className="space-y-2">
                    {popularDestinations.map((destination, index) => (
                      <button
                        key={index}
                        className="flex items-center w-full px-3 py-2.5 text-left hover:bg-[#27272f] rounded-lg text-gray-300"
                        onClick={() => {
                          setSearchQuery(`${destination.city}, ${destination.country}`)
                          setAppliedSearchQuery(`${destination.city}, ${destination.country}`)
                          setSearchApplied(true)
                          closeMobileSearch()
                        }}
                      >
                        <MapPin size={16} className="mr-3 text-gray-400" />
                        <span>
                          {destination.city} <span className="text-gray-500">({destination.country})</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="bg-gradient-to-b from-black to-[#0A0A0A] border-t border-[#1a1a1a] py-16 text-gray-400">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Main Footer Content */}
          <div className="text-center mb-12">
            {/* Logo and Brand */}
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center group">
                <span className="text-2xl font-bold text-white">TripTipp</span>
              </Link>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Discover extraordinary journeys and create unforgettable travel experiences.
              <br />
              Your next adventure starts here.
            </p>

            {/* Social Media */}
            <div className="flex justify-center space-x-6 mb-8">
              <Link
                href="https://www.instagram.com/triptipp.inst/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 group"
              >
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://www.tiktok.com/@triptipp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-black transition-all duration-300 group"
              >
                <SiTiktok size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://t.me/triptipp_channel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition-all duration-300 group"
              >
                <Send size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center md:text-left">
            {/* Explore */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={scrollToPopularSection}
                    className="hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Popular Routes
                  </button>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors text-sm">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors text-sm">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Create */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Create</h3>
              <ul className="space-y-3">
                <li>
                  <Link href={creatorButtonLink} className="hover:text-white transition-colors text-sm">
                    {creatorButtonText}
                  </Link>
                </li>
                <li>
                  <Link href="/creator-resources" className="hover:text-white transition-colors text-sm">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/creator-support" className="hover:text-white transition-colors text-sm">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="hover:text-white transition-colors text-sm">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors text-sm">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="hover:text-white transition-colors text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors text-sm">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#1f1f23] flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
              <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} TripTipp. All rights reserved.</p>
              <div className="flex items-center gap-4 text-xs">
                <Link href="#" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/security" className="hover:text-white transition-colors">
                  Privacy
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="#" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>

            {/* Made with love indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Made with</span>
              <span className="text-red-400 animate-pulse">♥</span>
              <span>for travelers</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
