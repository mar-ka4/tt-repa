"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import {
  Globe,
  ArrowLeft,
  Check,
  X,
  ExternalLink,
  User,
  Calendar,
  MapPin,
  FileSearch,
  Instagram,
  Twitter,
  Facebook,
  Music,
  ChevronLeft,
} from "lucide-react"
import UserMenu from "@/components/user-menu"

// Mock data for creator applications
const creatorApplications = [
  {
    id: 1,
    userId: "user123",
    nickname: "traveler_jane",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    submittedAt: "2023-05-15T10:30:00Z",
    bio: "Passionate traveler with 5 years of experience guiding tours across Europe. Specialized in historical and cultural experiences. My journey began when I studied abroad in Florence during college, where I fell in love with sharing the stories behind art and architecture. Since then, I've developed a methodology for creating immersive cultural experiences that go beyond the typical tourist attractions. I believe that the best way to experience a new place is through its history, art, food, and people. My routes are designed to provide a balanced experience that includes famous landmarks as well as hidden gems that only locals know about. I'm particularly interested in creating accessible routes that can be enjoyed by travelers of all ages and abilities. My background in art history and cultural anthropology has given me a unique perspective on how to connect travelers with the essence of a place. I'm fluent in English, Italian, French, and Spanish, which allows me to create deeply researched routes across multiple countries.",
    experience:
      "I've been a tour guide in Rome, Paris, and Barcelona for over 5 years, specializing in small group experiences that focus on cultural immersion. I have a Master's degree in Art History from the University of Florence and speak 4 languages fluently (English, Italian, French, and Spanish). Previously, I worked as a researcher at the Louvre Museum in Paris, where I developed educational programs for international visitors. This experience taught me how to make complex historical information accessible and engaging for diverse audiences. I've also collaborated with several boutique travel agencies to develop custom itineraries for their high-end clients, which has given me insight into creating premium travel experiences. In 2019, I received certification from the European Tour Operators Association for sustainable tourism practices. I regularly attend workshops and conferences on cultural heritage and tourism to stay updated on best practices and emerging trends in the industry. I've published several articles in travel magazines about off-the-beaten-path destinations in Europe and have been featured as a cultural tourism expert on several travel podcasts.",
    website: "https://janesmith-travels.com",
    socialLinks: {
      instagram: "@jane_travels",
      twitter: "@jane_explores",
      facebook: "jane.smith.travels",
      tiktok: "@jane_adventures",
    },
    status: "pending", // pending, approved, rejected
    avatar: "/abstract-profile-silhouette.png",
  },
  {
    id: 2,
    userId: "user456",
    nickname: "worldexplorer",
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    submittedAt: "2023-05-18T14:45:00Z",
    bio: "Adventure seeker and photographer with a passion for capturing the world's most breathtaking landscapes and hidden gems. I create unique routes that showcase extraordinary views and authentic cultural experiences. My journey as a travel photographer began 12 years ago when I quit my corporate job to backpack across Southeast Asia. What started as a six-month trip turned into a lifelong passion for exploration and visual storytelling. I've since traveled to over 50 countries across six continents, always seeking to go beyond the tourist trail to discover authentic experiences. My photography has been featured in National Geographic, Condé Nast Traveler, and Lonely Planet. I believe that the best travel experiences combine natural beauty, cultural authenticity, and a sense of adventure. My routes are designed to take travelers to photogenic locations at the optimal times of day for photography, while also immersing them in local culture and traditions. I'm particularly passionate about conservation and sustainable tourism, and I always include information about how travelers can minimize their environmental impact while supporting local communities.",
    experience:
      "I have over 10 years of experience traveling to more than 50 countries across six continents. My professional background includes work as a travel photographer with published work in major publications including National Geographic, Condé Nast Traveler, and Lonely Planet. I've led photography tours and workshops in Iceland, Patagonia, New Zealand, and throughout Southeast Asia, teaching travelers how to capture stunning landscape and cultural photography while respecting local customs and environments. I hold certifications in Wilderness First Response and have extensive experience in remote area travel planning and risk management. Before becoming a full-time travel photographer, I worked in digital marketing for a major adventure travel company, where I gained valuable insights into creating compelling travel experiences and content. I've collaborated with tourism boards in Norway, Chile, and New Zealand to develop specialized photography routes that highlight lesser-known natural wonders. In 2018, I published a coffee table book featuring my photography and travel stories from around the world, which sold over 25,000 copies. I've also developed and taught online courses on travel photography and route planning that have reached over 10,000 students globally. My technical expertise includes drone photography, time-lapse photography, and post-processing techniques that I incorporate into my route documentation.",
    website: "https://alexjohnson-photography.com",
    socialLinks: {
      instagram: "@alex_explores",
      twitter: "@alex_photos",
      facebook: "alex.johnson.photography",
      tiktok: "@alex_adventures",
    },
    status: "pending",
    avatar: "/profile-2.png",
  },
  {
    id: 3,
    userId: "user789",
    nickname: "foodie_traveler",
    fullName: "Maria Garcia",
    email: "maria.garcia@example.com",
    submittedAt: "2023-05-20T09:15:00Z",
    bio: "Culinary explorer creating food-focused travel routes that celebrate local gastronomy and food traditions around the world. I help travelers discover authentic local cuisine and the stories behind each dish. My passion for food and travel began in my grandmother's kitchen in Barcelona, where I learned that food is the heart of culture and community. After culinary school, I worked in restaurants across Europe and Asia, absorbing techniques and flavors that have influenced my approach to culinary tourism. I believe that food is the most direct way to experience a culture, and my routes are designed to connect travelers with authentic food experiences that reveal the history, traditions, and daily life of a destination. From street food tours to cooking classes with local families, wine tastings at small vineyards, and visits to food markets, my routes offer a comprehensive taste of each location. I'm particularly interested in preserving traditional food practices and supporting small-scale food producers. Each of my routes includes information about the cultural significance of different dishes and ingredients, as well as recommendations for sustainable food choices that support local communities. I also accommodate various dietary restrictions while still providing authentic experiences.",
    experience:
      "I'm a trained chef with over 7 years of experience working in restaurants across Asia and Europe, including stints at Michelin-starred establishments in Barcelona, Tokyo, and Paris. I've been running a successful food blog for 7 years with over 500,000 monthly visitors, where I document culinary traditions and share recipes from around the world. I hold a degree in Culinary Arts from the Culinary Institute of Barcelona and have completed specialized courses in food anthropology and the history of gastronomy. I've organized and led culinary tours in Spain, Italy, Japan, Thailand, and Mexico, focusing on connecting travelers with local food producers, chefs, and traditional cooking methods. In 2019, I published a cookbook featuring recipes and stories collected during my travels, which won the International Association of Culinary Professionals award for best international cookbook. I've been a guest speaker at several food and travel conferences, discussing topics such as sustainable food tourism and preserving culinary heritage. I've collaborated with several tourism boards to develop food-focused itineraries that highlight regional specialties and support local food economies. I'm fluent in Spanish, English, Italian, and have conversational skills in Japanese and Thai, which allows me to create deeply researched culinary routes across multiple countries and facilitate meaningful connections with local food communities.",
    website: "https://mariaeats.com",
    socialLinks: {
      instagram: "@maria_eats",
      twitter: "@maria_foodie",
      facebook: "maria.foodie",
      tiktok: "@maria_foodie",
    },
    status: "pending",
    avatar: "/abstract-profile-3.png",
  },
  {
    id: 4,
    userId: "user101",
    nickname: "hikingmaster",
    fullName: "David Lee",
    email: "david.lee@example.com",
    submittedAt: "2023-05-22T16:20:00Z",
    bio: "Hiking enthusiast and certified mountain guide specializing in trails and nature walks for all skill levels. My passion for the outdoors began during my childhood in Colorado, where I spent weekends exploring the Rocky Mountains with my family. This early exposure to nature sparked a lifelong love for hiking and outdoor adventure that has taken me to mountain ranges across the world. I believe that hiking is not just about reaching a destination, but about connecting with nature and experiencing the journey. My routes are carefully designed to showcase the most beautiful landscapes while ensuring safety and accessibility for different fitness levels. Each route includes detailed information about terrain, elevation, difficulty, seasonal considerations, and points of interest along the way. I'm particularly passionate about conservation and leave-no-trace principles, which I incorporate into all my route descriptions. I also focus on the educational aspects of hiking, including information about local flora, fauna, geology, and cultural history of the areas. Whether you're looking for a challenging summit climb, a moderate day hike with spectacular views, or an easy nature walk suitable for families, my routes offer authentic outdoor experiences that foster appreciation for the natural world.",
    experience:
      "I'm a certified mountain guide with 8 years of professional experience leading hiking groups in diverse terrains including the Alps, Rockies, Andes, and Himalayas. I hold certifications from the American Mountain Guides Association (AMGA), Wilderness First Responder (WFR), and Leave No Trace Master Educator. Before becoming a full-time guide, I worked as a park ranger in Yosemite National Park, where I gained extensive knowledge of wilderness management, conservation practices, and visitor education. I've completed notable treks including the entire Appalachian Trail, Pacific Crest Trail, Tour du Mont Blanc, Annapurna Circuit, and the W Trek in Patagonia. I've developed and implemented safety protocols for several outdoor education programs and adventure travel companies, focusing on risk assessment and emergency response in remote environments. I regularly contribute to hiking and outdoor publications, sharing route recommendations and safety tips for backcountry travel. I've also worked with conservation organizations to develop sustainable trail systems and promote responsible outdoor recreation. In 2020, I launched a popular YouTube channel featuring hiking guides and outdoor skills tutorials, which now has over 200,000 subscribers. I'm skilled in GPS navigation, weather forecasting, and wilderness survival techniques, all of which inform my detailed route planning and safety recommendations. I speak English, Spanish, and German, allowing me to create comprehensive hiking guides for mountain regions across North America and Europe.",
    website: "https://davidleehiking.com",
    socialLinks: {
      instagram: "@david_hikes",
      twitter: "@mountain_david",
      facebook: "david.lee.hiking",
      tiktok: "@david_trails",
    },
    status: "pending",
    avatar: "/profile-4.png",
  },
  {
    id: 5,
    userId: "user202",
    nickname: "city_wanderer",
    fullName: "Sophie Chen",
    email: "sophie.chen@example.com",
    submittedAt: "2023-05-25T11:30:00Z",
    bio: "Urban explorer focusing on architecture, street art, and city culture. My routes reveal the soul of each city beyond the typical tourist attractions. Growing up in a family of architects, I developed an early appreciation for urban design and how cities shape human experience. After completing my degree in urban planning, I began documenting my explorations of cities around the world, focusing on the intersection of history, architecture, art, and local culture. I believe that cities are living museums that tell stories through their buildings, streets, public spaces, and the people who inhabit them. My routes are designed to help travelers understand the evolution of a city and experience its authentic character through carefully curated walks that combine famous landmarks with hidden gems. I'm particularly interested in adaptive reuse of industrial spaces, street art as cultural expression, public transportation systems, urban green spaces, and local markets. Each of my routes includes historical context, architectural highlights, recommended cafes and shops owned by locals, and tips for engaging with the community. I strive to promote sustainable urban tourism that respects local residents while providing travelers with meaningful connections to the places they visit.",
    experience:
      "I hold a Master's degree in Urban Planning with a focus on historical preservation and public spaces from the University of California, Berkeley. I have 6 years of experience creating and leading specialized city tours in major metropolitan areas across North America, Europe, and Asia. Before focusing on urban exploration routes, I worked as a consultant for a city planning firm, where I contributed to revitalization projects for historic neighborhoods and post-industrial areas. This professional experience gave me unique insights into urban development and the factors that shape city identity. I've collaborated with several museums and cultural institutions to develop architectural walking tours, including partnerships with the Chicago Architecture Center, the Barcelona Design Museum, and the Tokyo Metropolitan Art Museum. I've been invited to speak at conferences on urban tourism and sustainable city development, sharing my methodology for creating immersive urban experiences. My writing on urban exploration and city culture has been published in Metropolis Magazine, Architectural Digest, and several travel publications. I've documented over 50 cities in depth, creating comprehensive guides that include historical research, architectural analysis, and cultural context. I maintain a popular blog and Instagram account focused on urban discovery, with a combined following of over 300,000. I'm fluent in English, Mandarin, and French, with conversational skills in Spanish and Japanese, allowing me to create deeply researched urban routes across multiple continents. I've also developed relationships with local architects, artists, and community leaders in many cities, which allows me to incorporate insider perspectives into my routes.",
    website: "https://sophiecitytours.com",
    socialLinks: {
      instagram: "@sophie_cities",
      twitter: "@sophie_urban",
      facebook: "sophie.urban.explorer",
      tiktok: "@sophie_cities",
    },
    status: "pending",
    avatar: "/profile-5.png",
  },
]

export default function CreatorApplicationsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [applications, setApplications] = useState(creatorApplications)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [bioExpanded, setBioExpanded] = useState(false)
  const [experienceExpanded, setExperienceExpanded] = useState(false)
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const details = getUserByNickname(user.nickname)
      if (details) {
        setUserDetails(details)

        // If user is not an admin, redirect to home
        if (!details.isAdmin) {
          router.push("/")
          return
        }
      }
    }

    setLoading(false)
  }, [isAuthenticated, user, router])

  const handleApprove = (id: number) => {
    setApplications(applications.map((app) => (app.id === id ? { ...app, status: "approved" } : app)))
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status: "approved" })
    }
  }

  const handleReject = (id: number) => {
    setApplications(applications.map((app) => (app.id === id ? { ...app, status: "rejected" } : app)))
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status: "rejected" })
    }
  }

  const handleSelectApplication = (application: any) => {
    setSelectedApplication(application)
    setBioExpanded(false)
    setExperienceExpanded(false)
    setShowMobileDetail(true)
  }

  const handleBackToList = () => {
    setShowMobileDetail(false)
    setSelectedApplication(null)
  }

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

      {/* Content */}
      <div className="max-w-[1300px] mx-auto px-4 pt-24">
        {/* Back button and title - Desktop */}
        <div className="mb-8 hidden md:block">
          <Link href="/admin-studio" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to Admin Studio</span>
          </Link>
          <h1 className="text-2xl font-medium">Creator Applications</h1>
          <p className="text-gray-400 mt-1">Review and manage creator applications</p>
        </div>

        {/* Mobile header */}
        <div className="mb-6 md:hidden">
          {showMobileDetail ? (
            <button onClick={handleBackToList} className="inline-flex items-center text-gray-400 hover:text-white mb-4">
              <ChevronLeft size={18} className="mr-2" />
              <span>Back to Applications</span>
            </button>
          ) : (
            <Link href="/admin-studio" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
              <ArrowLeft size={18} className="mr-2" />
              <span>Back to Admin Studio</span>
            </Link>
          )}
          <h1 className="text-xl font-medium">
            {showMobileDetail ? selectedApplication?.fullName : "Creator Applications"}
          </h1>
          {!showMobileDetail && <p className="text-gray-400 mt-1 text-sm">Review and manage applications</p>}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex">
          {/* Applications sidebar */}
          <div className="w-[350px] min-w-[350px] pr-4">
            <div className="space-y-3">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className={`bg-[#0c0c0e] rounded-xl border ${
                    selectedApplication?.id === application.id
                      ? "border-indigo-500"
                      : application.status === "approved"
                        ? "border-green-500"
                        : application.status === "rejected"
                          ? "border-red-500"
                          : "border-[#1a1a1a]"
                  } p-4 cursor-pointer hover:border-indigo-500 transition-colors`}
                  onClick={() => handleSelectApplication(application)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={application.avatar || "/placeholder.svg"}
                          alt={application.fullName}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{application.fullName}</h3>
                        <p className="text-sm text-gray-400">@{application.nickname}</p>
                      </div>
                    </div>
                    <div>
                      {application.status === "approved" ? (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Approved</span>
                      ) : application.status === "rejected" ? (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">Rejected</span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Pending</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-400">
                    <p className="line-clamp-2">{application.bio}</p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-[#1a1a1a] min-h-full"></div>

          {/* Application details */}
          <div className="flex-1 pl-6">
            {selectedApplication ? (
              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                      <Image
                        src={selectedApplication.avatar || "/placeholder.svg"}
                        alt={selectedApplication.fullName}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">{selectedApplication.fullName}</h2>
                      <p className="text-gray-400">@{selectedApplication.nickname}</p>
                    </div>
                  </div>
                  <div>
                    {selectedApplication.status === "approved" ? (
                      <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded-full">Approved</span>
                    ) : selectedApplication.status === "rejected" ? (
                      <span className="text-sm px-3 py-1 bg-red-500/20 text-red-400 rounded-full">Rejected</span>
                    ) : (
                      <span className="text-sm px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Pending</span>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Full Name</p>
                          <p>{selectedApplication.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Submitted</p>
                          <p>{new Date(selectedApplication.submittedAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p>{selectedApplication.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Bio</h3>
                    <div className="relative bg-[#0a0a0c] p-4 rounded-lg border border-[#1a1a1a]">
                      <p className={`text-gray-300 ${bioExpanded ? "" : "line-clamp-3"}`}>{selectedApplication.bio}</p>
                      {selectedApplication.bio.length > 150 && (
                        <button
                          onClick={() => setBioExpanded(!bioExpanded)}
                          className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 flex items-center"
                        >
                          {bioExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Experience</h3>
                    <div className="bg-[#0a0a0c] p-4 rounded-lg border border-[#1a1a1a]">
                      <p className={`text-gray-300 ${experienceExpanded ? "" : "line-clamp-3"}`}>
                        {selectedApplication.experience}
                      </p>
                      {selectedApplication.experience.length > 150 && (
                        <button
                          onClick={() => setExperienceExpanded(!experienceExpanded)}
                          className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 flex items-center"
                        >
                          {experienceExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Social Media</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedApplication.socialLinks).map(([platform, username]: [string, any]) => {
                        if (!username) return null

                        let icon
                        let platformName

                        switch (platform) {
                          case "instagram":
                            icon = <Instagram className="w-5 h-5 text-pink-400" />
                            platformName = "Instagram"
                            break
                          case "twitter":
                            icon = <Twitter className="w-5 h-5 text-blue-400" />
                            platformName = "Twitter"
                            break
                          case "facebook":
                            icon = <Facebook className="w-5 h-5 text-blue-600" />
                            platformName = "Facebook"
                            break
                          case "tiktok":
                            icon = <Music className="w-5 h-5 text-gray-200" />
                            platformName = "TikTok"
                            break
                          default:
                            icon = <Globe className="w-5 h-5 text-gray-400" />
                            platformName = platform.charAt(0).toUpperCase() + platform.slice(1)
                        }

                        return (
                          <div
                            key={platform}
                            className="flex items-center bg-[#0a0a0c] p-3 rounded-lg border border-[#1a1a1a]"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#18181c] flex items-center justify-center mr-3">
                              {icon}
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">{platformName}</p>
                              <a
                                href={
                                  username.startsWith("@")
                                    ? `https://${platform}.com/${username.substring(1)}`
                                    : username
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:underline flex items-center"
                              >
                                {username}
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    {selectedApplication.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReject(selectedApplication.id)}
                          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleApprove(selectedApplication.id)}
                          className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Approve
                        </button>
                      </>
                    )}
                    {selectedApplication.status === "approved" && (
                      <button
                        onClick={() => handleReject(selectedApplication.id)}
                        className="px-6 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Revoke Approval
                      </button>
                    )}
                    {selectedApplication.status === "rejected" && (
                      <button
                        onClick={() => handleApprove(selectedApplication.id)}
                        className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="mx-auto w-16 h-16 rounded-full bg-[#18181c] flex items-center justify-center mb-4">
                    <FileSearch className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select an Application</h3>
                  <p className="text-gray-400">
                    Choose an application from the list on the left to view details and take action
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {!showMobileDetail ? (
            /* Applications List - Mobile */
            <div className="space-y-3">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className={`bg-[#0c0c0e] rounded-xl border ${
                    application.status === "approved"
                      ? "border-green-500"
                      : application.status === "rejected"
                        ? "border-red-500"
                        : "border-[#1a1a1a]"
                  } p-4 cursor-pointer hover:border-indigo-500 transition-colors`}
                  onClick={() => handleSelectApplication(application)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <Image
                          src={application.avatar || "/placeholder.svg"}
                          alt={application.fullName}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base truncate">{application.fullName}</h3>
                        <p className="text-sm text-gray-400 truncate">@{application.nickname}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      {application.status === "approved" ? (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Approved</span>
                      ) : application.status === "rejected" ? (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">Rejected</span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Pending</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    <p className="line-clamp-2">{application.bio}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Application Details - Mobile */
            selectedApplication && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-1">
                      <div className="h-16 w-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <Image
                          src={selectedApplication.avatar || "/placeholder.svg"}
                          alt={selectedApplication.fullName}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-medium truncate">{selectedApplication.fullName}</h2>
                        <p className="text-gray-400 truncate">@{selectedApplication.nickname}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      {selectedApplication.status === "approved" ? (
                        <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded-full">Approved</span>
                      ) : selectedApplication.status === "rejected" ? (
                        <span className="text-sm px-3 py-1 bg-red-500/20 text-red-400 rounded-full">Rejected</span>
                      ) : (
                        <span className="text-sm px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Pending</span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons - Mobile */}
                  <div className="flex gap-3">
                    {selectedApplication.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReject(selectedApplication.id)}
                          className="flex-1 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                        >
                          <X className="w-5 h-5 mr-2" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(selectedApplication.id)}
                          className="flex-1 py-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center justify-center"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Approve
                        </button>
                      </>
                    )}
                    {selectedApplication.status === "approved" && (
                      <button
                        onClick={() => handleReject(selectedApplication.id)}
                        className="w-full py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Revoke Approval
                      </button>
                    )}
                    {selectedApplication.status === "rejected" && (
                      <button
                        onClick={() => handleApprove(selectedApplication.id)}
                        className="w-full py-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Approve
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-4">
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400">Full Name</p>
                        <p className="break-words">{selectedApplication.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400">Submitted</p>
                        <p className="break-words">{new Date(selectedApplication.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="break-all">{selectedApplication.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-4">
                  <h3 className="text-lg font-medium mb-4">Bio</h3>
                  <div className="bg-[#0a0a0c] p-4 rounded-lg border border-[#1a1a1a]">
                    <p className={`text-gray-300 ${bioExpanded ? "" : "line-clamp-3"}`}>{selectedApplication.bio}</p>
                    {selectedApplication.bio.length > 150 && (
                      <button
                        onClick={() => setBioExpanded(!bioExpanded)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 flex items-center"
                      >
                        {bioExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-4">
                  <h3 className="text-lg font-medium mb-4">Experience</h3>
                  <div className="bg-[#0a0a0c] p-4 rounded-lg border border-[#1a1a1a]">
                    <p className={`text-gray-300 ${experienceExpanded ? "" : "line-clamp-3"}`}>
                      {selectedApplication.experience}
                    </p>
                    {selectedApplication.experience.length > 150 && (
                      <button
                        onClick={() => setExperienceExpanded(!experienceExpanded)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 flex items-center"
                      >
                        {experienceExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-4">
                  <h3 className="text-lg font-medium mb-4">Social Media</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedApplication.socialLinks).map(([platform, username]: [string, any]) => {
                      if (!username) return null

                      let icon
                      let platformName

                      switch (platform) {
                        case "instagram":
                          icon = <Instagram className="w-5 h-5 text-pink-400" />
                          platformName = "Instagram"
                          break
                        case "twitter":
                          icon = <Twitter className="w-5 h-5 text-blue-400" />
                          platformName = "Twitter"
                          break
                        case "facebook":
                          icon = <Facebook className="w-5 h-5 text-blue-600" />
                          platformName = "Facebook"
                          break
                        case "tiktok":
                          icon = <Music className="w-5 h-5 text-gray-200" />
                          platformName = "TikTok"
                          break
                        default:
                          icon = <Globe className="w-5 h-5 text-gray-400" />
                          platformName = platform.charAt(0).toUpperCase() + platform.slice(1)
                      }

                      return (
                        <div
                          key={platform}
                          className="flex items-center bg-[#0a0a0c] p-3 rounded-lg border border-[#1a1a1a]"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#18181c] flex items-center justify-center mr-3 flex-shrink-0">
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-400">{platformName}</p>
                            <a
                              href={
                                username.startsWith("@") ? `https://${platform}.com/${username.substring(1)}` : username
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:underline flex items-center break-all"
                            >
                              {username}
                              <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  )
}
