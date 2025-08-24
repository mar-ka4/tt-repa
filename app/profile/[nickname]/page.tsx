"use client"

import { useRef } from "react"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { getUserByNickname, checkBanExpiration } from "@/data/users"
import { routes } from "@/data/routes"
import {
  Globe,
  ChevronLeft,
  ChevronRight,
  Edit,
  Save,
  X,
  Camera,
  Upload,
  MapPin,
  Star,
  Ban,
  Shield,
  Share2,
  Copy,
  Check,
} from "lucide-react"
import UserMenu from "@/components/user-menu"
import RouteCard from "@/components/route-card"
import { useAuth } from "@/context/auth-context"
import ModerationModal from "@/components/moderation-modal"
import AchievementBadge from "@/components/achievement-badge"
import AchievementsModal from "@/components/achievement-card-modal"
import { allAchievements } from "@/data/achievements" // Import allAchievements
import { useMobile } from "@/hooks/use-mobile" // Import useMobile hook
import type { Achievement as DataAchievement } from "@/data/achievements" // Import the Achievement type from data/achievements.ts
import type { UserAchievementProgress } from "@/data/users" // Import UserAchievementProgress from data/users.ts
import ProfileSetupModal from "@/components/profile-setup-modal"

// Define a local Achievement interface that combines data from allAchievements and user progress
interface UserDisplayAchievement extends DataAchievement {
  // Overwrite the 'unlocked' property to represent completion for display purposes
  // and ensure currentProgress and progressGoal are numbers for calculations
  currentProgress: number
  progressGoal: number
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const nickname = params.nickname as string
  const [user, setUser] = useState<any>(null)
  const [userRoutes, setUserRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [showAllRoutesModal, setShowAllRoutesModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)
  const [showModerationModal, setShowModerationModal] = useState(false)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [showProfileSetupModal, setShowProfileSetupModal] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)

  // Get the current logged-in user
  const { user: currentUser } = useAuth()
  const { isMobile } = useMobile() // Use the useMobile hook

  // Form state for profile editing
  const [formData, setFormData] = useState({
    nickname: "",
    description: "",
    location: "",
    avatar: "",
    coverImage: "",
    visitedCountries: 0,
    userStatus: "",
    categories: ["travel", "photography"],
    languages: ["english", "spanish"],
    socialLinks: {
      instagram: { connected: false, username: "" },
      twitter: { connected: false, username: "" },
      tiktok: { connected: false, username: "" },
    },
  })

  // New states for filters within the "All Routes" modal
  const [allRoutesSearchQuery, setAllRoutesSearchQuery] = useState("")
  const [allRoutesTypeFilter, setAllRoutesTypeFilter] = useState("all")
  const [allRoutesDifficultyFilter, setAllRoutesDifficultyFilter] = useState("all")
  const [filteredAllRoutes, setFilteredAllRoutes] = useState<any[]>([])

  // States for dropdowns within the "All Routes" modal
  const [showAllRoutesTypeDropdown, setShowAllRoutesTypeDropdown] = useState(false)
  const [showAllRoutesDifficultyDropdown, setShowAllRoutesDifficultyDropdown] = useState(false)

  // Define achievements data (20 achievements for the modal)
  const [userSpecificAchievements, setUserSpecificAchievements] = useState<UserDisplayAchievement[]>([])
  // New state for achievements displayed on the profile page
  const [profileDisplayAchievements, setProfileDisplayAchievements] = useState<UserDisplayAchievement[]>([])

  // Check if profile needs initial setup
  const needsProfileSetup = () => {
    if (!user || !currentUser || user.nickname !== currentUser.nickname) return false

    // Check if essential profile fields are missing
    const hasBasicInfo = user.description && user.userStatus && user.avatar
    const hasCategories = user.categories && user.categories.length > 0

    return !hasBasicInfo || !hasCategories
  }

  // Handle profile setup save
  const handleProfileSetupSave = (data: any) => {
    // In a real app, you would save this data to a database
    setUser({
      ...user,
      nickname: data.nickname,
      description: data.description,
      userStatus: data.userStatus,
      categories: data.categories,
      languages: data.languages,
      avatar: data.avatar,
    })

    // Update form data as well
    setFormData({
      ...formData,
      nickname: data.nickname,
      description: data.description,
      userStatus: data.userStatus,
      categories: data.categories,
      languages: data.languages,
      avatar: data.avatar,
    })
  }

  useEffect(() => {
    // Check ban expiration first
    if (nickname) {
      checkBanExpiration(nickname)
    }

    // Get user data
    const userData = getUserByNickname(nickname)
    if (!userData) {
      router.push("/")
      return
    }

    setUser(userData)

    // Initialize form data with user details
    setFormData({
      nickname: userData.nickname || "",
      description: userData.description || "",
      location: userData.location || "",
      avatar: userData.avatar || "",
      coverImage: userData.coverImage || "",
      visitedCountries: userData.visitedCountries || 0,
      userStatus: userData.userStatus || "",
      categories: userData.categories || ["travel", "photography"],
      languages: userData.languages || ["english", "spanish"],
      socialLinks: {
        instagram: userData.connectedAccounts?.instagram || { connected: false, username: "" },
        twitter: userData.connectedAccounts?.twitter || { connected: false, username: "" },
        tiktok: userData.connectedAccounts?.tiktok || { connected: false, username: "" },
      },
    })

    // Map allAchievements to user-specific achievements with progress
    const mappedAchievements: UserDisplayAchievement[] = allAchievements.map((ach) => {
      const userProgress = userData.userAchievements?.find((ua: UserAchievementProgress) => ua.id === ach.id)

      const currentProgress = userProgress?.currentProgress || 0
      const totalProgress = userProgress?.totalProgress || ach.progressGoal

      // The 'unlocked' property here indicates if the user has fully completed this achievement
      const isUserFullyCompleted = currentProgress >= totalProgress && totalProgress > 0

      return {
        ...ach,
        currentProgress: currentProgress,
        progressGoal: totalProgress,
        unlocked: isUserFullyCompleted, // This 'unlocked' determines if the badge is fully completed
      }
    })
    setUserSpecificAchievements(mappedAchievements)

    // Logic for achievements displayed on the profile page
    const completedAchievements = mappedAchievements.filter((ach) => ach.unlocked)
    const inProgressOrLockedAchievements = mappedAchievements.filter((ach) => !ach.unlocked)

    const displayAchievements: UserDisplayAchievement[] = []
    displayAchievements.push(...completedAchievements)

    const remainingSlots = 7 - displayAchievements.length
    if (remainingSlots > 0) {
      displayAchievements.push(...inProgressOrLockedAchievements.slice(0, remainingSlots))
    }
    setProfileDisplayAchievements(displayAchievements)

    // Get user routes
    const userRoutesData = routes.filter((route) => route.author === nickname)
    setUserRoutes(userRoutesData)
    setFilteredAllRoutes(userRoutesData) // Initialize filtered routes for the modal
    setLoading(false)

    // Always show profile setup modal for testing
    setShowProfileSetupModal(true)
  }, [nickname, router])

  // Effect to filter routes for the "All Routes" modal whenever filters or userRoutes change
  useEffect(() => {
    if (!userRoutes.length) {
      setFilteredAllRoutes([])
      return
    }

    let filtered = [...userRoutes]

    // Filter by search query
    if (allRoutesSearchQuery) {
      filtered = filtered.filter(
        (route) =>
          route.name.toLowerCase().includes(allRoutesSearchQuery.toLowerCase()) ||
          route.location.toLowerCase().includes(allRoutesSearchQuery.toLowerCase()),
      )
    }

    // Filter by type
    if (allRoutesTypeFilter !== "all") {
      filtered = filtered.filter((route) => route.type === allRoutesTypeFilter)
    }

    // Filter by difficulty
    if (allRoutesDifficultyFilter !== "all") {
      filtered = filtered.filter((route) => route.difficulty === allRoutesDifficultyFilter)
    }

    setFilteredAllRoutes(filtered)
  }, [userRoutes, allRoutesSearchQuery, allRoutesTypeFilter, allRoutesDifficultyFilter])

  // Function to go to next slide
  const nextSlide = () => {
    if (userRoutes.length <= 4) return // If there are 4 or fewer routes, no carousel needed
    const maxStartIndex = userRoutes.length - 4 // Maximum start index (to show the last 4 routes)
    setCurrentSlide((prev) => (prev >= maxStartIndex ? 0 : prev + 1))
  }

  // Function to go to previous slide
  const prevSlide = () => {
    if (userRoutes.length <= 4) return // If there are 4 or fewer routes, no carousel needed
    const maxStartIndex = userRoutes.length - 4 // Maximum start index
    setCurrentSlide((prev) => (prev === 0 ? maxStartIndex : prev - 1))
  }

  // Get only connected accounts
  const getConnectedAccounts = () => {
    if (!user) return []
    const accounts = []

    if (user.connectedAccounts.instagram.connected) {
      accounts.push({
        type: "instagram",
        username: user.connectedAccounts.instagram.username,
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#E1306C]"
          >
            <path
              d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"
              fill="currentColor"
            />
          </svg>
        ),
      })
    }

    if (user.connectedAccounts.tiktok.connected) {
      accounts.push({
        type: "tiktok",
        username: user.connectedAccounts.tiktok.username,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.6 5.82C15.9165 5.03962 15.5397 4.03743 15.54 3H12.45V16.5C12.4494 17.0269 12.2879 17.5409 11.9842 17.9718C11.6806 18.4027 11.2514 18.7305 10.7522 18.9109C10.253 19.0913 9.70961 19.1154 9.19709 18.9795C8.68458 18.8435 8.22797 18.5538 7.89 18.15C7.46222 17.6303 7.24643 16.9775 7.28872 16.3126C7.33101 15.6478 7.62833 15.0249 8.12 14.57C8.62162 14.1066 9.27447 13.8462 9.95 13.84V10.74C8.78173 10.7546 7.64437 11.1296 6.69923 11.8118C5.75409 12.494 5.04947 13.4516 4.68 14.5489C4.31053 15.6461 4.29558 16.8312 4.63723 17.9375C4.97888 19.0438 5.66093 20.0214 6.59 20.73C7.58901 21.4903 8.80435 21.9111 10.06 21.93C11.3156 21.9489 12.5365 21.5292 13.5179 20.7406C14.4993 19.9519 15.1801 18.8431 15.45 17.61C15.4891 17.4009 15.51 17.1899 15.51 16.98V9.15C16.2854 9.75898 17.1851 10.1928 18.14 10.42V7.32C17.5783 7.29533 17.0297 7.14078 16.5347 6.86719C16.0397 6.59359 15.6109 6.2078 15.28 5.74L16.6 5.82Z"
              fill="currentColor"
            />
          </svg>
        ),
      })
    }

    if (user.connectedAccounts.twitter.connected) {
      accounts.push({
        type: "twitter",
        username: user.connectedAccounts.twitter.username,
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#1DA1F2]"
          >
            <path
              d="M22 5.79997C21.2483 6.12606 20.4534 6.34163 19.64 6.43997C20.4982 5.92729 21.1413 5.12075 21.45 4.16997C20.6436 4.65003 19.7608 4.98826 18.84 5.16997C18.2245 4.50254 17.405 4.05826 16.5098 3.90682C15.6147 3.75537 14.6945 3.90532 13.8938 4.33315C13.093 4.76099 12.4569 5.4425 12.0852 6.2708C11.7135 7.09911 11.6273 8.02736 11.84 8.90997C10.2094 8.82749 8.61444 8.40292 7.15865 7.66383C5.70287 6.92474 4.41885 5.88766 3.39 4.61997C3.02914 5.25013 2.83952 5.96379 2.84 6.68997C2.83872 7.36435 3.00422 8.02858 3.32176 8.62353C3.63929 9.21848 4.09902 9.72568 4.66 10.1C4.00798 10.082 3.36989 9.90726 2.8 9.58997V9.63997C2.80489 10.5849 3.13599 11.4991 3.73731 12.2279C4.33864 12.9568 5.17326 13.4556 6.1 13.64C5.74326 13.7485 5.37288 13.8058 5 13.81C4.74189 13.807 4.48442 13.7835 4.23 13.74C4.49391 14.5528 5.00462 15.2631 5.69133 15.7721C6.37803 16.2811 7.20878 16.5635 8.06 16.58C6.6172 17.7152 4.83588 18.3348 3 18.34C2.66574 18.3411 2.33174 18.321 2 18.28C3.87443 19.4902 6.05881 20.1327 8.29 20.13C9.82969 20.146 11.3571 19.855 12.7831 19.274C14.2091 18.6931 15.505 17.8338 16.5952 16.7465C17.6854 15.6591 18.548 14.3654 19.1326 12.9409C19.7172 11.5164 20.012 9.98969 20 8.44997C20 8.27996 20 8.09997 20 7.91997C20.7847 7.33478 21.4615 6.61739 22 5.79997Z"
              fill="currentColor"
            />
          </svg>
        ),
      })
    }

    return accounts
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSocialInputChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: {
          connected: value.length > 0,
          username: value,
        },
      },
    })
  }

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleCoverImageClick = () => {
    coverFileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "coverImage") => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        [type]: imageUrl,
      })
    }
  }

  const handleSaveChanges = () => {
    // In a real app, you would save the changes to a database
    setUser({
      ...user,
      nickname: formData.nickname,
      description: formData.description,
      location: formData.location,
      avatar: formData.avatar,
      coverImage: formData.coverImage,
      visitedCountries: formData.visitedCountries,
      userStatus: formData.userStatus,
      categories: formData.categories,
      languages: formData.languages,
      connectedAccounts: formData.socialLinks,
    })
    setIsEditing(false)
  }

  const handleCancelChanges = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        nickname: user.nickname || "",
        description: user.description || "",
        location: user.location || "",
        avatar: user.avatar || "",
        coverImage: user.coverImage || "",
        visitedCountries: user.visitedCountries || 0,
        userStatus: user.userStatus || "",
        categories: user.categories || ["travel", "photography"],
        languages: user.languages || ["english", "spanish"],
        socialLinks: {
          instagram: user.connectedAccounts?.instagram || { connected: false, username: "" },
          twitter: user.connectedAccounts?.twitter || { connected: false, username: "" },
          tiktok: user.connectedAccounts?.tiktok || { connected: false, username: "" },
        },
      })
    }
    setIsEditing(false)
  }

  const handleUserUpdated = () => {
    // Refresh user data after moderation action
    const userData = getUserByNickname(nickname)
    if (userData) {
      setUser(userData)
    }
  }

  // Share profile functionality
  const getProfileUrl = () => {
    return `${window.location.origin}/profile/${nickname}`
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getProfileUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  // Generate QR code data URL (simple implementation)
  const generateQRCode = () => {
    // In a real app, you would use a proper QR code library like 'qrcode'
    // For now, we'll use a placeholder QR code service
    const url = encodeURIComponent(getProfileUrl())
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}`
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Get connected accounts
  const connectedAccounts = getConnectedAccounts()

  return (
    <main className="min-h-screen bg-black text-white pb-16 relative overflow-hidden">
      {/* Colored circles in background with animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[20%] w-[320px] h-[320px] rounded-full bg-emerald-500/20 blur-[100px] animate-float-slow"></div>
        <div className="absolute top-[50%] left-[5%] w-[380px] h-[380px] rounded-full bg-cyan-500/20 blur-[120px] animate-float-delayed"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[300px] h-[300px] rounded-full bg-violet-400/20 blur-[100px] animate-float-reverse"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black border-b border-[#1a1a1a]">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-[77px]">
            <Image src="/logo.png" alt="Logo" width={77} height={40} />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button className="flex items-center gap-1 px-3 py-1.5 hidden">
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
      <div className="max-w-[1100px] w-full mx-auto px-4 pt-24 relative z-10">
        {/* Title and action buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Profile</h1>
          <div className="flex items-center gap-3">
            {/* Share Profile Button - visible for everyone */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center justify-center w-10 h-10 bg-[#18181c] border border-[#27272f] rounded-full hover:bg-[#27272f] transition-colors"
            >
              <Share2 size={16} />
            </button>

            {/* Admin Moderation Button - only show for admins viewing other users */}
            {user &&
              currentUser &&
              currentUser.nickname !== user.nickname &&
              getUserByNickname(currentUser.nickname)?.isAdmin && (
                <button
                  onClick={() => setShowModerationModal(true)}
                  className="flex items-center justify-center w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-full hover:bg-red-500/30 transition-colors text-red-400"
                >
                  <Shield size={16} />
                </button>
              )}

            {/* Edit Profile Button - only show if the current user is viewing their own profile */}
            {user && currentUser && user.nickname === currentUser.nickname && (
              <>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#18181c] border border-[#27272f] rounded-full text-sm flex items-center gap-2 hover:bg-[#27272f] transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelChanges}
                      className="px-4 py-2 bg-[#18181c] border border-[#27272f] rounded-full text-sm flex items-center gap-2 hover:bg-[#27272f] transition-colors"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-full text-sm flex items-center gap-2 transition-colors"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Profile banner */}
        <div className="relative mb-6">
          <div className="w-full h-48 rounded-xl overflow-hidden bg-[#18181c] border border-[#27272f]">
            {user.isBanned ? (
              // Banned user - dark cover
              <div className="w-full h-full bg-[#0a0a0a]"></div>
            ) : // Normal user cover
            formData.coverImage ? (
              <Image
                src={formData.coverImage || "/placeholder.svg"}
                alt="Cover"
                fill
                className="object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-[#a0a0e1]"></div>
            )}
            {isEditing && !user.isBanned && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                onClick={handleCoverImageClick}
              >
                <button className="px-4 py-2 bg-[#18181c] hover:bg-[#27272f] rounded-md text-sm transition-colors flex items-center gap-2">
                  <Upload size={16} />
                  <span>Change Cover Image</span>
                </button>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={coverFileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "coverImage")}
          />
        </div>

        {/* User information */}
        <div className="relative mb-8">
          {/* User avatar */}
          <div className="absolute -top-16 left-4">
            <div
              className={`h-24 w-24 rounded-full overflow-hidden border-4 border-black ${isEditing && !user.isBanned ? "cursor-pointer" : ""}`}
              onClick={isEditing && !user.isBanned ? handleProfileImageClick : undefined}
            >
              {user.isBanned ? (
                // Banned user - use ghost avatar
                <Image
                  src="/banned-user-avatar.png"
                  alt="Banned user"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <Image
                  src={formData.avatar || "/placeholder.svg"}
                  alt={user.nickname}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              )}
              {isEditing && !user.isBanned && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "avatar")}
            />
          </div>

          {/* User data */}
          <div className="pt-12 pl-0 pr-0">
            {user.isBanned ? (
              // Banned user display
              <div className="text-center py-8">
                <h2 className="text-xl font-medium mb-2 text-gray-500">@{user.nickname}</h2>
                <div className="bg-[#0c0c0e] border border-[#27272f] rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <Ban size={32} className="text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-red-400">Account Suspended</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    This account has been suspended for violating our community guidelines.
                  </p>
                  {user.banType === "temporary" && user.banExpiresAt && (
                    <p className="text-xs text-gray-500">
                      Suspension expires: {new Date(user.banExpiresAt).toLocaleDateString()}
                    </p>
                  )}
                  {user.banType === "permanent" && (
                    <p className="text-xs text-gray-500">This is a permanent suspension.</p>
                  )}
                </div>
              </div>
            ) : (
              // Normal user display (existing code)
              <>
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Username</label>
                      <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        className="w-full bg-[#18181c] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* User Category - updated to match Categories and Languages design */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">User Category</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "tourist", label: "Tourist" },
                          { value: "guide", label: "Guide" },
                          { value: "influencer", label: "Influencer" },
                          { value: "photographer", label: "Photographer" },
                          { value: "adventurer", label: "Adventurer" },
                          { value: "blogger", label: "Blogger" },
                        ].map((category) => (
                          <div
                            key={category.value}
                            className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                              formData.userStatus === category.value
                                ? "bg-indigo-500 bg-opacity-20 text-indigo-400 border border-indigo-500"
                                : "bg-[#18181c] text-gray-400 border border-[#27272f] hover:border-gray-500"
                            }`}
                            onClick={() => setFormData({ ...formData, userStatus: category.value })}
                          >
                            {category.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Visited Countries</label>
                      <input
                        type="number"
                        name="visitedCountries"
                        value={formData.visitedCountries}
                        onChange={handleInputChange}
                        min="0"
                        max="195"
                        className="w-full bg-[#18181c] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Bio</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-[#18181c] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="w-full bg-[#18181c] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Categories */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Categories</label>
                      <p className="text-xs text-gray-500 mb-3">
                        Select up to 5 categories that best describe your content.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "travel",
                          "photography",
                          "adventure",
                          "food",
                          "culture",
                          "nature",
                          "city",
                          "hiking",
                          "budget",
                          "luxury",
                        ].map((category) => (
                          <div
                            key={category}
                            className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                              formData.categories.includes(category)
                                ? "bg-indigo-500 bg-opacity-20 text-indigo-400 border border-indigo-500"
                                : "bg-[#18181c] text-gray-400 border border-[#27272f] hover:border-gray-500"
                            }`}
                            onClick={() => {
                              if (formData.categories.includes(category)) {
                                setFormData({
                                  ...formData,
                                  categories: formData.categories.filter((c) => c !== category),
                                })
                              } else if (formData.categories.length < 5) {
                                setFormData({
                                  ...formData,
                                  categories: [...formData.categories, category],
                                })
                              }
                            }}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Languages</label>
                      <p className="text-xs text-gray-500 mb-3">Select the languages you create content in.</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "english",
                          "spanish",
                          "french",
                          "german",
                          "italian",
                          "japanese",
                          "chinese",
                          "russian",
                          "arabic",
                          "portuguese",
                        ].map((language) => (
                          <div
                            key={language}
                            className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                              formData.languages.includes(language)
                                ? "bg-indigo-500 bg-opacity-20 text-indigo-400 border border-indigo-500"
                                : "bg-[#18181c] text-gray-400 border border-[#27272f] hover:border-gray-500"
                            }`}
                            onClick={() => {
                              if (formData.languages.includes(language)) {
                                setFormData({
                                  ...formData,
                                  languages: formData.languages.filter((l) => l !== language),
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  languages: [...formData.languages, language],
                                })
                              }
                            }}
                          >
                            {language}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-xl font-medium">{user.nickname}</h2>
                      {/* User status badge */}
                      <div className="px-2.5 py-1 bg-[#1a1a1a] rounded-full text-xs font-medium border border-[#27272f] flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 ${
                            user.userStatus === "guide"
                              ? "bg-green-400"
                              : user.userStatus === "турист"
                                ? "bg-blue-400"
                                : user.userStatus === "гид"
                                  ? "bg-green-400"
                                  : user.userStatus === "influencer"
                                    ? "bg-purple-400"
                                    : "bg-gray-400"
                          }`}
                        ></span>
                        <span className="capitalize">{user.userStatus}</span>
                      </div>
                      {/* Visited Countries badge */}
                      <div className="px-2.5 py-1 bg-[#1a1a1a] rounded-full text-xs font-medium border border-[#27272f] flex items-center">
                        <Globe size={12} className="mr-1.5 text-blue-400" />
                        <span>{user.visitedCountries} countries</span>
                      </div>
                      {/* Total Routes badge */}
                      <div className="px-2.5 py-1 bg-[#1a1a1a] rounded-full text-xs font-medium border border-[#27272f] flex items-center">
                        <MapPin size={12} className="mr-1.5 text-indigo-400" />
                        <span>{user.createdRoutes} routes</span>
                      </div>
                      {/* Rating badge */}
                      <div className="px-2.5 py-1 bg-[#1a1a1a] rounded-full text-xs font-medium border border-[#27272f] flex items-center">
                        <Star size={12} className="mr-1.5 text-yellow-400" />
                        <span>{user.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">{user.description}</p>
                    {user.location && (
                      <p className="text-gray-400 mb-2">
                        <span className="font-medium">Location:</span> {user.location}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Minimalist separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#27272f] to-transparent my-8"></div>

        {/* User statistics - now hidden since we display them as badges */}
        <div className="hidden grid-cols-3 gap-4 mb-10">
          {/* Number of visited countries */}
          <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2a2a2a]">
            <div className="text-xs text-gray-400 mb-1">Visited Countries</div>
            <div className="text-2xl font-medium">{user.visitedCountries}</div>
          </div>
          {/* Number of routes */}
          <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2a2a2a]">
            <div className="text-xs text-gray-400 mb-1">Total Routes</div>
            <div className="text-2xl font-medium">{user.createdRoutes}</div>
          </div>
          {/* Rating */}
          <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2a2a2a]">
            <div className="text-xs text-gray-400 mb-1">Rating</div>
            <div className="flex items-center">
              <div className="text-2xl font-medium mr-2">{user.rating}</div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Achievements Block */}
        {!user.isBanned && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Achievements</h2>
              {user && currentUser && user.nickname === currentUser.nickname && (
                <button
                  onClick={() => setShowAchievementsModal(true)}
                  className="px-4 py-2 bg-[#18181c] border border-[#27272f] rounded-full text-sm flex items-center gap-2 hover:bg-[#27272f] transition-colors"
                >
                  <span>View All</span>
                </button>
              )}
            </div>
            <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] p-6">
              <div className="flex flex-wrap justify-start gap-x-5 gap-y-6">
                {/* Use profileDisplayAchievements here */}
                {profileDisplayAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    name={achievement.name}
                    icon={achievement.icon}
                    gradient={achievement.gradient}
                    // Pass the 'unlocked' status based on user's completion for the badge
                    unlocked={achievement.unlocked}
                    // Pass progress data for the badge to display it
                    currentProgress={achievement.currentProgress}
                    progressGoal={achievement.progressGoal}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Popular routes - carousel */}
        {user.nickname !== "debil" && !user.isBanned && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Popular Routes</h2>
              {/* Carousel navigation buttons */}
              {userRoutes.length > 4 && (
                <div className="hidden lg:flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 bg-[#18181c] border border-[#27272f] rounded-full hover:bg-[#27272f] transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 bg-[#18181c] border border-[#27272f] rounded-full hover:bg-[#27272f] transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {userRoutes.length > 0 ? (
              <>
                {/* Routes carousel */}
                <div className="relative">
                  <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
                    {userRoutes.slice(currentSlide, currentSlide + 4).map((route, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-full max-w-[300px] snap-start"
                        style={{ minWidth: "280px" }}
                      >
                        <RouteCard route={route} index={routes.findIndex((r) => r === route)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* "View all" button */}
                {userRoutes.length > 4 && (
                  <button
                    onClick={() => setShowAllRoutesModal(true)}
                    className="flex items-center justify-center w-full py-3 mt-6 bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] hover:bg-[#0c0c0e] transition-colors"
                  >
                    <span>View All Routes ({userRoutes.length})</span>
                  </button>
                )}
              </>
            ) : (
              <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a] text-center">
                <p className="text-gray-400">This user doesn't have any routes yet</p>
              </div>
            )}
          </div>
        )}

        {/* Connected accounts - only connected ones */}
        {!user.isBanned && (
          <div className="mb-10">
            <h2 className="text-xl font-medium mb-6">Connected Accounts</h2>
            <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden">
              <div className="p-6 space-y-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0c0c0e] flex items-center justify-center text-[#E1306C]">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Instagram</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={formData.socialLinks.instagram.username}
                          onChange={(e) => handleSocialInputChange("instagram", e.target.value)}
                          placeholder="username"
                          className="bg-[#18181c] border border-[#27272f] rounded-md py-1.5 px-3 text-white focus:outline-none focus:border-indigo-500 w-40"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0c0c0e] flex items-center justify-center text-[#1DA1F2]">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 5.79997C21.2483 6.12606 20.4534 6.34163 19.64 6.43997C20.4982 5.92729 21.1413 5.12075 21.45 4.16997C20.6436 4.65003 19.7608 4.98826 18.84 5.16997C18.2245 4.50254 17.405 4.05826 16.5098 3.90682C15.6147 3.75537 14.6945 3.90532 13.8938 4.33315C13.093 4.76099 12.4569 5.4425 12.0852 6.2708C11.7135 7.09911 11.6273 8.02736 11.84 8.90997C10.2094 8.82749 8.61444 8.40292 7.15865 7.66383C5.70287 6.92474 4.41885 5.88766 3.39 4.61997C3.02914 5.25013 2.83952 5.96379 2.84 6.68997C2.83872 7.36435 3.00422 8.02858 3.32176 8.62353C3.63929 9.21848 4.09902 9.72568 4.66 10.1C4.00798 10.082 3.36989 9.90726 2.8 9.58997V9.63997C2.80489 10.5849 3.13599 11.4991 3.73731 12.2279C4.33864 12.9568 5.17326 13.4556 6.1 13.64C5.74326 13.7485 5.37288 13.8058 5 13.81C4.74189 13.807 4.48442 13.7835 4.23 13.74C4.49391 14.5528 5.00462 15.2631 5.69133 15.7721C6.37803 16.2811 7.20878 16.5635 8.06 16.58C6.6172 17.7152 4.83588 18.3348 3 18.34C2.66574 18.3411 2.33174 18.321 2 18.28C3.87443 19.4902 6.05881 20.1327 8.29 20.13C9.82969 20.146 11.3571 19.855 12.7831 19.274C14.2091 18.6931 15.505 17.8338 16.5952 16.7465C17.6854 15.6591 18.548 14.3654 19.1326 12.9409C19.7172 11.5164 20.012 9.98969 20 8.44997C20 8.27996 20 8.09997 20 7.91997C20.7847 7.33478 21.4615 6.61739 22 5.79997Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Twitter</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={formData.socialLinks.twitter.username}
                          onChange={(e) => handleSocialInputChange("twitter", e.target.value)}
                          placeholder="username"
                          className="bg-[#18181c] border border-[#27272f] rounded-md py-1.5 px-3 text-white focus:outline-none focus:border-indigo-500 w-40"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0c0c0e] flex items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.6 5.82C15.9165 5.03962 15.5397 4.03743 15.54 3H12.45V16.5C12.4494 17.0269 12.2879 17.5409 11.9842 17.9718C11.6806 18.4027 11.2514 18.7305 10.7522 18.9109C10.253 19.0913 9.70961 19.1154 9.19709 18.9795C8.68458 18.8435 8.22797 18.5538 7.89 18.15C7.46222 17.6303 7.24643 16.9775 7.28872 16.3126C7.33101 15.6478 7.62833 15.0249 8.12 14.57C8.62162 14.1066 9.27447 13.8462 9.95 13.84V10.74C8.78173 10.7546 7.64437 11.1296 6.69923 11.8118C5.75409 12.494 5.04947 13.4516 4.68 14.5489C4.31053 15.6461 4.29558 16.8312 4.63723 17.9375C4.97888 19.0438 5.66093 20.0214 6.59 20.73C7.58901 21.4903 8.80435 21.9111 10.06 21.93C11.3156 21.9489 12.5365 21.5292 13.5179 20.7406C14.4993 19.9519 15.1801 18.8431 15.45 17.61C15.4891 17.4009 15.51 17.1899 15.51 16.98V9.15C16.2854 9.75898 17.1851 10.1928 18.14 10.42V7.32C17.5783 7.29533 17.0297 7.14078 16.5347 6.86719C16.0397 6.59359 15.6109 6.2078 15.28 5.74L16.6 5.82Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">TikTok</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={formData.socialLinks.tiktok.username}
                          onChange={(e) => handleSocialInputChange("tiktok", e.target.value)}
                          placeholder="username"
                          className="bg-[#18181c] border border-[#27272f] rounded-md py-1.5 px-3 text-white focus:outline-none focus:border-indigo-500 w-40"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {connectedAccounts.length > 0 ? (
                      connectedAccounts.map((account, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0c0c0e] flex items-center justify-center">
                              {account.icon}
                            </div>
                            <div>
                              <div className="font-medium capitalize">{account.type}</div>
                              <div className="text-sm text-gray-400">{account.username}</div>
                            </div>
                          </div>
                          <div className="text-sm text-green-500">Connected</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-4">No connected social media accounts</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for "View All Routes" */}
      {showAllRoutesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#080809] border border-[#27272f] rounded-xl shadow-lg flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-[#080809]">
              <h2 className="text-xl font-medium">All Routes</h2>
              <button
                onClick={() => setShowAllRoutesModal(false)}
                className="p-1 hover:bg-[#27272f] rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Routes List */}
            <div className="flex-1 overflow-y-auto p-4 custom-dark-scrollbar">
              {filteredAllRoutes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAllRoutes.map((route, idx) => (
                    <RouteCard key={idx} route={route} index={routes.findIndex((r) => r.name === route.name)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/disappointed.png"
                      alt="No routes found"
                      width={70}
                      height={70}
                      className="opacity-60"
                    />
                  </div>
                  <div className="text-gray-400 text-lg mb-2">No routes found matching your criteria.</div>
                  <p className="text-gray-500 mb-4">Try adjusting your filters.</p>
                  <button
                    onClick={() => {
                      setAllRoutesSearchQuery("")
                      setAllRoutesTypeFilter("all")
                      setAllRoutesDifficultyFilter("all")
                    }}
                    className="px-6 py-2 bg-[#6C61FF] text-white rounded-full hover:bg-[#5951E6] transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Profile Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181c] border border-[#27272f] rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Share Profile</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-[#27272f] rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg">
                <Image
                  src={generateQRCode() || "/placeholder.svg"}
                  alt="Profile QR Code"
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>
            </div>

            {/* Profile URL */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Profile Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getProfileUrl()}
                  readOnly
                  className="flex-1 bg-[#0c0c0e] border border-[#27272f] rounded-lg px-3 py-2 text-white text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Scan the QR code or share the link to let others view this profile
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Modal */}
      <ModerationModal
        isOpen={showModerationModal}
        onClose={() => setShowModerationModal(false)}
        user={user}
        onUserUpdated={handleUserUpdated}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={userSpecificAchievements}
      />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showProfileSetupModal}
        onClose={() => setShowProfileSetupModal(false)}
        currentNickname={user?.nickname || ""}
        onSave={handleProfileSetupSave}
      />
    </main>
  )
}
