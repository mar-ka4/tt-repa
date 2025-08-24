"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { routes } from "@/data/routes"
import { Globe, ChevronDown, ArrowUpRight, ArrowDownRight, TrendingUp, Users, Award } from "lucide-react"
import UserMenu from "@/components/user-menu"
import FallbackImage from "@/components/fallback-image"

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userRoutes, setUserRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("7d") // 7d, 1m, 3m, 1y
  const [routeFilter, setRouteFilter] = useState("popularity") // popularity, newest, oldest
  const [typeFilter, setTypeFilter] = useState("all") // all, walking, car, guide, camper
  const [showRouteTypeDropdown, setShowRouteTypeDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Calculated data for analytics
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    subscriptionRevenue: 0,
    oneTimeRevenue: 0,
    totalUses: 0,
    subscriptionUses: 0,
    oneTimeUses: 0,
    routesByType: {
      walking: 0,
      car: 0,
      guide: 0,
      camper: 0,
    },
    revenueChange: 0,
    partnershipLevel: 0,
    // New data for the conversion block
    conversionRate: 68,
    conversionChange: 12,
    // Data for popular routes
    topRoutes: [] as any[],
    // Data for user growth
    userGrowth: [
      { month: "Jan", users: 12 },
      { month: "Feb", users: 18 },
      { month: "Mar", users: 15 },
      { month: "Apr", users: 22 },
      { month: "May", users: 28 },
      { month: "Jun", users: 35 },
    ],
  })

  useEffect(() => {
    // Get user data (assuming it's mar_ka4)
    const userData = getUserByNickname("mar_ka4")
    if (!userData) {
      router.push("/")
      return
    }

    setUser(userData)

    // Get user routes
    const userRoutesData = routes.filter((route) => route.author === userData.nickname)
    setUserRoutes(userRoutesData)

    // Calculate analytics data
    const totalRevenue = userRoutesData.reduce((sum, route) => sum + route.totalRevenue, 0)
    const subscriptionRevenue = userRoutesData.reduce((sum, route) => sum + route.subscriptionRevenue, 0)
    const oneTimeRevenue = userRoutesData.reduce((sum, route) => sum + route.oneTimeRevenue, 0)
    const totalUses = userRoutesData.reduce((sum, route) => sum + route.totalUses, 0)
    const subscriptionUses = userRoutesData.reduce((sum, route) => sum + route.subscriptionUses, 0)
    const oneTimeUses = userRoutesData.reduce((sum, route) => sum + route.oneTimeUses, 0)

    // Count routes by type
    const routesByType = {
      walking: userRoutesData.filter((route) => route.type === "пеший").length,
      car: userRoutesData.filter((route) => route.type === "авто").length,
      guide: userRoutesData.filter((route) => route.type === "поход").length,
      camper: userRoutesData.filter((route) => route.type === "автодом").length,
    }

    // Calculate partnership level (just for example - 60%)
    const partnershipLevel = 60

    // Calculate revenue change (just for example - +12%)
    const revenueChange = 12

    // Get top 3 routes by revenue
    const topRoutes = [...userRoutesData]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 4)
      .map((route) => ({
        name: route.name,
        revenue: route.totalRevenue,
        location: route.location,
        image: route.gallery[0],
        growth: Math.floor(Math.random() * 30), // Simulate growth in percent
      }))

    setAnalyticsData({
      totalRevenue,
      subscriptionRevenue,
      oneTimeRevenue,
      totalUses,
      subscriptionUses,
      oneTimeUses,
      routesByType,
      revenueChange,
      partnershipLevel,
      conversionRate: 68,
      conversionChange: 12,
      topRoutes,
      userGrowth: [
        { month: "Jan", users: 12 },
        { month: "Feb", users: 18 },
        { month: "Mar", users: 15 },
        { month: "Apr", users: 22 },
        { month: "May", users: 28 },
        { month: "Jun", users: 35 },
      ],
    })

    setLoading(false)
  }, [router])

  // Function to format numbers with thousand separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Function to format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Function to toggle the time filter
  const handleTimeFilterChange = (filter: string) => {
    setTimeFilter(filter)
  }

  // Function to toggle the route type filter
  const handleTypeFilterChange = (filter: string) => {
    setTypeFilter(filter)
    setShowRouteTypeDropdown(false)
  }

  // Function to toggle the sort filter
  const handleRouteFilterChange = (filter: string) => {
    setRouteFilter(filter)
    setShowSortDropdown(false)
  }

  // Function to get filtered routes
  const getFilteredRoutes = () => {
    let filtered = [...userRoutes]

    // Filter by type
    if (typeFilter !== "all") {
      const typeMap: { [key: string]: string } = {
        walking: "пеший",
        car: "авто",
        guide: "поход",
        camper: "автодом",
      }
      filtered = filtered.filter((route) => route.type === typeMap[typeFilter])
    }

    // Sort
    if (routeFilter === "popularity") {
      filtered.sort((a, b) => b.totalUses - a.totalUses)
    } else if (routeFilter === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (routeFilter === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }

    return filtered
  }

  // Find the maximum value for the user growth chart
  const maxUserGrowth = Math.max(...analyticsData.userGrowth.map((item) => item.users))

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
            <span className="text-white">Analytics</span>
          </div>
        </div>
        <h1 className="text-2xl font-medium mb-8">Analytics</h1>

        {/* Overall statistics */}
        <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
              <div>
                <h2 className="text-lg text-gray-300 mb-2">Total Revenue</h2>
                <div className="flex items-center">
                  <div className="text-3xl font-medium">${analyticsData.totalRevenue.toFixed(2)}</div>
                  <div className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500 flex items-center ml-2">
                    <ArrowUpRight size={12} className="mr-1" />
                    {Math.abs(analyticsData.revenueChange)}%
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Your sales {analyticsData.revenueChange > 0 ? "increased" : "decreased"} by{" "}
                  <span className={analyticsData.revenueChange > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(analyticsData.revenueChange)}%
                  </span>{" "}
                  over the last month
                </div>
              </div>

              {/* Time filters */}
              <div className="flex gap-2 flex-wrap">
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeFilter === "7d" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300"
                  }`}
                  onClick={() => handleTimeFilterChange("7d")}
                >
                  7 d
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeFilter === "1m" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300"
                  }`}
                  onClick={() => handleTimeFilterChange("1m")}
                >
                  1 m
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeFilter === "3m" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300"
                  }`}
                  onClick={() => handleTimeFilterChange("3m")}
                >
                  3 m
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeFilter === "1y" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300"
                  }`}
                  onClick={() => handleTimeFilterChange("1y")}
                >
                  1 y
                </button>
              </div>
            </div>

            {/* Revenue blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Subscription revenue */}
              <div className="bg-[#0c0c0e] rounded-lg py-3 px-4">
                <div className="text-sm text-gray-400 mb-2">Subscription Revenue</div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-medium">${analyticsData.subscriptionRevenue.toFixed(2)}</div>
                  <div className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500 flex items-center">
                    <ArrowUpRight size={12} className="mr-1" />
                    13%
                  </div>
                </div>
              </div>

              {/* Revenue from one-time purchases */}
              <div className="bg-[#0c0c0e] rounded-lg py-3 px-4">
                <div className="text-sm text-gray-400 mb-2">One-time Purchase Revenue</div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-medium">${analyticsData.oneTimeRevenue.toFixed(2)}</div>
                  <div className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-500 flex items-center">
                    <ArrowDownRight size={12} className="mr-1" />
                    8.7%
                  </div>
                </div>
              </div>

              {/* Total revenue */}
              <div className="bg-[#0c0c0e] rounded-lg py-3 px-4">
                <div className="text-sm text-gray-400 mb-2">Total Revenue</div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-medium">${analyticsData.totalRevenue.toFixed(2)}</div>
                  <div className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500 flex items-center">
                    <ArrowUpRight size={12} className="mr-1" />
                    9%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blocks with additional statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* NEW BLOCK: Conversion of views to purchases */}
          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-indigo-400" />
              <h2 className="text-lg text-gray-300">Conversion</h2>
            </div>

            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-medium text-indigo-400 mr-2">{analyticsData.conversionRate}%</span>
              <div className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500 flex items-center">
                <ArrowUpRight size={12} className="mr-1" />
                {analyticsData.conversionChange}%
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Percentage of route views that lead to a purchase or subscription
            </p>

            {/* Conversion progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                  style={{ width: `${analyticsData.conversionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Route Views</span>
                <span>1,245</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Purchases and Subscriptions</span>
                <span>846</span>
              </div>
            </div>
          </div>

          {/* Author's routes */}
          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden p-6">
            <h2 className="text-lg text-gray-300 mb-4">Author Routes</h2>

            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-medium text-indigo-400 mr-2">{userRoutes.length}</span>
              <span className="text-gray-400">Total Routes</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Walking Routes</span>
                <span className="font-medium">{analyticsData.routesByType.walking}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Car Routes</span>
                <span className="font-medium">{analyticsData.routesByType.car}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Guides</span>
                <span className="font-medium">{analyticsData.routesByType.guide}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Camper Routes</span>
                <span className="font-medium">{analyticsData.routesByType.camper}</span>
              </div>
            </div>
          </div>

          {/* Partnership level */}
          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden p-6">
            <h2 className="text-lg text-gray-300 mb-4">Partnership Level</h2>

            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-medium text-indigo-400 mr-2">{analyticsData.partnershipLevel}%</span>
              <span className="text-gray-400">Current Level</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
                  <span className="text-sm">Increased Revenue Share</span>
                </div>

                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
                  <span className="text-sm">Priority Support</span>
                </div>

                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
                  <span className="text-sm">Route Promotion</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                  style={{ width: `${analyticsData.partnershipLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional analytics blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top routes */}
          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award size={20} className="text-indigo-400" />
              <h2 className="text-lg text-gray-300">Top Routes</h2>
            </div>

            <div className="space-y-4">
              {analyticsData.topRoutes.map((route, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <FallbackImage
                      src={`/${route.image}`}
                      alt={route.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-sm line-clamp-1">{route.name}</div>
                    <div className="text-xs text-gray-400">{route.location}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-medium">${route.revenue.toFixed(2)}</div>
                    <div className="text-xs text-green-500 flex items-center">
                      <ArrowUpRight size={10} className="mr-0.5" />
                      {route.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User growth */}
          <div className="bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users size={20} className="text-indigo-400" />
              <h2 className="text-lg text-gray-300">User Growth</h2>
            </div>

            {/* User growth chart - minimalist */}
            <div className="h-36 relative mb-8">
              {/* Chart line */}
              <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 600 150">
                <path
                  d="M0,120 L100,100 L200,110 L300,80 L400,60 L500,40"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Points on the chart */}
                <circle cx="0" cy="120" r="4" fill="#4f46e5" />
                <circle cx="100" cy="100" r="4" fill="#4f46e5" />
                <circle cx="200" cy="110" r="4" fill="#4f46e5" />
                <circle cx="300" cy="80" r="4" fill="#4f46e5" />
                <circle cx="400" cy="60" r="4" fill="#4f46e5" />
                <circle cx="500" cy="40" r="4" fill="#4f46e5" />
              </svg>
            </div>

            {/* Months */}
            <div className="flex justify-between mb-6">
              {analyticsData.userGrowth.map((item, index) => (
                <div key={index} className="text-xs text-gray-400">
                  {item.month}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <div>
                <div className="text-sm text-gray-400">Total Users</div>
                <div className="text-xl font-medium">1,245</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Monthly Growth</div>
                <div className="text-xl font-medium text-green-500">+25%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Route analytics */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            <h2 className="text-xl font-medium">Your Routes Analytics</h2>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Sort by filter */}
              <div className="relative">
                <button
                  className="w-full sm:w-auto px-4 py-2 bg-[#18181c] border border-[#27272f] rounded-md text-sm flex items-center justify-between gap-2"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <span className="truncate">
                    {routeFilter === "popularity"
                      ? "By Popularity"
                      : routeFilter === "newest"
                        ? "Newest First"
                        : "Oldest First"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform flex-shrink-0 ${showSortDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-[#18181c] border border-[#27272f] rounded-md shadow-lg z-10">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                      onClick={() => handleRouteFilterChange("popularity")}
                    >
                      By Popularity
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                      onClick={() => handleRouteFilterChange("newest")}
                    >
                      Newest First
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                      onClick={() => handleRouteFilterChange("oldest")}
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>

              {/* Filter by route type */}
              <div className="relative">
                <button
                  className="w-full sm:w-auto px-4 py-2 bg-[#18181c] border border-[#27272f] rounded-md text-sm flex items-center justify-between gap-2"
                  onClick={() => setShowRouteTypeDropdown(!showRouteTypeDropdown)}
                >
                  <span className="truncate">
                    {typeFilter === "all"
                      ? "All Types"
                      : typeFilter === "walking"
                        ? "Walking"
                        : typeFilter === "car"
                          ? "Car"
                          : typeFilter === "guide"
                            ? "Guides"
                            : "Camper"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform flex-shrink-0 ${showRouteTypeDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showRouteTypeDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-[#18181c] border border-[#27272f] rounded-md shadow-lg z-10">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                      onClick={() => handleTypeFilterChange("all")}
                    >
                      All Types
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                      onClick={() => handleTypeFilterChange("walking")}
                    >
                      Walking
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                      onClick={() => handleTypeFilterChange("car")}
                    >
                      Car
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                      onClick={() => handleTypeFilterChange("guide")}
                    >
                      Guides
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#27272f] transition-colors"
                      onClick={() => handleTypeFilterChange("camper")}
                    >
                      Camper
                    </button>
                  </div>
                )}
              </div>

              {/* "3 routes" button */}
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-500 rounded-md text-sm">
                {getFilteredRoutes().length} routes
              </button>
            </div>
          </div>

          {/* Route list */}
          <div className="space-y-4">
            {getFilteredRoutes().map((route, index) => (
              <div key={index} className="bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden">
                <div className="p-2 flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Route image */}
                  <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <FallbackImage
                      src={`/${route.gallery[0]}`}
                      alt={route.name}
                      width={128}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Route information */}
                  <div className="flex-grow">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div>
                        <h3 className="font-medium mb-1">{route.name}</h3>
                        <p className="text-sm text-gray-400">{route.location}</p>
                      </div>

                      {/* Time filters for the route */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className={`px-2 py-0.5 rounded-md text-xs ${
                            timeFilter === "7d" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300"
                          }`}
                        >
                          7 d
                        </button>
                        <button
                          className={`px-2 py-0.5 rounded-md text-xs ${
                            timeFilter === "1m" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300"
                          }`}
                        >
                          1 m
                        </button>
                        <button
                          className={`px-2 py-0.5 rounded-md text-xs ${
                            timeFilter === "3m" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300"
                          }`}
                        >
                          3 m
                        </button>
                        <button
                          className={`px-2 py-0.5 rounded-md text-xs ${
                            timeFilter === "1y" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300"
                          }`}
                        >
                          1 y
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Total uses */}
                      <div className="border border-[#1a1a1a] rounded-md px-3 py-2 bg-[#0c0c0e]">
                        <div className="text-xs text-gray-400 mb-1">Total Uses</div>
                        <div className="flex items-center justify-between">
                          <div className="text-base font-medium">{route.totalUses}</div>
                          <div className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500 flex items-center">
                            <ArrowUpRight size={10} className="mr-0.5" />
                            8%
                          </div>
                        </div>
                      </div>

                      {/* One-time purchases */}
                      <div className="border border-[#1a1a1a] rounded-md px-3 py-2 bg-[#0c0c0e]">
                        <div className="text-xs text-gray-400 mb-1">One-time Purchases</div>
                        <div className="flex items-center justify-between">
                          <div className="text-base font-medium">${route.oneTimeRevenue.toFixed(2)}</div>
                          <div className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500 flex items-center">
                            <ArrowUpRight size={10} className="mr-0.5" />
                            12%
                          </div>
                        </div>
                      </div>

                      {/* By subscription */}
                      <div className="border border-[#1a1a1a] rounded-md px-3 py-2 bg-[#0c0c0e]">
                        <div className="text-xs text-gray-400 mb-1">By Subscription</div>
                        <div className="flex items-center justify-between">
                          <div className="text-base font-medium">${route.subscriptionRevenue.toFixed(2)}</div>
                          {route.index % 2 === 0 ? (
                            <div className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500 flex items-center">
                              <ArrowUpRight size={10} className="mr-0.5" />
                              15%
                            </div>
                          ) : (
                            <div className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-500 flex items-center">
                              <ArrowDownRight size={10} className="mr-0.5" />
                              7%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
