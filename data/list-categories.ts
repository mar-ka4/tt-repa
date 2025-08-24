import type React from "react"
import { Utensils, Camera, TreePine, Building, Mountain, Users, ShoppingBag, Music, Gamepad2, Coffee, Landmark, Castle, Church, LibraryIcon as Museum, Store, Sparkles, Lightbulb, Shield, Gift, Diamond, Clock, Anchor, LifeBuoy, Accessibility, Baby, Book, Info, DollarSign, Send, Wine, GlassWaterIcon as Water } from 'lucide-react'

export interface ListCategory {
  id: string
  name: string
  icon: string // Using string for emoji icons
  subcategories: {
    id: string
    name: string
    icon: React.ElementType // Lucide React icon component
  }[]
}

export const listCategories: ListCategory[] = [
  {
    id: "food-drink",
    name: "Food & Drink",
    icon: "🍔",
    subcategories: [
      { id: "restaurants", name: "Restaurants", icon: Utensils },
      { id: "cafes", name: "Cafes", icon: Coffee },
      { id: "coffee-shops", name: "Coffee", icon: Coffee },
      { id: "bars-pubs", name: "Bars & Pubs", icon: Music }, // Combined "Pubs" and "Bars"
      { id: "street-food", name: "Street Food", icon: Utensils },
      { id: "bakeries", name: "Bakeries", icon: Utensils },
      { id: "branch", name: "Branch", icon: Utensils },
    ],
  },
  {
    id: "photo-locations",
    name: "Photo Locations",
    icon: "📸",
    subcategories: [],
  },
  {
    id: "attractions",
    name: "Attractions",
    icon: "🏛️",
    subcategories: [
      { id: "museums", name: "Museums", icon: Museum },
      { id: "historical-sites", name: "Historical Sites", icon: Building },
      { id: "landmarks", name: "Landmarks", icon: Landmark },
      { id: "art-galleries", name: "Art Galleries", icon: Camera },
      { id: "theaters", name: "Theaters", icon: Music },
      { id: "parks-gardens", name: "Parks & Gardens", icon: TreePine },
      { id: "zoos-aquariums", name: "Zoos & Aquariums", icon: Baby },
      { id: "amusement-parks", name: "Amusement Parks", icon: Gamepad2 },
      { id: "churches-cathedrals", name: "Churches & Cathedrals", icon: Church },
      { id: "castles-palaces", name: "Castles & Palaces", icon: Castle },
    ],
  },
  {
    id: "nature-outdoors",
    name: "Nature & Outdoors",
    icon: "🌳",
    subcategories: [
      { id: "mountains", name: "Mountains", icon: Mountain },
      { id: "lakes", name: "Lakes", icon: Water },
      { id: "rivers", name: "Rivers", icon: Water },
      { id: "forests", name: "Forests", icon: TreePine },
      { id: "beaches", name: "Beaches", icon: Anchor },
      { id: "hiking-trails", name: "Hiking Trails", icon: Mountain },
      { id: "national-parks", name: "National Parks", icon: TreePine },
      { id: "caves", name: "Caves", icon: Mountain },
      { id: "valleys", name: "Valleys", icon: Mountain },
      { id: "cliffs", name: "Cliffs", icon: Mountain },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛍️",
    subcategories: [
      { id: "boutiques", name: "Boutiques", icon: ShoppingBag },
      { id: "malls", name: "Shopping Malls", icon: Store },
      { id: "local-markets", name: "Local Markets", icon: ShoppingBag },
      { id: "souvenir-shops", name: "Souvenir Shops", icon: Gift },
      { id: "bookstores", name: "Bookstores", icon: Book },
      { id: "antique-shops", name: "Antique Shops", icon: Clock },
      { id: "fashion", name: "Fashion", icon: ShoppingBag },
      { id: "electronics", name: "Electronics", icon: Gamepad2 },
      { id: "jewelry", name: "Jewelry", icon: Diamond },
      { id: "craft-shops", name: "Craft Shops", icon: Sparkles },
    ],
  },
  {
    id: "services",
    name: "Services",
    icon: "ℹ️",
    subcategories: [
      { id: "info-centers", name: "Information Centers", icon: Info },
      { id: "atms-banks", name: "ATMs & Banks", icon: DollarSign },
      { id: "post-offices", name: "Post Offices", icon: Send },
      { id: "hospitals-clinics", name: "Hospitals & Clinics", icon: LifeBuoy },
      { id: "police-stations", name: "Police Stations", icon: Shield },
      { id: "restrooms", name: "Public Restrooms", icon: Accessibility },
      { id: "wifi-hotspots", name: "WiFi Hotspots", icon: Coffee },
      { id: "laundry-services", name: "Laundry Services", icon: ShoppingBag },
      { id: "luggage-storage", name: "Luggage Storage", icon: ShoppingBag },
      { id: "tour-operators", name: "Tour Operators", icon: Users },
    ],
  },
  {
    id: "unique-experiences",
    name: "Unique Experiences",
    icon: "✨",
    subcategories: [
      { id: "hidden-gems", name: "Hidden Gems", icon: Diamond },
      { id: "local-secrets", name: "Local Secrets", icon: Lightbulb },
      { id: "panoramic-views", name: "Panoramic Views", icon: Camera },
      { id: "street-art", name: "Street Art", icon: Camera },
      { id: "historical-walks", name: "Historical Walks", icon: Book },
      { id: "cooking-classes", name: "Cooking Classes", icon: Utensils },
      { id: "wine-tasting", name: "Wine Tasting", icon: Wine },
      { id: "live-music-venues", name: "Live Music Venues", icon: Music },
      { id: "escape-rooms", name: "Escape Rooms", icon: Gamepad2 },
      { id: "guided-tours", name: "Guided Tours", icon: Users },
    ],
  },
]

export const getListCategory = (id: string): ListCategory | undefined => {
  return listCategories.find((category) => category.id === id)
}
