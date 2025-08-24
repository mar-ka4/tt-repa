import {
  Utensils,
  Camera,
  TreePine,
  Building,
  Mountain,
  Users,
  ShoppingBag,
  Music,
  Gamepad2,
  Coffee,
  Landmark,
  Castle,
  Church,
  LibraryIcon,
  Store,
  Sparkles,
  Lightbulb,
  Shield,
  Gift,
  Diamond,
  Clock,
  Anchor,
  LifeBuoy,
  Accessibility,
  Baby,
  Book,
  Info,
  DollarSign,
  Send,
  Wine,
  GlassWaterIcon,
  Sandwich,
  Salad,
  Bed,
  Tent,
} from "lucide-react"
import type React from "react"

// Helper function to get the Lucide icon component by subcategory ID
export const getIconComponentBySubcategoryId = (subcategoryId: string): React.ElementType | null => {
  switch (subcategoryId) {
    // Food & Drink
    case "restaurants":
      return Utensils
    case "cafes":
      return Coffee
    case "coffee-shops":
      return Coffee
    case "bars-pubs": // Combined category
      return Wine
    case "street-food":
      return Salad
    case "bakeries":
      return Utensils
    case "branch": // New subcategory
      return Sandwich

    // Attractions
    case "museums":
      return LibraryIcon
    case "historical-sites":
      return Building
    case "landmarks":
      return Landmark
    case "art-galleries":
      return Camera
    case "theaters":
      return Music
    case "parks-gardens":
      return TreePine
    case "zoos-aquariums":
      return Baby
    case "amusement-parks":
      return Gamepad2
    case "churches-cathedrals":
      return Church
    case "castles-palaces":
      return Castle

    // Nature & Outdoors
    case "mountains":
      return Mountain
    case "lakes":
      return GlassWaterIcon
    case "rivers":
      return GlassWaterIcon
    case "forests":
      return TreePine
    case "beaches":
      return Anchor
    case "hiking-trails":
      return Mountain
    case "national-parks":
      return TreePine
    case "caves":
      return Mountain
    case "valleys":
      return Mountain
    case "cliffs":
      return Mountain

    // Shopping
    case "boutiques":
      return ShoppingBag
    case "malls":
      return Store
    case "local-markets":
      return ShoppingBag
    case "souvenir-shops":
      return Gift
    case "bookstores":
      return Book
    case "antique-shops":
      return Clock
    case "fashion":
      return ShoppingBag
    case "electronics":
      return Gamepad2
    case "jewelry":
      return Diamond
    case "craft-shops":
      return Sparkles

    // Services
    case "info-centers":
      return Info
    case "atms-banks":
      return DollarSign
    case "post-offices":
      return Send
    case "hospitals-clinics":
      return LifeBuoy
    case "police-stations":
      return Shield
    case "restrooms":
      return Accessibility
    case "wifi-hotspots":
      return Coffee
    case "laundry-services":
      return ShoppingBag
    case "luggage-storage":
      return ShoppingBag
    case "tour-operators":
      return Users

    // Unique Experiences
    case "hidden-gems":
      return Diamond
    case "local-secrets":
      return Lightbulb
    case "panoramic-views":
      return Camera
    case "street-art":
      return Camera
    case "historical-walks":
      return Book
    case "cooking-classes":
      return Utensils
    case "wine-tasting":
      return Wine
    case "live-music-venues":
      return Music
    case "escape-rooms":
      return Gamepad2
    case "guided-tours":
      return Users

    // Accommodation
    case "hotels":
      return Bed
    case "camping":
      return Tent

    default:
      return null
  }
}

// Types for the icon library view
export type IconEntry = {
  category: string
  icon: React.ElementType
}

export type IconSubcategory = {
  name: string
  icons: IconEntry[]
}

export type IconCategory = {
  name: string
  categoryIcon?: React.ElementType
  subcategories: IconSubcategory[]
}

// Named export used by app/admin-studio/icon-library/page.tsx
export const iconCategories: IconCategory[] = [
  {
    name: "Food & Drink",
    categoryIcon: Utensils,
    subcategories: [
      { name: "Restaurants", icons: [{ category: "Restaurants", icon: Utensils }] },
      { name: "Cafes", icons: [{ category: "Cafes", icon: Coffee }] },
      { name: "Coffee Shops", icons: [{ category: "Coffee Shops", icon: Coffee }] },
      { name: "Bars & Pubs", icons: [{ category: "Bars & Pubs", icon: Wine }] },
      { name: "Street Food", icons: [{ category: "Street Food", icon: Salad }] },
      { name: "Bakeries", icons: [{ category: "Bakeries", icon: Utensils }] },
      { name: "Brunch", icons: [{ category: "Brunch", icon: Sandwich }] },
    ],
  },
  {
    name: "Attractions",
    categoryIcon: Landmark,
    subcategories: [
      { name: "Museums", icons: [{ category: "Museums", icon: LibraryIcon }] },
      { name: "Historical Sites", icons: [{ category: "Historical Sites", icon: Building }] },
      { name: "Landmarks", icons: [{ category: "Landmarks", icon: Landmark }] },
      { name: "Art Galleries", icons: [{ category: "Art Galleries", icon: Camera }] },
      { name: "Theaters", icons: [{ category: "Theaters", icon: Music }] },
      { name: "Parks & Gardens", icons: [{ category: "Parks & Gardens", icon: TreePine }] },
      { name: "Zoos & Aquariums", icons: [{ category: "Zoos & Aquariums", icon: Baby }] },
      { name: "Amusement Parks", icons: [{ category: "Amusement Parks", icon: Gamepad2 }] },
      { name: "Churches & Cathedrals", icons: [{ category: "Churches & Cathedrals", icon: Church }] },
      { name: "Castles & Palaces", icons: [{ category: "Castles & Palaces", icon: Castle }] },
    ],
  },
  {
    name: "Nature & Outdoors",
    categoryIcon: Mountain,
    subcategories: [
      { name: "Mountains", icons: [{ category: "Mountains", icon: Mountain }] },
      { name: "Lakes", icons: [{ category: "Lakes", icon: GlassWaterIcon }] },
      { name: "Rivers", icons: [{ category: "Rivers", icon: GlassWaterIcon }] },
      { name: "Forests", icons: [{ category: "Forests", icon: TreePine }] },
      { name: "Beaches", icons: [{ category: "Beaches", icon: Anchor }] },
      { name: "Hiking Trails", icons: [{ category: "Hiking Trails", icon: Mountain }] },
      { name: "National Parks", icons: [{ category: "National Parks", icon: TreePine }] },
      { name: "Caves", icons: [{ category: "Caves", icon: Mountain }] },
      { name: "Valleys", icons: [{ category: "Valleys", icon: Mountain }] },
      { name: "Cliffs", icons: [{ category: "Cliffs", icon: Mountain }] },
    ],
  },
  {
    name: "Shopping",
    categoryIcon: ShoppingBag,
    subcategories: [
      { name: "Boutiques", icons: [{ category: "Boutiques", icon: ShoppingBag }] },
      { name: "Malls", icons: [{ category: "Malls", icon: Store }] },
      { name: "Local Markets", icons: [{ category: "Local Markets", icon: ShoppingBag }] },
      { name: "Souvenir Shops", icons: [{ category: "Souvenir Shops", icon: Gift }] },
      { name: "Bookstores", icons: [{ category: "Bookstores", icon: Book }] },
      { name: "Antique Shops", icons: [{ category: "Antique Shops", icon: Clock }] },
      { name: "Fashion", icons: [{ category: "Fashion", icon: ShoppingBag }] },
      { name: "Electronics", icons: [{ category: "Electronics", icon: Gamepad2 }] },
      { name: "Jewelry", icons: [{ category: "Jewelry", icon: Diamond }] },
      { name: "Craft Shops", icons: [{ category: "Craft Shops", icon: Sparkles }] },
    ],
  },
  {
    name: "Services",
    categoryIcon: Info,
    subcategories: [
      { name: "Info Centers", icons: [{ category: "Info Centers", icon: Info }] },
      { name: "ATMs & Banks", icons: [{ category: "ATMs & Banks", icon: DollarSign }] },
      { name: "Post Offices", icons: [{ category: "Post Offices", icon: Send }] },
      { name: "Hospitals & Clinics", icons: [{ category: "Hospitals & Clinics", icon: LifeBuoy }] },
      { name: "Police Stations", icons: [{ category: "Police Stations", icon: Shield }] },
      { name: "Restrooms", icons: [{ category: "Restrooms", icon: Accessibility }] },
      { name: "Wi‑Fi Hotspots", icons: [{ category: "Wi‑Fi Hotspots", icon: Coffee }] },
      { name: "Laundry Services", icons: [{ category: "Laundry Services", icon: ShoppingBag }] },
      { name: "Luggage Storage", icons: [{ category: "Luggage Storage", icon: ShoppingBag }] },
      { name: "Tour Operators", icons: [{ category: "Tour Operators", icon: Users }] },
    ],
  },
  {
    name: "Accommodation",
    categoryIcon: Bed,
    subcategories: [
      { name: "Hotels", icons: [{ category: "Hotels", icon: Bed }] },
      { name: "Camping", icons: [{ category: "Camping", icon: Tent }] },
    ],
  },
  {
    name: "Unique Experiences",
    categoryIcon: Sparkles,
    subcategories: [
      { name: "Hidden Gems", icons: [{ category: "Hidden Gems", icon: Diamond }] },
      { name: "Local Secrets", icons: [{ category: "Local Secrets", icon: Lightbulb }] },
      { name: "Panoramic Views", icons: [{ category: "Panoramic Views", icon: Camera }] },
      { name: "Street Art", icons: [{ category: "Street Art", icon: Camera }] },
      { name: "Historical Walks", icons: [{ category: "Historical Walks", icon: Book }] },
      { name: "Cooking Classes", icons: [{ category: "Cooking Classes", icon: Utensils }] },
      { name: "Wine Tasting", icons: [{ category: "Wine Tasting", icon: Wine }] },
      { name: "Live Music Venues", icons: [{ category: "Live Music Venues", icon: Music }] },
      { name: "Escape Rooms", icons: [{ category: "Escape Rooms", icon: Gamepad2 }] },
      { name: "Guided Tours", icons: [{ category: "Guided Tours", icon: Users }] },
    ],
  },
]
