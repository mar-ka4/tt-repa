export interface UserAchievementProgress {
  id: string // The ID of the achievement
  currentProgress: number // Current progress towards the achievement
  totalProgress: number // Total required progress for the achievement
}

export interface User {
  nickname: string
  password: string
  email: string
  phone: string
  isVerifiedForRoutes: boolean
  hasSubmittedVerificationForm: boolean
  userStatus: string
  description: string
  visitedCountries: number
  createdRoutes: number
  rating?: number
  isAdmin?: boolean
  isBanned?: boolean // New field for ban status
  banType?: "temporary" | "permanent" | null // New field for ban type
  banExpiresAt?: string | null // New field for temporary ban expiration
  banReason?: string // New field for ban reason
  connectedAccounts: {
    instagram: { connected: boolean; username: string }
    tiktok: { connected: boolean; username: string }
    twitter: { connected: boolean; username: string }
  }
  twoFactorAuth: {
    enabled: boolean
    method: string
  }
  securityNotifications: {
    loginAlerts: boolean
    securityAlerts: boolean
    accountChanges: boolean
  }
  accountCreated: string
  avatar: string
  backupEmail: string
  coverImage?: string
  wishlists?: Wishlist[]
  purchasedRoutes?: string[] // This array should contain the 'id' property of the routes, not their array index.
  userAchievements?: UserAchievementProgress[] // Updated field for user's completed achievement IDs with progress
}

export interface Wishlist {
  id: number
  name: string
  routes: string[] // Изменено на string[]
  createdAt: string
}

export const users: User[] = [
  {
    nickname: "mar_ka4",
    password: "mar123",
    email: "marrr.parr@example.com",
    phone: "+38 (096) 319 91 11",
    isVerifiedForRoutes: true,
    hasSubmittedVerificationForm: false,
    userStatus: "guide",
    isAdmin: true, // Set mar_ka4 as admin
    description:
      "I love sharing stories about cities! I create walking routes across Europe, revealing their cultural and historical richness. My tours are cozy walks with in-depth storytelling. Specialized styles can be incorporated if needed.",
    visitedCountries: 10,
    createdRoutes: 3,
    rating: 4.8,
    connectedAccounts: {
      instagram: { connected: true, username: "@mar_ka4_travel" },
      tiktok: { connected: true, username: "@mar_ka4_guides" },
      twitter: { connected: false, username: "" },
    },
    twoFactorAuth: {
      enabled: true,
      method: "app", // "app", "sms", "email"
    },
    securityNotifications: {
      loginAlerts: true,
      securityAlerts: true,
      accountChanges: true,
    },
    accountCreated: "2022-06-15T00:00:00",
    avatar: "/pepe.jpeg",
    backupEmail: "backup.marka4@example.com",
    coverImage: "/profile-covers/mountain-night-landscape.png",
    // Updated wishlists for the user
    wishlists: [
      {
        id: 1,
        name: "European Adventures",
        routes: ["0", "1", "2", "19", "20", "22"], // Изменено на строковые ID
        createdAt: "2023-05-15T10:30:00Z",
      },
      {
        id: 2,
        name: "Iceland Exploration",
        routes: ["2"], // Изменено на строковые ID (предполагается, что ID Исландии "2")
        createdAt: "2023-06-20T14:45:00Z",
      },
      {
        id: 3,
        name: "Asian Destinations",
        routes: ["3"], // Изменено на строковые ID (предполагается, что ID Токио "3")
        createdAt: "2023-07-10T09:15:00Z",
      },
      {
        id: 4,
        name: "Beach Getaways",
        routes: [], // Empty wishlist
        createdAt: "2023-08-05T16:20:00Z",
      },
    ],
    purchasedRoutes: ["0", "1", "18", "36", "25"], // Уже было изменено на строковые ID
    userAchievements: [
      { id: "first-route", currentProgress: 1, totalProgress: 1 },
      { id: "gastronomy-expert", currentProgress: 3, totalProgress: 5 }, // Updated to show progress
      { id: "nature-traveler", currentProgress: 2, totalProgress: 3 }, // Updated to show progress
      { id: "route-star", currentProgress: 1, totalProgress: 1 },
      { id: "social-explorer", currentProgress: 1, totalProgress: 1 },
      { id: "adventure-seeker", currentProgress: 1, totalProgress: 5 }, // Updated to show progress
      { id: "master-explorer", currentProgress: 1, totalProgress: 1 },
      { id: "city-slicker", currentProgress: 1, totalProgress: 1 }, // Changed from city-wanderer to city-slicker (based on allAchievements)
      { id: "photo-master", currentProgress: 1, totalProgress: 1 },
      { id: "global-traveler", currentProgress: 10, totalProgress: 10 }, // Completed
      { id: "award-winner", currentProgress: 1, totalProgress: 5 }, // Added as in-progress
      { id: "trophy-collector", currentProgress: 1, totalProgress: 10 }, // Added as in-progress
    ],
  },
  {
    nickname: "sanya",
    password: "deb456",
    email: "sanya@example.com",
    phone: "+380660031592",
    isVerifiedForRoutes: false,
    hasSubmittedVerificationForm: false,
    userStatus: "турист",
    isAdmin: false, // Not an admin
    description:
      "I travel for adventure! From the streets of Tokyo to the fjords of Iceland, my itineraries are for those who seek vivid impressions and unusual places.",
    visitedCountries: 8,
    createdRoutes: 2,
    rating: 4.5,
    connectedAccounts: {
      instagram: { connected: true, username: "@sanya_travels" },
      tiktok: { connected: false, username: "" },
      twitter: { connected: true, username: "@sanya_adventures" },
    },
    twoFactorAuth: {
      enabled: false,
      method: "none",
    },
    securityNotifications: {
      loginAlerts: false,
      securityAlerts: true,
      accountChanges: false,
    },
    accountCreated: "2022-08-10T00:00:00",
    avatar: "/profile-pictures/27.png",
    backupEmail: "",
    coverImage: "/profile-covers/military-ceremony.png", // Updated cover image
    wishlists: [], // Empty wishlists array
    userAchievements: [
      { id: "first-route", currentProgress: 1, totalProgress: 1 },
      { id: "nature-traveler", currentProgress: 1, totalProgress: 1 },
      { id: "city-slicker", currentProgress: 1, totalProgress: 1 },
      { id: "global-traveler", currentProgress: 8, totalProgress: 10 }, // In progress
      { id: "local-guide", currentProgress: 1, totalProgress: 3 }, // In progress
    ],
  },
  {
    nickname: "triptips",
    password: "trip789",
    email: "triptips@example.com",
    phone: "+1 (555) 123-4567",
    isVerifiedForRoutes: true,
    hasSubmittedVerificationForm: true,
    userStatus: "гид",
    isAdmin: false, // Not an admin
    description:
      "Professional guide with 10 years of experience. I specialize in cultural and historical routes across Europe. My tours combine deep historical knowledge with engaging stories about local traditions and customs.",
    visitedCountries: 25,
    createdRoutes: 12,
    rating: 4.9,
    connectedAccounts: {
      instagram: { connected: true, username: "@triptips_official" },
      tiktok: { connected: true, username: "@triptips" },
      twitter: { connected: true, username: "@triptips_guides" },
    },
    twoFactorAuth: {
      enabled: true,
      method: "sms",
    },
    securityNotifications: {
      loginAlerts: true,
      securityAlerts: true,
      accountChanges: true,
    },
    accountCreated: "2021-03-22T00:00:00",
    avatar: "/avatar.png",
    backupEmail: "backup.triptips@example.com",
    wishlists: [], // Empty wishlists array
    userAchievements: [
      { id: "first-route", currentProgress: 1, totalProgress: 1 },
      { id: "gastronomy-expert", currentProgress: 5, totalProgress: 5 },
      { id: "nature-traveler", currentProgress: 3, totalProgress: 3 },
      { id: "route-star", currentProgress: 1, totalProgress: 1 },
      { id: "social-explorer", currentProgress: 1, totalProgress: 1 },
      { id: "culture-enthusiast", currentProgress: 4, totalProgress: 4 },
      { id: "adventure-seeker", currentProgress: 5, totalProgress: 5 },
      { id: "master-explorer", currentProgress: 20, totalProgress: 20 },
      { id: "city-slicker", currentProgress: 10, totalProgress: 10 },
      { id: "photo-master", currentProgress: 50, totalProgress: 50 },
      { id: "global-traveler", currentProgress: 10, totalProgress: 10 },
      { id: "local-guide", currentProgress: 3, totalProgress: 3 },
    ],
  },
  {
    nickname: "arinka_pk",
    password: "arinka_pk123",
    email: "arinka_pk@gmail.com",
    phone: "+1 (555) 234-5678",
    isVerifiedForRoutes: false,
    hasSubmittedVerificationForm: false,
    userStatus: "tourist",
    isAdmin: false,
    description:
      "Adventure seeker who loves exploring wild landscapes and remote destinations. Always looking for the next thrilling experience in nature's untouched corners.",
    visitedCountries: 5,
    createdRoutes: 0,
    connectedAccounts: {
      instagram: { connected: true, username: "@wildwolf_adventures" },
      tiktok: { connected: false, username: "" },
      twitter: { connected: false, username: "" },
    },
    twoFactorAuth: {
      enabled: false,
      method: "none",
    },
    securityNotifications: {
      loginAlerts: false,
      securityAlerts: true,
      accountChanges: false,
    },
    accountCreated: "2023-01-15T00:00:00",
    avatar: "/profile-pictures/image-white-cat-with-glasses.png",
    backupEmail: "",
    wishlists: [],
    userAchievements: [
      { id: "adventure-seeker", currentProgress: 1, totalProgress: 5 }, // Updated to show progress
      { id: "global-traveler", currentProgress: 5, totalProgress: 10 }, // In progress
      { id: "sea-farer", currentProgress: 2, totalProgress: 5 }, // Added as in-progress
    ],
  },
  {
    nickname: "eagleeye",
    password: "eagle456",
    email: "eagleeye@example.com",
    phone: "+44 20 7946 0958",
    isVerifiedForRoutes: false,
    hasSubmittedVerificationForm: false,
    userStatus: "tourist",
    isAdmin: false,
    description:
      "Photography enthusiast with a keen eye for capturing stunning landscapes and cityscapes. Passionate about finding the perfect viewpoints and hidden gems.",
    visitedCountries: 12,
    createdRoutes: 0,
    connectedAccounts: {
      instagram: { connected: true, username: "@eagleeye_photos" },
      tiktok: { connected: true, username: "@eagleeye_captures" },
      twitter: { connected: false, username: "" },
    },
    twoFactorAuth: {
      enabled: false,
      method: "none",
    },
    securityNotifications: {
      loginAlerts: true,
      securityAlerts: false,
      accountChanges: true,
    },
    accountCreated: "2023-03-22T00:00:00",
    avatar: "/profile-2.png",
    backupEmail: "backup.eagleeye@example.com",
    wishlists: [],
    userAchievements: [
      { id: "photo-master", currentProgress: 25, totalProgress: 50 }, // Updated to show progress
      { id: "global-traveler", currentProgress: 10, totalProgress: 10 }, // Completed
      { id: "sun-chaser", currentProgress: 3, totalProgress: 5 }, // Added as in-progress
    ],
  },
  {
    nickname: "foxtrotter",
    password: "fox789",
    email: "foxtrotter@example.com",
    phone: "+33 1 42 86 83 26",
    isVerifiedForRoutes: false,
    hasSubmittedVerificationForm: false,
    userStatus: "tourist",
    isAdmin: false,
    description:
      "Urban explorer who enjoys discovering hidden cafes, street art, and local culture in bustling cities. Always on the hunt for authentic local experiences.",
    visitedCountries: 7,
    createdRoutes: 0,
    connectedAccounts: {
      instagram: { connected: false, username: "" },
      tiktok: { connected: true, username: "@foxtrotter_urban" },
      twitter: { connected: true, username: "@foxtrotter_explore" },
    },
    twoFactorAuth: {
      enabled: true,
      method: "email",
    },
    securityNotifications: {
      loginAlerts: true,
      securityAlerts: true,
      accountChanges: false,
    },
    accountCreated: "2023-05-10T00:00:00",
    avatar: "/profile-pictures/image-cartoon-pirate.jpeg",
    backupEmail: "",
    wishlists: [],
    userAchievements: [
      { id: "social-explorer", currentProgress: 3, totalProgress: 5 }, // Updated to show progress
      { id: "culture-enthusiast", currentProgress: 2, totalProgress: 4 }, // Updated to show progress
      { id: "city-slicker", currentProgress: 5, totalProgress: 10 }, // Updated to show progress
      { id: "global-traveler", currentProgress: 7, totalProgress: 10 }, // In progress
    ],
  },
  {
    nickname: "bearwanderer",
    password: "bear321",
    email: "bearwanderer@example.com",
    phone: "+49 30 12345678",
    isVerifiedForRoutes: false,
    hasSubmittedVerificationForm: false,
    userStatus: "tourist",
    isAdmin: false,
    description:
      "Slow travel enthusiast who believes in taking time to truly experience each destination. Prefers cozy accommodations and local food over rushed sightseeing.",
    visitedCountries: 15,
    createdRoutes: 0,
    connectedAccounts: {
      instagram: { connected: true, username: "@bearwanderer_slow" },
      tiktok: { connected: false, username: "" },
      twitter: { connected: true, username: "@bearwanderer" },
    },
    twoFactorAuth: {
      enabled: false,
      method: "none",
    },
    securityNotifications: {
      loginAlerts: false,
      securityAlerts: false,
      accountChanges: true,
    },
    accountCreated: "2023-07-18T00:00:00",
    avatar: "/profile-4.png",
    backupEmail: "backup.bearwanderer@example.com",
    wishlists: [],
    userAchievements: [
      { id: "nature-traveler", currentProgress: 1, totalProgress: 3 }, // Updated to show progress
      { id: "global-traveler", currentProgress: 10, totalProgress: 10 }, // Completed
      { id: "rain-lover", currentProgress: 1, totalProgress: 3 }, // Added as in-progress
    ],
  },
  {
    nickname: "swiftrabbit",
    password: "rabbit654",
    email: "swiftrabbit@example.com",
    phone: "+81 3-1234-5678",
    isVerifiedForRoutes: false,
    hasSubmittedVerificationForm: false,
    userStatus: "tourist",
    isAdmin: false,
    description:
      "Fast-paced traveler who loves efficient itineraries and maximizing time in each destination. Expert at finding the best deals and optimizing travel routes.",
    visitedCountries: 20,
    createdRoutes: 0,
    connectedAccounts: {
      instagram: { connected: true, username: "@swiftrabbit_travel" },
      tiktok: { connected: true, username: "@swiftrabbit_tips" },
      twitter: { connected: true, username: "@swiftrabbit_deals" },
    },
    twoFactorAuth: {
      enabled: true,
      method: "app",
    },
    securityNotifications: {
      loginAlerts: true,
      securityAlerts: true,
      accountChanges: true,
    },
    accountCreated: "2023-09-05T00:00:00",
    avatar: "/profile-5.png",
    backupEmail: "backup.swiftrabbit@example.com",
    wishlists: [],
    userAchievements: [
      { id: "master-explorer", currentProgress: 10, totalProgress: 20 }, // Updated to show progress
      { id: "city-slicker", currentProgress: 7, totalProgress: 10 }, // Updated to show progress
      { id: "global-traveler", currentProgress: 10, totalProgress: 10 }, // Completed
      { id: "early-bird", currentProgress: 1, totalProgress: 1 },
      { id: "night-owl", currentProgress: 1, totalProgress: 1 },
      { id: "speed-demon", currentProgress: 0, totalProgress: 1 }, // Added as in-progress, but 0 as per achievements.ts
    ],
  },
]

// Функция для получения пользователя по никнейму
export function getUserByNickname(nickname: string): User | undefined {
  return users.find((user) => user.nickname === nickname)
}

// Импортируем маршруты напрямую
import { routes } from "./routes"

// Функция для получения маршрутов пользователя
export function getUserRoutes(nickname: string) {
  // Фильтруем маршруты по автору
  return routes.filter((route) => route.author === nickname)
}

// Function to get user's wishlists
export function getUserWishlists(nickname: string): Wishlist[] {
  const user = getUserByNickname(nickname)
  return user?.wishlists || []
}

// Function to add a route to a user's wishlist
export function addRouteToWishlist(nickname: string, wishlistId: number, routeId: string): boolean {
  const userIndex = users.findIndex((user) => user.nickname === nickname)
  if (userIndex === -1) return false

  const wishlistIndex = users[userIndex].wishlists?.findIndex((wishlist) => wishlist.id === wishlistId)
  if (wishlistIndex === undefined || wishlistIndex === -1) return false

  // Check if route is already in the wishlist
  if (users[userIndex].wishlists?.[wishlistIndex].routes.includes(routeId)) {
    return true // Route is already in the wishlist
  }

  // Add the route to the wishlist
  users[userIndex].wishlists?.[wishlistIndex].routes.push(routeId)
  return true
}

// Function to remove a route from a user's wishlist
export function removeRouteFromWishlist(nickname: string, wishlistId: number, routeId: string): boolean {
  const userIndex = users.findIndex((user) => user.nickname === nickname)
  if (userIndex === -1) return false

  const wishlistIndex = users[userIndex].wishlists?.findIndex((wishlist) => wishlist.id === wishlistId)
  if (wishlistIndex === undefined || wishlistIndex === -1) return false

  // Check if route is in the wishlist
  if (!users[userIndex].wishlists?.[wishlistIndex].routes.includes(routeId)) {
    return false // Route is not in the wishlist
  }

  // Remove the route from the wishlist
  users[userIndex].wishlists![wishlistIndex].routes = users[userIndex].wishlists![wishlistIndex].routes.filter(
    (id) => id !== routeId,
  )
  return true
}

// Function to create a new wishlist for a user
export function createWishlist(nickname: string, name: string, routeId?: string): Wishlist | null {
  const userIndex = users.findIndex((user) => user.nickname === nickname)
  if (userIndex === -1) return null

  // Initialize wishlists array if it doesn't exist
  if (!users[userIndex].wishlists) {
    users[userIndex].wishlists = []
  }

  // Generate a new ID (max ID + 1)
  const maxId = Math.max(0, ...users[userIndex].wishlists!.map((w) => w.id))
  const newId = maxId + 1

  // Create the new wishlist
  const newWishlist: Wishlist = {
    id: newId,
    name,
    routes: routeId ? [routeId] : [],
    createdAt: new Date().toISOString(),
  }

  // Add the wishlist to the user's wishlists
  users[userIndex].wishlists!.push(newWishlist)

  return newWishlist
}

// Add a new function to delete a wishlist
export function deleteWishlist(nickname: string, wishlistId: number): boolean {
  const userIndex = users.findIndex((user) => user.nickname === nickname)
  if (userIndex === -1) return false

  // Check if the user has wishlists
  if (!users[userIndex].wishlists) return false

  // Filter out the wishlist with the given ID
  users[userIndex].wishlists = users[userIndex].wishlists!.filter((wishlist) => wishlist.id !== wishlistId)

  return true
}

// Function to ban a user
export function banUser(
  nickname: string,
  banType: "temporary" | "permanent",
  duration?: number,
  reason?: string,
): boolean {
  const userIndex = users.findIndex((user) => user.nickname === nickname)
  if (userIndex === -1) return false

  users[userIndex].isBanned = true
  users[userIndex].banType = banType
  users[userIndex].banReason = reason || "Violation of community guidelines"

  if (banType === "temporary" && duration) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + duration)
    users[userIndex].banExpiresAt = expirationDate.toISOString()
  } else {
    users[userIndex].banExpiresAt = null
  }

  return true
}

// Function to unban a user
export function unbanUser(nickname: string): boolean {
  const userIndex = users.findIndex((user) => user.nickname === nickname)
  if (userIndex === -1) return false

  users[userIndex].isBanned = false
  users[userIndex].banType = null
  users[userIndex].banExpiresAt = null
  users[userIndex].banReason = undefined

  return true
}

// Function to check if a user's temporary ban has expired
export function checkBanExpiration(nickname: string): boolean {
  const userIndex = users.findIndex((user) => user.nickname === nickname)
  if (userIndex === -1) return false

  const user = users[userIndex]
  if (user.isBanned && user.banType === "temporary" && user.banExpiresAt) {
    const now = new Date()
    const expirationDate = new Date(user.banExpiresAt)

    if (now > expirationDate) {
      // Ban has expired, unban the user
      unbanUser(nickname)
      return true
    }
  }

  return false
}
