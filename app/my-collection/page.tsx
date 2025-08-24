"use client"

import { useSearchParams } from "next/navigation"

import { useRouter } from "next/navigation"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Clock, CheckCircle, Plus, ArrowLeft, X, Trash2 } from "lucide-react" // Удалены LayoutGrid, List
import UserMenu from "@/components/user-menu"
import { routes } from "@/data/routes"
import {
  getUserWishlists,
  createWishlist,
  deleteWishlist,
  removeRouteFromWishlist,
  type Wishlist,
  getUserByNickname,
} from "@/data/users"
import { useAuth } from "@/context/auth-context"
import RouteCard from "@/components/route-card"

export default function MyCollectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("wishlists")
  const [loading, setLoading] = useState(true)
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [purchasedRoutes, setPurchasedRoutes] = useState<any[]>([])
  const [completedRoutes, setCompletedRoutes] = useState<any[]>([])
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false)
  const [newWishlistName, setNewWishlistName] = useState("")

  // State for selected wishlist
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null)

  // Add state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [wishlistToDelete, setWishlistToDelete] = useState<Wishlist | null>(null)
  const [isRouteDeleteModalOpen, setIsRouteDeleteModalOpen] = useState(false)
  const [routeToDelete, setRouteToDelete] = useState<{ routeId: string; wishlistId: number } | null>(null) // routeId теперь string

  // Check if we should show the create wishlist form based on URL params
  useEffect(() => {
    if (searchParams.get("create") === "wishlist") {
      setIsCreatingWishlist(true)
    } else {
      setIsCreatingWishlist(false)
    }
  }, [searchParams])

  // Load user data and wishlists only once on component mount or when auth changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login")
      return
    }

    // Get wishlists from the user data
    const userWishlists = getUserWishlists(user.nickname)
    setWishlists(userWishlists)

    // Get the full user object to access purchasedRoutes
    const fullUser = getUserByNickname(user.nickname)
    if (fullUser && fullUser.purchasedRoutes) {
      // Filter out any undefined routes if an ID doesn't match
      // Убеждаемся, что сравнение идет строка со строкой
      const purchased = fullUser.purchasedRoutes.map((id) => routes.find((route) => route.id === id)).filter(Boolean)
      setPurchasedRoutes(purchased)

      // DEBUGGING: Log the purchased routes to see what's being fetched
      console.log("User's purchased route IDs:", fullUser.purchasedRoutes)
      console.log("Fetched purchased routes (after find and filter):", purchased)
      if (purchased.length === 0 && fullUser.purchasedRoutes.length > 0) {
        console.warn(
          "No purchased routes displayed despite user having purchased IDs. Check if route IDs in data/routes.ts match the IDs in data/users.ts.",
        )
        console.log(
          "Available routes (first 5) for comparison:",
          routes.slice(0, 5).map((r) => ({ id: r.id, name: r.name })),
        )
      }
    } else {
      setPurchasedRoutes([])
    }

    // Mock data for completed routes (assuming it's not in user data yet)
    // Убеждаемся, что mockCompleted ис��ользует строковые ID
    const mockCompleted = ["2"] // Iceland route ID (изменено на строку)
    const completed = mockCompleted.map((id) => routes.find((route) => route.id === id)).filter(Boolean)
    setCompletedRoutes(completed)
    setLoading(false)
  }, [isAuthenticated, user, router])

  // Function to get the image path for a wishlist
  const getWishlistImagePath = (wishlist: Wishlist) => {
    if (wishlist.routes.length === 0) {
      return null // No image for empty wishlists
    }

    // Get the first route in the wishlist by ID (firstRouteId уже строка)
    const firstRouteId = wishlist.routes[0]
    const route = routes.find((r) => r.id === firstRouteId) // Сравнение теперь строка со строкой

    // Return the first image from the route's gallery
    if (route && route.gallery && route.gallery.length > 0) {
      return `/${route.gallery[0]}`
    }

    return null
  }

  // Function to handle wishlist click
  const handleWishlistClick = (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist)
  }

  // Function to close wishlist detail view
  const closeWishlistDetail = () => {
    setSelectedWishlist(null)
  }

  // Function to handle creating a new wishlist
  const handleCreateWishlist = () => {
    if (!isAuthenticated || !user || !newWishlistName.trim()) {
      return
    }

    // Create a new wishlist in the database
    const newWishlist = createWishlist(user.nickname, newWishlistName)

    if (newWishlist) {
      // Update the local state to include the new wishlist
      setWishlists((prevWishlists) => [...prevWishlists, newWishlist])

      // Reset the form
      setNewWishlistName("")
      setIsCreatingWishlist(false)

      // Remove the query parameter
      router.push("/my-collection")
    }
  }

  // Add function to handle wishlist deletion
  const handleDeleteWishlist = (wishlist: Wishlist, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent clicking through to the wishlist
    setWishlistToDelete(wishlist)
    setIsDeleteModalOpen(true)
  }

  // Add function to confirm wishlist deletion
  const confirmDeleteWishlist = () => {
    if (!wishlistToDelete || !user) return

    const success = deleteWishlist(user.nickname, wishlistToDelete.id)

    if (success) {
      // Update local state
      setWishlists(wishlists.filter((w) => w.id !== wishlistToDelete.id))

      // Close modal and reset state
      setIsDeleteModalOpen(false)
      setWishlistToDelete(null)
    }
  }

  // Add function to handle route removal from wishlist
  const handleRemoveRouteFromWishlist = (routeId: string, e: React.MouseEvent) => {
    // routeId теперь string
    e.preventDefault() // Prevent navigation to route page
    e.stopPropagation() // Prevent event bubbling

    if (!selectedWishlist || !user) return

    setRouteToDelete({ routeId, wishlistId: selectedWishlist.id })
    setIsRouteDeleteModalOpen(true)
  }

  // Add function to confirm route removal
  const confirmRemoveRoute = () => {
    if (!routeToDelete || !user) return

    // routeToDelete.routeId уже строка
    const success = removeRouteFromWishlist(user.nickname, routeToDelete.wishlistId, routeToDelete.routeId)

    if (success) {
      // Update local state
      if (selectedWishlist && selectedWishlist.id === routeToDelete.wishlistId) {
        setSelectedWishlist({
          ...selectedWishlist,
          routes: selectedWishlist.routes.filter((id) => id !== routeToDelete.routeId),
        })
      }

      // Update wishlists state
      setWishlists(
        wishlists.map((wishlist) => {
          if (wishlist.id === routeToDelete.wishlistId) {
            return {
              ...wishlist,
              routes: wishlist.routes.filter((id) => id !== routeToDelete.routeId),
            }
          }
          return wishlist
        }),
      )

      // Close modal and reset state
      setIsRouteDeleteModalOpen(false)
      setRouteToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-16 relative overflow-hidden">
      {/* Colored circles in background with animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/8 blur-[100px] animate-float-slow"></div>
        <div className="absolute top-[60%] right-[15%] w-[300px] h-[300px] rounded-full bg-indigo-500/12 blur-[120px] animate-float-delayed"></div>
        <div className="absolute bottom-[20%] left-[40%] w-[400px] h-[400px] rounded-full bg-pink-400/10 blur-[100px] animate-float-reverse"></div>
      </div>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black border-b border-[#1a1a1a]">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-[40px]">
            <Image src="/logo.png" alt="Logo" width={73} height={40} />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-[1100px] w-full mx-auto px-4 pt-24 relative z-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium">My Routes</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1a1a1a] mb-8 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <button
            className={`px-6 py-3 text-sm font-medium relative ${
              activeTab === "wishlists" ? "text-white" : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => {
              setActiveTab("wishlists")
              setSelectedWishlist(null) // Close wishlist detail when changing tabs
            }}
          >
            <div className="flex items-center gap-2">
              <Heart size={16} className={activeTab === "wishlists" ? "text-red-500" : ""} />
              <span>Wishlists</span>
              <span className="bg-[#1a1a1a] text-xs px-2 py-0.5 rounded-full">{wishlists.length || 0}</span>
            </div>
            {activeTab === "wishlists" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></div>}
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium relative ${
              activeTab === "purchased" ? "text-white" : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => {
              setActiveTab("purchased")
              setSelectedWishlist(null) // Close wishlist detail when changing tabs
            }}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Purchased</span>
              <span className="bg-[#1a1a1a] text-xs px-2 py-0.5 rounded-full">{purchasedRoutes.length || 0}</span>
            </div>
            {activeTab === "purchased" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></div>}
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium relative ${
              activeTab === "completed" ? "text-white" : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => {
              setActiveTab("completed")
              setSelectedWishlist(null) // Close wishlist detail when changing tabs
            }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className={activeTab === "completed" ? "text-green-500" : ""} />
              <span>Completed</span>
              <span className="bg-[#1a1a1a] text-xs px-2 py-0.5 rounded-full">{completedRoutes.length || 0}</span>
            </div>
            {activeTab === "completed" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></div>}
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "wishlists" && (
          <>
            {/* Create new wishlist form */}
            {isCreatingWishlist ? (
              <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium">Create New Wishlist</h2>
                  <button
                    onClick={() => {
                      setIsCreatingWishlist(false)
                      router.push("/my-collection")
                    }}
                    className="p-2 rounded-full hover:bg-[#1a1a1a] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <label htmlFor="wishlist-name" className="block text-sm text-gray-400 mb-2">
                    Wishlist Name
                  </label>
                  <input
                    id="wishlist-name"
                    type="text"
                    value={newWishlistName}
                    onChange={(e) => setNewWishlistName(e.target.value)}
                    placeholder="Enter wishlist name"
                    className="w-full bg-[#121214] border border-[#27272f] rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleCreateWishlist}
                  disabled={!newWishlistName.trim()}
                  className={`px-4 py-2 rounded-lg bg-indigo-600 text-white ${
                    !newWishlistName.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                  } transition-colors`}
                >
                  Create Wishlist
                </button>
              </div>
            ) : (
              <>
                {/* Wishlist detail view */}
                {selectedWishlist ? (
                  <div>
                    {/* Back button and wishlist name */}
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={closeWishlistDetail}
                        className="p-2 rounded-full bg-[#18181c] hover:bg-[#27272f] transition-colors"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <h2 className="text-xl font-medium">{selectedWishlist.name}</h2>
                      <span className="bg-[#1a1a1a] text-xs px-2 py-0.5 rounded-full ml-2">
                        {selectedWishlist.routes.length} {selectedWishlist.routes.length === 1 ? "route" : "routes"}
                      </span>
                    </div>

                    {/* Routes in wishlist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedWishlist.routes.map((routeId) => {
                        const route = routes.find((r) => r.id === routeId)
                        return (
                          route && (
                            <RouteCard
                              key={route.id}
                              route={route}
                              inWishlistView={true}
                              onHeartClick={(e) => handleRemoveRouteFromWishlist(route.id, e)}
                            />
                          )
                        )
                      })}
                    </div>

                    {/* Empty state if no routes */}
                    {selectedWishlist.routes.length === 0 && (
                      <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] p-8 text-center">
                        <p className="text-gray-400 mb-4">This wishlist is empty</p>
                        <Link
                          href="/"
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors inline-block"
                        >
                          Explore routes
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {/* Create new wishlist button - simple circle with plus icon */}
                    <div className="mb-6">
                      <button
                        onClick={() => setIsCreatingWishlist(true)}
                        className="w-10 h-10 rounded-full bg-[#0c0c0e] flex items-center justify-center hover:bg-[#18181c] transition-colors"
                        aria-label="Create new wishlist"
                      >
                        <Plus size={18} className="text-white" />
                      </button>
                    </div>

                    {/* Wishlists grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {/* Wishlist cards */}
                      {wishlists.map((wishlist) => (
                        <div
                          key={wishlist.id}
                          className="overflow-hidden flex flex-col cursor-pointer relative"
                          onClick={() => handleWishlistClick(wishlist)}
                        >
                          {/* Wishlist image */}
                          <div className="relative aspect-square rounded-lg overflow-hidden mb-2 group">
                            {getWishlistImagePath(wishlist) ? (
                              <Image
                                src={getWishlistImagePath(wishlist) || "/placeholder.svg"}
                                alt={wishlist.name}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                              />
                            ) : (
                              <div className="h-full w-full bg-[#121214] flex items-center justify-center">
                                <Heart size={40} className="text-[#27272f]" />
                              </div>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={(e) => handleDeleteWishlist(wishlist, e)}
                              className="absolute top-2 right-2 p-2 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/80"
                              aria-label="Delete wishlist"
                            >
                              <Trash2 size={16} className="text-white" />
                            </button>
                          </div>

                          {/* Wishlist info */}
                          <div>
                            <h3 className="font-medium text-base truncate whitespace-nowrap">{wishlist.name}</h3>
                            <p className="text-sm text-gray-400">Сохранено: {wishlist.routes.length}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "purchased" && (
          <>
            {/* Purchased routes */}
            {purchasedRoutes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedRoutes.map((route) => (
                  <RouteCard key={route.id} route={route} isPurchased={true} />
                ))}
              </div>
            ) : (
              <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] p-8 text-center">
                <p className="text-gray-400 mb-4">You haven't purchased any routes yet</p>
                <Link
                  href="/"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors inline-block"
                >
                  Explore routes
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === "completed" && (
          <>
            {/* Completed routes */}
            {completedRoutes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedRoutes.map((route) => (
                  <RouteCard key={route.id} route={route} isPurchased={true} />
                ))}
              </div>
            ) : (
              <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] p-8 text-center">
                <p className="text-gray-400 mb-4">You haven't completed any routes yet</p>
                {purchasedRoutes.length > 0 ? (
                  <button
                    onClick={() => setActiveTab("purchased")}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
                  >
                    View purchased routes
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors inline-block"
                  >
                    Explore routes
                  </Link>
                )}
              </div>
            )}
          </>
        )}
        {/* Wishlist Delete Confirmation Modal */}
        {isDeleteModalOpen && wishlistToDelete && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#121214] rounded-xl max-w-md w-full p-6 relative">
              <h2 className="text-xl font-medium mb-4">Delete Wishlist</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{wishlistToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setWishlistToDelete(null)
                  }}
                  className="px-4 py-2 rounded-lg border border-[#27272f] text-white hover:bg-[#27272f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteWishlist}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Route Remove Confirmation Modal */}
        {isRouteDeleteModalOpen && routeToDelete && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#121214] rounded-xl max-w-md w-full p-6 relative">
              <h2 className="text-xl font-medium mb-4">Delete Route</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{routes.find((r) => r.id === routeToDelete.routeId)?.name}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsRouteDeleteModalOpen(false)
                    setRouteToDelete(null)
                  }}
                  className="px-4 py-2 rounded-lg border border-[#27272f] text-white hover:bg-[#27272f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveRoute}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
