export type RouteCategoryGroup = "art" | "historical" | "nature" | "urban" | "unique" | "food"

export interface RouteCategory {
  id: string
  name: string
  icon: string
  group: RouteCategoryGroup
}

export const routeCategories: RouteCategory[] = [
  // Art & Culture
  { id: "murals", name: "Murals", icon: "🎨", group: "art" },
  { id: "monuments", name: "Monuments", icon: "🗿", group: "art" },
  { id: "art-objects", name: "Art Objects", icon: "🎭", group: "art" },
  { id: "graffiti", name: "Graffiti", icon: "🖌️", group: "art" },
  { id: "contemporary-galleries", name: "Contemporary Art Galleries", icon: "🖼️", group: "art" },
  { id: "street-art", name: "Street Art", icon: "🎪", group: "art" },
  { id: "sculptures", name: "Sculptures", icon: "⚱️", group: "art" },
  { id: "installations", name: "Installations", icon: "🎯", group: "art" },

  // Historical & Cultural
  { id: "historical-sites", name: "Historical Sites", icon: "🏛️", group: "historical" },
  { id: "museums", name: "Museums", icon: "🏛️", group: "historical" },
  { id: "churches", name: "Churches & Temples", icon: "⛪", group: "historical" },
  { id: "castles", name: "Castles & Fortresses", icon: "🏰", group: "historical" },
  { id: "archaeological", name: "Archaeological Sites", icon: "🏺", group: "historical" },
  { id: "cultural-centers", name: "Cultural Centers", icon: "🎭", group: "historical" },

  // Nature & Outdoor
  { id: "parks", name: "Parks & Gardens", icon: "🌳", group: "nature" },
  { id: "viewpoints", name: "Scenic Viewpoints", icon: "🏔️", group: "nature" },
  { id: "beaches", name: "Beaches & Coastlines", icon: "🏖️", group: "nature" },
  { id: "waterfalls", name: "Waterfalls", icon: "💧", group: "nature" },
  { id: "hiking-trails", name: "Hiking Trails", icon: "🥾", group: "nature" },
  { id: "nature-reserves", name: "Nature Reserves", icon: "🦋", group: "nature" },

  // Urban & Modern
  { id: "architecture", name: "Modern Architecture", icon: "🏢", group: "urban" },
  { id: "shopping", name: "Shopping Districts", icon: "🛍️", group: "urban" },
  { id: "nightlife", name: "Nightlife & Entertainment", icon: "🌃", group: "urban" },
  { id: "markets", name: "Local Markets", icon: "🏪", group: "urban" },

  // Food & Drinks (new top-level group)
  // Keep the legacy id for compatibility and also add detailed subcategories
  { id: "food-scene", name: "Food & Drinks", icon: "🍔", group: "food" }, // legacy/general chip
  { id: "restaurants", name: "Restaurants", icon: "🍽️", group: "food" },
  { id: "cafes", name: "Cafes", icon: "☕", group: "food" },
  { id: "bakeries", name: "Bakeries", icon: "🥐", group: "food" },
  { id: "brunch", name: "Brunch", icon: "🥞", group: "food" },
  { id: "bars-pubs", name: "Bars & Pubs", icon: "🍺", group: "food" },
  { id: "street-food", name: "Street Food", icon: "🍢", group: "food" },
  { id: "fine-dining", name: "Fine Dining", icon: "🍷", group: "food" },
  { id: "desserts", name: "Desserts", icon: "🍰", group: "food" },
  { id: "coffee-roasters", name: "Coffee Roasters", icon: "🫘", group: "food" },
  { id: "wine-bars", name: "Wine Bars", icon: "🍷", group: "food" },
  { id: "craft-beer", name: "Craft Beer", icon: "🍻", group: "food" },
  { id: "food-markets", name: "Food Markets", icon: "🧺", group: "food" },
  { id: "vegan-vegetarian", name: "Vegan / Vegetarian", icon: "🥗", group: "food" },
  { id: "seafood", name: "Seafood", icon: "🦞", group: "food" },
  { id: "local-cuisine", name: "Local Cuisine", icon: "🍲", group: "food" },

  // Unique Experiences
  { id: "hidden-gems", name: "Hidden Gems", icon: "💎", group: "unique" },
  { id: "photo-spots", name: "Instagram-worthy Spots", icon: "📸", group: "unique" },
  { id: "local-life", name: "Local Life & Culture", icon: "🏘️", group: "unique" },
  { id: "festivals", name: "Festivals & Events", icon: "🎉", group: "unique" },
  { id: "workshops", name: "Workshops & Classes", icon: "🎓", group: "unique" },
  { id: "spiritual", name: "Spiritual & Meditation", icon: "🧘", group: "unique" },
]

export const getRouteCategory = (id: string) => {
  return routeCategories.find((category) => category.id === id)
}

export const getCategoriesByType = (type: RouteCategoryGroup) => {
  return routeCategories.filter((c) => c.group === type)
}
