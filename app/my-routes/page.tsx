"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { Globe, ChevronDown, Search, Edit, Trash2, Plus, X, Save, MapPin, Eye } from "lucide-react"
import UserMenu from "@/components/user-menu"
import { routes } from "@/data/routes"
// Import the new RouteImageValidator component
import RouteImageValidator from "@/components/route-image-validator"
// Add the import for the new component at the top of the file
import LandmarkEditor from "@/components/landmark-editor"

export default function MyRoutesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userRoutes, setUserRoutes] = useState<any[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Filters
  const [routeFilter, setRouteFilter] = useState("newest") // newest, oldest, popularity
  const [typeFilter, setTypeFilter] = useState("all") // all, walking, car, guide, camper
  const [difficultyFilter, setDifficultyFilter] = useState("all") // all, easy, medium, hard

  // States for dropdowns
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentEditRoute, setCurrentEditRoute] = useState<any>(null)
  const [editedRoute, setEditedRoute] = useState<any>(null)

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [routeToDelete, setRouteToDelete] = useState<any>(null)

  useEffect(() => {
    // In a real app, we would get the current user from an auth context or API
    // For now, we're assuming the logged-in user is "mar_ka4"
    const currentUserNickname = "mar_ka4"

    const userData = getUserByNickname(currentUserNickname)
    if (!userData) {
      router.push("/")
      return
    }

    setUser(userData)

    // Get the routes directly from our data source
    const userRoutesData = routes.filter((route) => route.author === currentUserNickname)
    setUserRoutes(userRoutesData)
    setFilteredRoutes(userRoutesData)

    setLoading(false)
  }, [router])

  // Function to filter routes
  useEffect(() => {
    if (!userRoutes.length) return

    let filtered = [...userRoutes]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (route) =>
          route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((route) => route.type === typeFilter)
    }

    // Filter by difficulty
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((route) => route.difficulty === difficultyFilter)
    }

    // Sort
    if (routeFilter === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (routeFilter === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (routeFilter === "popularity") {
      filtered.sort((a, b) => b.totalUses - a.totalUses)
    }

    setFilteredRoutes(filtered)
  }, [userRoutes, searchQuery, typeFilter, difficultyFilter, routeFilter])

  // Function to open edit modal
  const openEditModal = (route: any) => {
    setCurrentEditRoute(route)
    setEditedRoute({ ...route })
    setIsEditModalOpen(true)
  }

  // Function to close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setCurrentEditRoute(null)
    setEditedRoute(null)
  }

  // Function to save route changes
  const saveRouteChanges = () => {
    // In a real app, this would be an API call to update the route in the database
    // For our demo, we'll update the routes array directly
    const updatedRoutes = routes.map((route) => {
      if (route.name === currentEditRoute.name && route.author === user.nickname) {
        return editedRoute
      }
      return route
    })

    // Update our local state
    const userRoutesData = updatedRoutes.filter((route) => route.author === user.nickname)
    setUserRoutes(userRoutesData)

    closeEditModal()
  }

  // Function to open delete confirmation modal
  const openDeleteModal = (route: any) => {
    setRouteToDelete(route)
    setIsDeleteModalOpen(true)
  }

  // Function to close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setRouteToDelete(null)
  }

  // Function to delete route
  const deleteRoute = () => {
    // In a real app, this would be an API call to delete the route from the database
    // For our demo, we'll filter the routes array
    const updatedGlobalRoutes = routes.filter(
      (route) => !(route.name === routeToDelete.name && route.author === user.nickname),
    )

    // Update our local state with the filtered routes for this user
    const updatedUserRoutes = updatedGlobalRoutes.filter((route) => route.author === user.nickname)
    setUserRoutes(updatedUserRoutes)

    closeDeleteModal()
  }

  // Update the handleLandmarkChange function to handle the new fields
  const handleLandmarkChange = (index: number, field: string, value: any) => {
    const updatedLandmarks = [...editedRoute.landmarks]
    updatedLandmarks[index] = {
      ...updatedLandmarks[index],
      [field]: value,
    }

    setEditedRoute({
      ...editedRoute,
      landmarks: updatedLandmarks,
    })
  }

  // Update the addLandmark function to include the new fields
  const addLandmark = () => {
    const newLandmark = {
      name: "New Point",
      image: "img/placeholder-image.png",
      description: "",
      gallery: ["img/placeholder-image.png", "", "", "", ""],
    }

    setEditedRoute({
      ...editedRoute,
      landmarks: [...editedRoute.landmarks, newLandmark],
    })
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
  }

  // Handler for changes in the edit form
  const handleEditChange = (field: string, value: any) => {
    setEditedRoute({
      ...editedRoute,
      [field]: value,
    })
  }

  // Handler to remove a landmark
  const removeLandmark = (index: number) => {
    const updatedLandmarks = [...editedRoute.landmarks]
    updatedLandmarks.splice(index, 1)

    setEditedRoute({
      ...editedRoute,
      landmarks: updatedLandmarks,
    })
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black border-b border-[#1a1a1a]">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-[40px]">
            <Image src="/logo.png" alt="Logo" width={73} height={40} />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button className="flex items-center gap-1 px-3 py-1.5">
                <Globe size={18} />
                <span>EN</span>
              </button>
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-[1100px] w-full mx-auto px-4 pt-24">
        {/* Breadcrumb navigation */}
        <div className="py-2 px-4 mb-8 -mx-4">
          <div className="flex items-center text-sm">
            <Link href="/studio" className="text-gray-400 hover:text-white">
              Creator Studio
            </Link>
            <span className="mx-2 text-gray-600">›</span>
            <span className="text-white">Created Routes</span>
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-medium">Your Routes</h1>
        </div>

        {/* Filters and search - Fixed mobile layout */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search - Full width on mobile */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18181c] border border-[#27272f] rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filters - Grid layout for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Type filter */}
            <div className="relative">
              <button
                className="w-full px-4 py-2 bg-[#18181c] border border-[#27272f] rounded-md text-sm flex items-center justify-between gap-2"
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown)
                  setShowSortDropdown(false)
                  setShowDifficultyDropdown(false)
                }}
              >
                <span className="truncate">
                  {typeFilter === "all"
                    ? "All types"
                    : typeFilter === "walking"
                      ? "Walking"
                      : typeFilter === "car"
                        ? "Car"
                        : typeFilter === "hiking"
                          ? "Hiking"
                          : "Camper"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform flex-shrink-0 ${showTypeDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showTypeDropdown && (
                <div className="absolute left-0 mt-1 w-full bg-[#18181c] border border-[#27272f] rounded-md shadow-lg z-10">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setTypeFilter("all")
                      setShowTypeDropdown(false)
                    }}
                  >
                    All types
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setTypeFilter("walking")
                      setShowTypeDropdown(false)
                    }}
                  >
                    Walking
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setTypeFilter("car")
                      setShowTypeDropdown(false)
                    }}
                  >
                    Car
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setTypeFilter("hiking")
                      setShowTypeDropdown(false)
                    }}
                  >
                    Hiking
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setTypeFilter("camper")
                      setShowTypeDropdown(false)
                    }}
                  >
                    Camper
                  </button>
                </div>
              )}
            </div>

            {/* Difficulty filter */}
            <div className="relative">
              <button
                className="w-full px-4 py-2 bg-[#18181c] border border-[#27272f] rounded-md text-sm flex items-center justify-between gap-2"
                onClick={() => {
                  setShowDifficultyDropdown(!showDifficultyDropdown)
                  setShowTypeDropdown(false)
                  setShowSortDropdown(false)
                }}
              >
                <span className="truncate">
                  {difficultyFilter === "all"
                    ? "Any difficulty"
                    : difficultyFilter === "easy"
                      ? "Easy"
                      : difficultyFilter === "medium"
                        ? "Medium"
                        : "Hard"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform flex-shrink-0 ${showDifficultyDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showDifficultyDropdown && (
                <div className="absolute left-0 mt-1 w-full bg-[#18181c] border border-[#27272f] rounded-md shadow-lg z-10">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setDifficultyFilter("all")
                      setShowDifficultyDropdown(false)
                    }}
                  >
                    Any difficulty
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setDifficultyFilter("easy")
                      setShowDifficultyDropdown(false)
                    }}
                  >
                    Easy
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setDifficultyFilter("medium")
                      setShowDifficultyDropdown(false)
                    }}
                  >
                    Medium
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setDifficultyFilter("hard")
                      setShowDifficultyDropdown(false)
                    }}
                  >
                    Hard
                  </button>
                </div>
              )}
            </div>

            {/* Sort filter */}
            <div className="relative">
              <button
                className="w-full px-4 py-2 bg-[#18181c] border border-[#27272f] rounded-md text-sm flex items-center justify-between gap-2"
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown)
                  setShowTypeDropdown(false)
                  setShowDifficultyDropdown(false)
                }}
              >
                <span className="truncate">
                  {routeFilter === "newest"
                    ? "Newest first"
                    : routeFilter === "oldest"
                      ? "Oldest first"
                      : "By popularity"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform flex-shrink-0 ${showSortDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showSortDropdown && (
                <div className="absolute left-0 mt-1 w-full bg-[#18181c] border border-[#27272f] rounded-md shadow-lg z-10">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setRouteFilter("newest")
                      setShowSortDropdown(false)
                    }}
                  >
                    Newest first
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setRouteFilter("oldest")
                      setShowSortDropdown(false)
                    }}
                  >
                    Oldest first
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                    onClick={() => {
                      setRouteFilter("popularity")
                      setShowSortDropdown(false)
                    }}
                  >
                    By popularity
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] p-4">
            <div className="text-sm text-gray-400 mb-1">Total routes</div>
            <div className="text-2xl font-medium">{userRoutes.length}</div>
          </div>

          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] p-4">
            <div className="text-sm text-gray-400 mb-1">Total uses</div>
            <div className="text-2xl font-medium">{userRoutes.reduce((sum, route) => sum + route.totalUses, 0)}</div>
          </div>

          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] p-4">
            <div className="text-sm text-gray-400 mb-1">Total revenue</div>
            <div className="text-2xl font-medium">
              ${userRoutes.reduce((sum, route) => sum + route.totalRevenue, 0).toFixed(2)}
            </div>
          </div>

          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] p-4">
            <div className="text-sm text-gray-400 mb-1">Popular type</div>
            <div className="text-2xl font-medium">
              {(() => {
                const typeCounts = userRoutes.reduce((acc, route) => {
                  acc[route.type] = (acc[route.type] || 0) + 1
                  return acc
                }, {})

                let maxType = ""
                let maxCount = 0

                Object.entries(typeCounts).forEach(([type, count]) => {
                  if (count > maxCount) {
                    maxType = type
                    maxCount = count
                  }
                })

                return maxType || "No data"
              })()}
            </div>
          </div>
        </div>

        {/* Routes list */}
        {filteredRoutes.length > 0 ? (
          <div className="space-y-4">
            {filteredRoutes.map((route, index) => (
              <div key={index} className="bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row gap-4">
                  {/* Route image */}
                  <div className="w-full md:w-48 h-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <RouteImageValidator
                      routeName={route.name}
                      imagePath={
                        route.gallery && route.gallery.length > 0 ? `/${route.gallery[0]}` : "/placeholder-image.png"
                      }
                      alt={route.name}
                      width={192}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Route information */}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                      <div>
                        <h3 className="font-medium text-lg mb-1">{route.name}</h3>
                        <p className="text-sm text-gray-400 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {route.location}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/route/${routes.findIndex((r) => r.name === route.name && r.author === route.author)}`}
                          className="px-3 py-1.5 bg-[#18181c] hover:bg-[#27272f] rounded-md text-sm flex items-center gap-1.5 text-white transition-colors"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <button
                          className="px-3 py-1.5 bg-[#18181c] hover:bg-[#27272f] rounded-md text-sm flex items-center gap-1.5 text-indigo-400 transition-colors"
                          onClick={() => openEditModal(route)}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>

                        <button
                          className="p-2 bg-[#18181c] hover:bg-[#27272f] rounded-md flex items-center justify-center text-red-400 transition-colors"
                          onClick={() => openDeleteModal(route)}
                          aria-label="Delete route"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Route type */}
                      <div className="bg-[#0c0c0e] rounded-md p-2">
                        <div className="text-xs text-gray-400 mb-1">Route type</div>
                        <div className="font-medium">{route.type}</div>
                      </div>

                      {/* Difficulty */}
                      <div className="bg-[#0c0c0e] rounded-md p-2">
                        <div className="text-xs text-gray-400 mb-1">Difficulty</div>
                        <div className="font-medium">{route.difficulty}</div>
                      </div>

                      {/* Points count */}
                      <div className="bg-[#0c0c0e] rounded-md p-2">
                        <div className="text-xs text-gray-400 mb-1">Points</div>
                        <div className="font-medium">{route.points}</div>
                      </div>

                      {/* Usage statistics */}
                      <div className="bg-[#0c0c0e] rounded-md p-2">
                        <div className="text-xs text-gray-400 mb-1">Uses</div>
                        <div className="font-medium">
                          {route.totalUses}{" "}
                          <span className="text-xs text-gray-400">/ ${route.totalRevenue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] p-8 text-center">
            <p className="text-gray-400 mb-4">You don't have any routes yet or no routes match the selected filters</p>
            <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors">
              Create your first route
            </button>
          </div>
        )}
      </div>

      {/* Route edit modal */}
      {isEditModalOpen && editedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[200]">
          <div
            className="bg-[#0f0f11] rounded-2xl shadow-xl w-full max-w-4xl mx-4 flex flex-col border border-[#27272f]"
            style={{ maxHeight: "90vh" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272f] sticky top-0 bg-[#0f0f11] z-10 rounded-t-2xl">
              <h2 className="text-xl font-medium">Edit Route</h2>
              <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeEditModal}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-dark-scrollbar" style={{ maxHeight: "calc(90vh - 130px)" }}>
              <div className="space-y-8">
                <div className="bg-[#0c0c0e] rounded-xl p-5 border border-[#1a1a1a]">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                      1
                    </div>
                    <span>Basic Information</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Route name */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Route name</label>
                      <input
                        type="text"
                        value={editedRoute.name}
                        onChange={(e) => handleEditChange("name", e.target.value)}
                        className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Location</label>
                      <input
                        type="text"
                        value={editedRoute.location}
                        onChange={(e) => handleEditChange("location", e.target.value)}
                        className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Route type */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Route type</label>
                      <select
                        value={editedRoute.type}
                        onChange={(e) => handleEditChange("type", e.target.value)}
                        className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="walking">Walking</option>
                        <option value="car">Car</option>
                        <option value="hiking">Hiking</option>
                        <option value="camper">Camper</option>
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
                      <select
                        value={editedRoute.difficulty}
                        onChange={(e) => handleEditChange("difficulty", e.target.value)}
                        className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    {/* Points count */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Number of points</label>
                      <input
                        type="number"
                        value={editedRoute.points}
                        onChange={(e) => handleEditChange("points", Number.parseInt(e.target.value))}
                        className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Duration</label>
                      <input
                        type="text"
                        value={editedRoute.duration}
                        onChange={(e) => handleEditChange("duration", e.target.value)}
                        className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0c0c0e] rounded-xl p-5 border border-[#1a1a1a]">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                      2
                    </div>
                    <span>Price and Availability</span>
                  </h3>

                  <div className="space-y-4">
                    {/* Route price */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Route price ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={editedRoute.price || 0}
                        onChange={(e) => handleEditChange("price", Number.parseInt(e.target.value))}
                        className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter 0 for a free route</p>
                    </div>

                    {/* Subscription availability */}
                    <div className="flex items-center justify-between p-4 bg-[#0c0c0e] rounded-md">
                      <div className="font-medium">Available with subscription</div>
                      <div className="relative inline-block">
                        <input
                          type="checkbox"
                          id="subscriptionAvailable"
                          className="sr-only"
                          checked={editedRoute.subscriptionAvailable || false}
                          onChange={(e) => handleEditChange("subscriptionAvailable", e.target.checked)}
                        />
                        <label
                          htmlFor="subscriptionAvailable"
                          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                            editedRoute.subscriptionAvailable ? "bg-indigo-500" : "bg-[#27272f]"
                          }`}
                        >
                          <span
                            className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                              editedRoute.subscriptionAvailable ? "translate-x-[26px]" : "translate-x-[2px]"
                            } top-[2px]`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0c0c0e] rounded-xl p-5 border border-[#1a1a1a]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                        3
                      </div>
                      <span>Route Gallery</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {Array.from({ length: 5 }).map((_, galleryIndex) => {
                      const imagePath =
                        editedRoute.gallery && editedRoute.gallery[galleryIndex]
                          ? editedRoute.gallery[galleryIndex]
                          : ""
                      return (
                        <div key={galleryIndex} className="relative aspect-[4/3]">
                          <div className="w-full h-full rounded-md overflow-hidden border border-[#27272f] bg-[#0c0c0e]">
                            {imagePath ? (
                              <RouteImageValidator
                                routeName={editedRoute.name}
                                imagePath={`/${imagePath}`}
                                alt={`Route image ${galleryIndex + 1}`}
                                width={200}
                                height={150}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Plus size={20} className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <button
                            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            onClick={() => {
                              const newPath = prompt("Enter image path:", imagePath || "")
                              if (newPath !== null) {
                                const newGallery = [...(editedRoute.gallery || [])]
                                while (newGallery.length < 5) {
                                  newGallery.push("")
                                }
                                newGallery[galleryIndex] = newPath
                                handleEditChange("gallery", newGallery)
                              }
                            }}
                          >
                            <Edit size={12} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-[#0c0c0e] rounded-xl p-5 border border-[#1a1a1a]">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                      4
                    </div>
                    <span>Route Description</span>
                  </h3>
                  <label className="block text-sm text-gray-400 mb-2">Detailed description</label>
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Detailed description of the route for travelers</span>
                    <span className="text-xs text-gray-500">{editedRoute.description.length} characters</span>
                  </div>
                  <textarea
                    value={editedRoute.description}
                    onChange={(e) => handleEditChange("description", e.target.value)}
                    rows={15}
                    className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="bg-[#0c0c0e] rounded-xl p-5 border border-[#1a1a1a]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                        5
                      </div>
                      <span>Route Points</span>
                    </h3>
                    <button
                      className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-md text-sm flex items-center gap-1.5 text-white transition-colors"
                      onClick={addLandmark}
                    >
                      <Plus size={14} />
                      <span>Add Point</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedRoute.landmarks.map((landmark: any, index: number) => (
                      <LandmarkEditor
                        key={index}
                        landmark={landmark}
                        index={index}
                        onUpdate={handleLandmarkChange}
                        onRemove={removeLandmark}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-[#27272f] sticky bottom-0 bg-[#0f0f11] z-10 rounded-b-2xl">
              <button
                className="px-4 py-2 bg-[#1a1a1e] hover:bg-[#27272f] rounded-md text-white transition-colors"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors flex items-center gap-2"
                onClick={saveRouteChanges}
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[200]">
          <div className="bg-[#0f0f11] rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col border border-[#27272f]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272f] rounded-t-2xl">
              <h2 className="text-xl font-medium">Confirm Deletion</h2>
              <button className="text-gray-400 hover:text-white transition-colors p-1" onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-2">Are you sure you want to delete this route?</p>
              <p className="text-gray-400 mb-4">"{routeToDelete?.name}"</p>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-[#1a1a1e] hover:bg-[#27272f] rounded-md text-white transition-colors"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white transition-colors flex items-center gap-2"
                  onClick={deleteRoute}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
