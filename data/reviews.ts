export interface Review {
  id: number
  routeId: number
  author: string
  rating: number // 1-5
  comment: string
  date: string
}

export const reviews: Review[] = [
  // Berlin route reviews (routeId: 0)
  {
    id: 1,
    routeId: 0,
    author: "Alex_Wanderer",
    rating: 5,
    comment: "Amazing street art tour! The murals in Kreuzberg were absolutely stunning. Perfect route for art lovers.",
    date: "2024-01-15",
  },
  {
    id: 2,
    routeId: 0,
    author: "Sarah_Explorer",
    rating: 4,
    comment: "Great route with lots of interesting stops. Some areas felt a bit touristy but overall very enjoyable.",
    date: "2024-01-10",
  },
  {
    id: 3,
    routeId: 0,
    author: "Mike_Photographer",
    rating: 5,
    comment: "Perfect for photography enthusiasts! Every corner had something unique to capture. Highly recommended!",
    date: "2024-01-08",
  },
  {
    id: 4,
    routeId: 0,
    author: "Emma_Traveler",
    rating: 4,
    comment: "Well-planned route with good variety. The historical context provided was very informative.",
    date: "2024-01-05",
  },
  {
    id: 5,
    routeId: 0,
    author: "David_Culture",
    rating: 5,
    comment:
      "Incredible experience! The blend of history and modern art was fascinating. Will definitely do more routes.",
    date: "2024-01-03",
  },

  // Tokyo route reviews (routeId: 1)
  {
    id: 6,
    routeId: 1,
    author: "Yuki_Local",
    rating: 5,
    comment: "Authentic Tokyo experience! The traditional gardens were peaceful and the temples were breathtaking.",
    date: "2024-01-12",
  },
  {
    id: 7,
    routeId: 1,
    author: "Tom_Backpacker",
    rating: 4,
    comment: "Great cultural immersion. Some locations were crowded but that's expected in Tokyo. Worth it!",
    date: "2024-01-09",
  },
  {
    id: 8,
    routeId: 1,
    author: "Lisa_Foodie",
    rating: 5,
    comment: "Not just temples and gardens - discovered amazing local food spots along the way. Perfect combination!",
    date: "2024-01-07",
  },
  {
    id: 9,
    routeId: 1,
    author: "James_History",
    rating: 4,
    comment: "Rich historical content and beautiful architecture. The route timing was perfect for avoiding crowds.",
    date: "2024-01-04",
  },

  // Iceland route reviews (routeId: 2)
  {
    id: 10,
    routeId: 2,
    author: "Nordic_Explorer",
    rating: 5,
    comment: "Absolutely breathtaking! The waterfalls and geysers were incredible. Nature at its finest.",
    date: "2024-01-14",
  },
  {
    id: 11,
    routeId: 2,
    author: "Adventure_Seeker",
    rating: 5,
    comment: "Epic adventure! The landscapes were otherworldly. Best route I've ever done.",
    date: "2024-01-11",
  },
  {
    id: 12,
    routeId: 2,
    author: "Nature_Lover",
    rating: 4,
    comment: "Stunning natural beauty everywhere. Weather can be unpredictable so come prepared!",
    date: "2024-01-06",
  },

  // London route reviews (routeId: 3)
  {
    id: 13,
    routeId: 3,
    author: "British_Guide",
    rating: 4,
    comment: "Classic London experience with all the must-see monuments. Well-organized and informative.",
    date: "2024-01-13",
  },
  {
    id: 14,
    routeId: 3,
    author: "Culture_Enthusiast",
    rating: 5,
    comment: "Perfect blend of history and culture. The royal parks were a lovely addition to the route.",
    date: "2024-01-02",
  },

  // Venice route reviews (routeId: 4)
  {
    id: 15,
    routeId: 4,
    author: "Italian_Lover",
    rating: 5,
    comment: "Magical Venice experience! The canals and architecture were absolutely stunning. Unforgettable!",
    date: "2024-01-01",
  },
  {
    id: 16,
    routeId: 4,
    author: "Romantic_Traveler",
    rating: 4,
    comment: "Beautiful route through Venice's most iconic spots. Can get crowded but still worth every moment.",
    date: "2023-12-28",
  },
]

// Helper functions
export const getReviewsForRoute = (routeId: number): Review[] => {
  return reviews.filter((review) => review.routeId === routeId)
}

export const getAverageRating = (routeId: number): number => {
  const routeReviews = getReviewsForRoute(routeId)
  if (routeReviews.length === 0) return 0

  const totalRating = routeReviews.reduce((sum, review) => sum + review.rating, 0)
  return Math.round((totalRating / routeReviews.length) * 10) / 10 // Round to 1 decimal place
}

export const getReviewCount = (routeId: number): number => {
  return getReviewsForRoute(routeId).length
}
