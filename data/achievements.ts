import type React from "react"
import {
  Car,
  Utensils,
  Leaf,
  Star,
  Users,
  BookOpen,
  Mountain,
  Globe,
  MapPin,
  Camera,
  Plane,
  Compass,
  Award,
  Trophy,
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  ThumbsUp,
  Bookmark,
  Clock,
  Zap,
  Sun,
  Moon,
  Cloud,
  Wind,
  Thermometer,
  Anchor,
} from "lucide-react"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ElementType
  gradient: string
  category: "travel" | "social" | "creation" | "exploration" | "gastronomy" | "nature" | "adventure" | "culture"
  progressGoal: number
  currentProgress: number
  unlocked: boolean
}

export const allAchievements: Achievement[] = [
  {
    id: "first-route",
    name: "First Route", // 11 chars
    description: "Create your first route",
    icon: Car,
    gradient: "bg-gradient-to-br from-purple-800 to-indigo-950",
    category: "creation",
    progressGoal: 1,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "gastronomy-expert",
    name: "Food Expert", // 11 chars
    description: "Complete 5 gastronomic routes",
    icon: Utensils,
    gradient: "bg-gradient-to-br from-orange-700 to-red-900",
    category: "gastronomy",
    progressGoal: 5,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "nature-traveler",
    name: "Nature Lover", // 12 chars
    description: "Complete 3 nature routes",
    icon: Leaf,
    gradient: "bg-gradient-to-br from-green-700 to-teal-900",
    category: "nature",
    progressGoal: 3,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "route-star",
    name: "Route Star", // 10 chars
    description: "Get 10 likes on your routes",
    icon: Star,
    gradient: "bg-gradient-to-br from-yellow-600 to-orange-800",
    category: "social",
    progressGoal: 10,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "social-explorer",
    name: "Socialite", // 9 chars
    description: "Comment on 5 routes",
    icon: Users,
    gradient: "bg-gradient-to-br from-blue-700 to-purple-900",
    category: "social",
    progressGoal: 5,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "culture-enthusiast",
    name: "Culture Buff", // 11 chars
    description: "Complete 4 cultural routes",
    icon: BookOpen,
    gradient: "bg-gradient-to-br from-pink-700 to-red-800",
    category: "culture",
    progressGoal: 4,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "adventure-seeker",
    name: "Adventurer", // 10 chars
    description: "Complete 5 adventure routes",
    icon: Mountain,
    gradient: "bg-gradient-to-br from-cyan-600 to-blue-800",
    category: "adventure",
    progressGoal: 5,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "master-explorer",
    name: "Master Expl.", // 12 chars
    description: "Complete 20 routes total",
    icon: Globe,
    gradient: "bg-gradient-to-br from-lime-600 to-green-800",
    category: "exploration",
    progressGoal: 20,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "local-guide",
    name: "Local Guide", // 11 chars
    description: "Create 3 routes in your hometown",
    icon: MapPin,
    gradient: "bg-gradient-to-br from-red-700 to-rose-900",
    category: "creation",
    progressGoal: 3,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "photo-master",
    name: "Photo Master", // 12 chars
    description: "Upload 50 photos to routes",
    icon: Camera,
    gradient: "bg-gradient-to-br from-gray-700 to-zinc-900",
    category: "creation",
    progressGoal: 50,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "global-traveler",
    name: "Global Traveler", // 15 chars
    description: "Complete routes in 10 different countries",
    icon: Plane,
    gradient: "bg-gradient-to-br from-indigo-700 to-blue-900",
    category: "travel",
    progressGoal: 10,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "compass-master",
    name: "Compass Master", // 14 chars
    description: "Navigate 15 routes using the in-app navigation",
    icon: Compass,
    gradient: "bg-gradient-to-br from-teal-700 to-emerald-900",
    category: "exploration",
    progressGoal: 15,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "award-winner",
    name: "Award Winner", // 12 chars
    description: "Receive 5 awards from other users",
    icon: Award,
    gradient: "bg-gradient-to-br from-amber-600 to-yellow-800",
    category: "social",
    progressGoal: 5,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "trophy-collector",
    name: "Trophy Hunter", // 13 chars
    description: "Unlock 10 achievements",
    icon: Trophy,
    gradient: "bg-gradient-to-br from-fuchsia-700 to-purple-900",
    category: "exploration",
    progressGoal: 10,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "sparkling-creator",
    name: "Sparkling C.", // 12 chars
    description: "Get 100 likes on a single route",
    icon: Sparkles,
    gradient: "bg-gradient-to-br from-sky-600 to-cyan-800",
    category: "creation",
    progressGoal: 100,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "heartfelt-reviewer",
    name: "Heartfelt R.", // 12 chars
    description: "Leave 20 positive reviews",
    icon: Heart,
    gradient: "bg-gradient-to-br from-rose-700 to-red-900",
    category: "social",
    progressGoal: 20,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "chatty-traveler",
    name: "Chatty Traveler", // 15 chars
    description: "Send 50 messages in route chats",
    icon: MessageSquare,
    gradient: "bg-gradient-to-br from-violet-700 to-purple-900",
    category: "social",
    progressGoal: 50,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "sharing-is-caring",
    name: "Route Sharer", // 12 chars
    description: "Share 10 routes with friends",
    icon: Share2,
    gradient: "bg-gradient-to-br from-emerald-700 to-green-900",
    category: "social",
    progressGoal: 10,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "thumbs-up-giver",
    name: "Like Master", // 11 chars
    description: "Like 100 routes",
    icon: ThumbsUp,
    gradient: "bg-gradient-to-br from-blue-700 to-sky-900",
    category: "social",
    progressGoal: 100,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "wishlist-curator",
    name: "Wishlist Guru", // 13 chars
    description: "Add 30 routes to your wishlist",
    icon: Bookmark,
    gradient: "bg-gradient-to-br from-orange-700 to-amber-900",
    category: "exploration",
    progressGoal: 30,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "early-bird",
    name: "Early Bird", // 10 chars
    description: "Complete a route before 8 AM",
    icon: Clock,
    gradient: "bg-gradient-to-br from-yellow-700 to-orange-900",
    category: "exploration",
    progressGoal: 1,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "night-owl",
    name: "Night Owl", // 9 chars
    description: "Complete a route after 10 PM",
    icon: Moon,
    gradient: "bg-gradient-to-br from-indigo-700 to-purple-900",
    category: "exploration",
    progressGoal: 1,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "speed-demon",
    name: "Speed Demon", // 11 chars
    description: "Complete a 10km route in under 1 hour",
    icon: Zap,
    gradient: "bg-gradient-to-br from-red-700 to-orange-900",
    category: "adventure",
    progressGoal: 1,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "sun-chaser",
    name: "Sun Chaser", // 10 chars
    description: "Complete 5 routes during sunny weather",
    icon: Sun,
    gradient: "bg-gradient-to-br from-amber-700 to-yellow-900",
    category: "nature",
    progressGoal: 5,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "rain-lover",
    name: "Rain Lover", // 10 chars
    description: "Complete 3 routes during rainy weather",
    icon: Cloud,
    gradient: "bg-gradient-to-br from-blue-700 to-indigo-900",
    category: "nature",
    progressGoal: 3,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "wind-rider",
    name: "Wind Rider", // 10 chars
    description: "Complete 2 routes during windy conditions",
    icon: Wind,
    gradient: "bg-gradient-to-br from-gray-700 to-slate-900",
    category: "adventure",
    progressGoal: 2,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "cold-blooded",
    name: "Cold Blooded", // 12 chars
    description: "Complete a route in freezing temperatures",
    icon: Thermometer,
    gradient: "bg-gradient-to-br from-cyan-700 to-blue-900",
    category: "adventure",
    progressGoal: 1,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "sea-farer",
    name: "Sea Farer", // 9 chars
    description: "Complete 5 routes near the ocean",
    icon: Anchor,
    gradient: "bg-gradient-to-br from-teal-700 to-cyan-900",
    category: "travel",
    progressGoal: 5,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "mountain-conqueror",
    name: "Mountain King", // 13 chars
    description: "Complete 3 routes in mountainous regions",
    icon: Mountain,
    gradient: "bg-gradient-to-br from-lime-700 to-green-900",
    category: "adventure",
    progressGoal: 3,
    currentProgress: 0,
    unlocked: false,
  },
  {
    id: "city-slicker",
    name: "City Slicker", // 12 chars
    description: "Complete 10 routes in major cities",
    icon: Globe,
    gradient: "bg-gradient-to-br from-purple-700 to-fuchsia-900",
    category: "travel",
    progressGoal: 10,
    currentProgress: 0,
    unlocked: false,
  },
]
