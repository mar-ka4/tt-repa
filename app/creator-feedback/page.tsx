"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import {
  Globe,
  MessageSquare,
  Search,
  Star,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react"
import UserMenu from "@/components/user-menu"

// Mock data for feedback
const mockFeedback = [
  {
    id: 1,
    routeName: "Berlin Street Art Tour",
    routeId: "berlin-street-art",
    userName: "Alex Johnson",
    userAvatar: "/diverse-avatars.png",
    rating: 5,
    date: "2025-05-01",
    comment:
      "Absolutely loved this route! The street art was incredible and the descriptions were so detailed. I discovered places I would have never found on my own.",
    status: "unresponded",
    helpful: 12,
    unhelpful: 1,
  },
  {
    id: 2,
    routeName: "Tokyo Hidden Gems",
    routeId: "tokyo-hidden-gems",
    userName: "Maria Chen",
    userAvatar: "/diverse-avatars.png",
    rating: 4,
    date: "2025-04-28",
    comment:
      "Great route overall! The food recommendations were spot on. I would have appreciated more details about transportation between locations though.",
    status: "responded",
    response:
      "Thank you for your feedback, Maria! I'm glad you enjoyed the food spots. I'll update the route with more transportation details soon.",
    responseDate: "2025-04-29",
    helpful: 8,
    unhelpful: 0,
  },
  {
    id: 3,
    routeName: "London Historical Walk",
    routeId: "london-historical",
    userName: "James Wilson",
    userAvatar: "/diverse-avatars.png",
    rating: 3,
    date: "2025-04-25",
    comment:
      "The historical information was interesting, but the route took much longer than the estimated time. Some landmarks were also very crowded.",
    status: "unresponded",
    helpful: 5,
    unhelpful: 2,
  },
  {
    id: 4,
    routeName: "Iceland Waterfall Journey",
    routeId: "iceland-waterfalls",
    userName: "Emma Peterson",
    userAvatar: "/diverse-avatars.png",
    rating: 5,
    date: "2025-04-22",
    comment:
      "This route exceeded all my expectations! The waterfalls were breathtaking and the secret spots were truly hidden gems. The photo opportunities were incredible!",
    status: "responded",
    response: "Thanks Emma! So happy you enjoyed the waterfalls. Hope you got some amazing photos!",
    responseDate: "2025-04-23",
    helpful: 15,
    unhelpful: 0,
  },
  {
    id: 5,
    routeName: "Venice Canals Explorer",
    routeId: "venice-canals",
    userName: "Marco Rossi",
    userAvatar: "/diverse-avatars.png",
    rating: 2,
    date: "2025-04-20",
    comment:
      "The route didn't avoid the tourist traps as promised. Most locations were extremely crowded and overpriced. The map was also confusing to follow.",
    status: "unresponded",
    helpful: 3,
    unhelpful: 1,
  },
  {
    id: 6,
    routeName: "Berlin Street Art Tour",
    routeId: "berlin-street-art",
    userName: "Sophie Miller",
    userAvatar: "/diverse-avatars.png",
    rating: 4,
    date: "2025-04-18",
    comment:
      "Really enjoyed the street art selections! Some pieces had been painted over, but that's the nature of street art. The historical context added a lot of value.",
    status: "responded",
    response:
      "Thanks for understanding about the changing nature of street art, Sophie! I try to update the route monthly, but some changes happen quickly. Glad you enjoyed the historical context!",
    responseDate: "2025-04-19",
    helpful: 7,
    unhelpful: 0,
  },
  {
    id: 7,
    routeName: "Tokyo Hidden Gems",
    routeId: "tokyo-hidden-gems",
    userName: "David Kim",
    userAvatar: "/diverse-avatars.png",
    rating: 5,
    date: "2025-04-15",
    comment:
      "Best city guide I've ever used! The local insights were invaluable and every recommendation was perfect. The route flow made logical sense too.",
    status: "responded",
    response: "Thank you so much, David! I'm thrilled you had such a great experience with my route!",
    responseDate: "2025-04-16",
    helpful: 18,
    unhelpful: 0,
  },
]

export default function CreatorFeedbackPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSort, setSelectedSort] = useState("newest")
  const [feedback, setFeedback] = useState(mockFeedback)
  const [responseText, setResponseText] = useState<{ [key: number]: string }>({})
  const [expandedFeedback, setExpandedFeedback] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const details = getUserByNickname(user.nickname)
      if (details) {
        setUserDetails(details)

        // If user is not verified for routes, redirect to become creator
        if (!details.isVerifiedForRoutes && !details.hasSubmittedVerificationForm) {
          router.push("/become-creator")
          return
        }
      }
    }

    setLoading(false)
  }, [isAuthenticated, user, router])

  useEffect(() => {
    // Filter and sort feedback based on selected options
    let filteredFeedback = [...mockFeedback]

    // Filter by search query
    if (searchQuery) {
      filteredFeedback = filteredFeedback.filter(
        (item) =>
          item.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.comment.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by rating
    if (selectedRating !== "all") {
      filteredFeedback = filteredFeedback.filter((item) => item.rating === Number.parseInt(selectedRating))
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filteredFeedback = filteredFeedback.filter((item) => item.status === selectedStatus)
    }

    // Sort feedback
    if (selectedSort === "newest") {
      filteredFeedback.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (selectedSort === "oldest") {
      filteredFeedback.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (selectedSort === "highest") {
      filteredFeedback.sort((a, b) => b.rating - a.rating)
    } else if (selectedSort === "lowest") {
      filteredFeedback.sort((a, b) => a.rating - b.rating)
    } else if (selectedSort === "most-helpful") {
      filteredFeedback.sort((a, b) => b.helpful - a.helpful)
    }

    setFeedback(filteredFeedback)
  }, [searchQuery, selectedRating, selectedStatus, selectedSort])

  const handleRespond = (id: number) => {
    if (!responseText[id] || responseText[id].trim() === "") return

    // In a real app, this would be an API call
    const updatedFeedback = feedback.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: "responded",
          response: responseText[id],
          responseDate: new Date().toISOString().split("T")[0],
        }
      }
      return item
    })

    setFeedback(updatedFeedback)
    setResponseText({ ...responseText, [id]: "" })
  }

  const toggleExpandFeedback = (id: number) => {
    if (expandedFeedback === id) {
      setExpandedFeedback(null)
    } else {
      setExpandedFeedback(id)
    }
  }

  // Calculate feedback statistics
  const totalFeedback = mockFeedback.length
  const averageRating = mockFeedback.reduce((sum, item) => sum + item.rating, 0) / (totalFeedback || 1)
  const respondedCount = mockFeedback.filter((item) => item.status === "responded").length
  const unrespondedCount = totalFeedback - respondedCount
  const responseRate = Math.round((respondedCount / totalFeedback) * 100) || 0

  // Rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0] // 1-5 stars
  mockFeedback.forEach((item) => {
    ratingDistribution[item.rating - 1]++
  })

  // Calculate max value for scaling the bars
  const maxRatingCount = Math.max(...ratingDistribution)

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
            <span className="text-white">Feedback</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-medium">Traveler Feedback</h1>
          <p className="text-gray-400 mt-2">View and respond to feedback from travelers who have used your routes</p>
        </div>

        {/* Feedback Overview */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Average Rating */}
            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-sm">Average Rating</h3>
                <Star size={18} className="text-yellow-400" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">/ 5</span>
              </div>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-600"}
                    fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                  />
                ))}
                <span className="text-gray-400 text-xs ml-2">({totalFeedback} reviews)</span>
              </div>
            </div>

            {/* Total Feedback */}
            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-sm">Total Feedback</h3>
                <MessageSquare size={18} className="text-indigo-400" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-medium">{totalFeedback}</span>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <TrendingUp size={14} className="text-green-500 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>

            {/* Response Rate */}
            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-sm">Response Rate</h3>
                <CheckCircle size={18} className="text-green-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-medium">{responseRate}%</span>
              </div>
              <div className="w-full h-2 bg-[#18181c] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${responseRate}%` }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>{respondedCount} responded</span>
                <span>{unrespondedCount} pending</span>
              </div>
            </div>

            {/* Average Response Time */}
            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-sm">Avg. Response Time</h3>
                <Clock size={18} className="text-indigo-400" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-medium">1.2</span>
                <span className="text-gray-400 ml-1">days</span>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <TrendingDown size={14} className="text-green-500 mr-1" />
                <span>-0.3 days from last month</span>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <h3 className="text-lg font-medium mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="mr-1">{rating}</span>
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                  </div>
                  <div className="flex-1 h-6 bg-[#18181c] rounded-full overflow-hidden mx-3">
                    <div
                      className={`h-full rounded-full ${
                        rating >= 4 ? "bg-green-500" : rating === 3 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${maxRatingCount ? (ratingDistribution[rating - 1] / maxRatingCount) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <span>
                      {ratingDistribution[rating - 1]} (
                      {totalFeedback ? Math.round((ratingDistribution[rating - 1] / totalFeedback) * 100) : 0}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feedback Management */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-medium">Feedback Management</h2>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  selectedFilter === "all"
                    ? "bg-indigo-500 text-white"
                    : "bg-[#18181c] text-gray-300 hover:bg-[#222226]"
                }`}
              >
                All Feedback
              </button>
              <button
                onClick={() => setSelectedStatus("unresponded")}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  selectedStatus === "unresponded"
                    ? "bg-indigo-500 text-white"
                    : "bg-[#18181c] text-gray-300 hover:bg-[#222226]"
                }`}
              >
                Needs Response
              </button>
              <button
                onClick={() => {
                  setSelectedRating("5")
                  setSelectedStatus("all")
                }}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  selectedRating === "5" && selectedStatus === "all"
                    ? "bg-indigo-500 text-white"
                    : "bg-[#18181c] text-gray-300 hover:bg-[#222226]"
                }`}
              >
                5 Star Reviews
              </button>
              <button
                onClick={() => {
                  setSelectedRating("1")
                  setSelectedRating("2")
                  setSelectedStatus("all")
                }}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  (selectedRating === "1" || selectedRating === "2") && selectedStatus === "all"
                    ? "bg-indigo-500 text-white"
                    : "bg-[#18181c] text-gray-300 hover:bg-[#222226]"
                }`}
              >
                Critical Reviews
              </button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by route, user, or keyword..."
                className="w-full py-3 pl-12 pr-4 bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              {/* Rating Filter */}
              <div className="relative">
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="appearance-none bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg py-3 pl-4 pr-10 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg py-3 pl-4 pr-10 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="responded">Responded</option>
                  <option value="unresponded">Unresponded</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg py-3 pl-4 pr-10 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                  <option value="most-helpful">Most Helpful</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-6">
            {feedback.length > 0 ? (
              feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 transition-all duration-200"
                >
                  {/* Feedback Header */}
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      {/* User Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={item.userAvatar || "/placeholder.svg"}
                          alt={item.userName}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* User and Route Info */}
                      <div>
                        <h3 className="font-medium">{item.userName}</h3>
                        <Link href={`/route/${item.routeId}`} className="text-sm text-indigo-400 hover:text-indigo-300">
                          {item.routeName}
                        </Link>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= item.rating ? "text-yellow-400" : "text-gray-600"}
                              fill={star <= item.rating ? "currentColor" : "none"}
                            />
                          ))}
                          <span className="text-gray-400 text-xs ml-2">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center">
                      {item.status === "unresponded" ? (
                        <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          Needs Response
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center">
                          <CheckCircle size={12} className="mr-1" />
                          Responded
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback Content */}
                  <div className="mb-4">
                    <p className="text-gray-300">{item.comment}</p>
                    <div className="flex items-center mt-3 text-sm">
                      <button className="flex items-center text-gray-400 hover:text-gray-300 mr-4">
                        <ThumbsUp size={14} className="mr-1" />
                        <span>{item.helpful}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-gray-300">
                        <ThumbsDown size={14} className="mr-1" />
                        <span>{item.unhelpful}</span>
                      </button>
                    </div>
                  </div>

                  {/* Response Section */}
                  {item.status === "responded" && (
                    <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src="/avatar.png"
                            alt="Your Avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-sm">Your Response</h4>
                            <span className="text-gray-400 text-xs ml-2">
                              {new Date(item.responseDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-gray-300 mt-1">{item.response}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Response Input for unresponded feedback */}
                  {item.status === "unresponded" && (
                    <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src="/avatar.png"
                            alt="Your Avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <textarea
                              placeholder="Write your response..."
                              className="w-full py-3 px-4 bg-[#18181c] border border-[#2a2a2a] rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-white min-h-[100px] resize-none"
                              value={responseText[item.id] || ""}
                              onChange={(e) => setResponseText({ ...responseText, [item.id]: e.target.value })}
                            ></textarea>
                            <button
                              className="absolute bottom-3 right-3 p-2 bg-indigo-500 hover:bg-indigo-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleRespond(item.id)}
                              disabled={!responseText[item.id] || responseText[item.id].trim() === ""}
                            >
                              <Send size={16} />
                            </button>
                          </div>
                          <div className="flex justify-between mt-2">
                            <button
                              className="text-sm text-indigo-400 hover:text-indigo-300"
                              onClick={() =>
                                setResponseText({
                                  ...responseText,
                                  [item.id]:
                                    "Thank you for your feedback! We appreciate you taking the time to share your experience.",
                                })
                              }
                            >
                              Use template response
                            </button>
                            <span className="text-xs text-gray-500">{responseText[item.id]?.length || 0}/500</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-8 text-center">
                <HelpCircle size={40} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No feedback found</h3>
                <p className="text-gray-400 mb-4">We couldn't find any feedback matching your current filters.</p>
                <button
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedRating("all")
                    setSelectedStatus("all")
                    setSelectedSort("newest")
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Feedback Tips */}
        <section className="mt-12">
          <h2 className="text-xl font-medium mb-6">Tips for Handling Feedback</h2>
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border border-purple-500/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0c0c0e] rounded-xl p-5">
                <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-3">
                  <Clock size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-medium mb-2">Respond Promptly</h3>
                <p className="text-sm text-gray-400">
                  Aim to respond to all feedback within 24-48 hours. Quick responses show that you value traveler
                  opinions.
                </p>
              </div>

              <div className="bg-[#0c0c0e] rounded-xl p-5">
                <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-3">
                  <ThumbsUp size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-medium mb-2">Be Appreciative</h3>
                <p className="text-sm text-gray-400">
                  Always thank travelers for their feedback, even if it's critical. Appreciation shows professionalism.
                </p>
              </div>

              <div className="bg-[#0c0c0e] rounded-xl p-5">
                <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-3">
                  <MessageSquare size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-medium mb-2">Address Concerns</h3>
                <p className="text-sm text-gray-400">
                  For critical feedback, address specific concerns and explain how you'll improve the route based on
                  their input.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-purple-500/20">
              <Link
                href="/creator-resources/feedback-management"
                className="text-purple-400 hover:text-purple-300 flex items-center"
              >
                Learn more about effective feedback management <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
