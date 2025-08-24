"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import {
  Globe,
  Book,
  FileText,
  Video,
  Download,
  Users,
  MessageSquare,
  Search,
  ExternalLink,
  Star,
  TrendingUp,
  DollarSign,
  Camera,
  Map,
  Clock,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Youtube,
  Award,
  ThumbsUp,
} from "lucide-react"
import UserMenu from "@/components/user-menu"

export default function CreatorResourcesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("guides")

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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const featuredGuides = [
    {
      title: "Creating Your First Route",
      description: "Learn the basics of crafting a compelling travel route that travelers will love.",
      icon: <Map size={20} />,
      type: "Guide",
      minutesToRead: 8,
      link: "/creator-resources/first-route",
    },
    {
      title: "Photography Tips for Routes",
      description: "Capture stunning images that showcase the best of your route locations.",
      icon: <Camera size={20} />,
      type: "Tutorial",
      minutesToRead: 12,
      link: "/creator-resources/photography",
    },
    {
      title: "Pricing Strategies",
      description: "Find the optimal price point for your routes to maximize both sales and revenue.",
      icon: <DollarSign size={20} />,
      type: "Guide",
      minutesToRead: 10,
      link: "/creator-resources/pricing",
    },
    {
      title: "Growing Your Creator Brand",
      description: "Build a recognizable brand that attracts a loyal following.",
      icon: <TrendingUp size={20} />,
      type: "Guide",
      minutesToRead: 15,
      link: "/creator-resources/branding",
    },
  ]

  const allResources = [
    // Getting Started
    {
      category: "getting-started",
      title: "Creator Verification Process",
      description: "A step-by-step walkthrough of becoming a verified route creator",
      type: "Guide",
      minutesToRead: 5,
      icon: <Award size={20} />,
    },
    {
      category: "getting-started",
      title: "Creator Studio Overview",
      description: "Learn to navigate and use all the tools in Creator Studio",
      type: "Video",
      minutesToWatch: 8,
      icon: <Video size={20} />,
    },
    {
      category: "getting-started",
      title: "Creator Account Settings",
      description: "Set up your payment details, profile, and account preferences",
      type: "Guide",
      minutesToRead: 7,
      icon: <FileText size={20} />,
    },

    // Creating Routes
    {
      category: "creating-routes",
      title: "Route Structure Best Practices",
      description: "Learn how to organize landmarks and points of interest effectively",
      type: "Guide",
      minutesToRead: 12,
      icon: <Map size={20} />,
    },
    {
      category: "creating-routes",
      title: "Writing Compelling Descriptions",
      description: "Craft descriptions that engage and excite potential travelers",
      type: "Tutorial",
      minutesToRead: 10,
      icon: <Book size={20} />,
    },
    {
      category: "creating-routes",
      title: "Selecting Route Difficulty Levels",
      description: "Guidelines for accurately categorizing your route's difficulty",
      type: "Guide",
      minutesToRead: 6,
      icon: <FileText size={20} />,
    },
    {
      category: "creating-routes",
      title: "Route Photography Masterclass",
      description: "Professional tips for stunning route photos, even with smartphone cameras",
      type: "Video",
      minutesToWatch: 15,
      icon: <Camera size={20} />,
    },

    // Growing Your Business
    {
      category: "growing-business",
      title: "Marketing Your Routes",
      description: "Strategies to promote your routes both on and off the platform",
      type: "Guide",
      minutesToRead: 14,
      icon: <TrendingUp size={20} />,
    },
    {
      category: "growing-business",
      title: "Understanding Analytics",
      description: "How to interpret your route performance data to make better decisions",
      type: "Tutorial",
      minutesToRead: 11,
      icon: <FileText size={20} />,
    },
    {
      category: "growing-business",
      title: "Seasonal Route Strategy",
      description: "Optimize your route portfolio based on seasonal travel trends",
      type: "Guide",
      minutesToRead: 9,
      icon: <Clock size={20} />,
    },
    {
      category: "growing-business",
      title: "Creator Success Stories",
      description: "Learn from top creators sharing their journey and best practices",
      type: "Video",
      minutesToWatch: 22,
      icon: <ThumbsUp size={20} />,
    },

    // Community
    {
      category: "community",
      title: "Responding to Traveler Feedback",
      description: "How to effectively handle reviews and improve your routes",
      type: "Guide",
      minutesToRead: 8,
      icon: <MessageSquare size={20} />,
    },
    {
      category: "community",
      title: "Creator Community Guidelines",
      description: "Best practices for participating in our creator community",
      type: "Guide",
      minutesToRead: 6,
      icon: <Users size={20} />,
    },
    {
      category: "community",
      title: "Creator Meetups and Events",
      description: "Information about upcoming creator-focused events and networking opportunities",
      type: "Guide",
      minutesToRead: 5,
      icon: <Users size={20} />,
    },
  ]

  const filteredResources = allResources.filter((resource) => {
    if (activeTab !== "all" && resource.category !== activeTab) return false
    if (searchQuery === "") return true

    return (
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const faqItems = [
    {
      question: "How long does the creator verification process take?",
      answer:
        "The verification process typically takes 3-5 business days. We'll review your submitted information and notify you by email once your creator status is approved.",
    },
    {
      question: "How many images should I include in a route?",
      answer:
        "We recommend 6-12 high-quality images per route. Each landmark should have at least one dedicated image, and you should include overview shots that give travelers a sense of the overall experience.",
    },
    {
      question: "Can I edit a route after it's published?",
      answer:
        "Yes, you can edit routes after publication. Updates to descriptions and details are applied immediately, while changes to pricing or route structure will be reviewed before going live.",
    },
    {
      question: "How is my revenue share calculated?",
      answer:
        "Revenue share is based on your creator level and is calculated on the net price of your route (after any platform discounts or promotions). Payments are processed according to your level's schedule (monthly, bi-weekly, or weekly).",
    },
    {
      question: "What types of routes perform best on the platform?",
      answer:
        "Routes with unique perspectives, detailed guidance, and high-quality photos tend to perform best. Travelers particularly value insider knowledge and access to hidden gems that aren't easily found in standard guidebooks.",
    },
  ]

  const downloadableResources = [
    {
      title: "Route Creator Checklist",
      description: "A comprehensive checklist to ensure your route is complete before publishing",
      fileType: "PDF",
      fileSize: "1.2 MB",
    },
    {
      title: "Photo Composition Guide",
      description: "Visual guide to taking better travel photographs for your routes",
      fileType: "PDF",
      fileSize: "3.5 MB",
    },
    {
      title: "Route Description Template",
      description: "Template with prompts to help create engaging route descriptions",
      fileType: "DOCX",
      fileSize: "843 KB",
    },
    {
      title: "Landmark Planning Worksheet",
      description: "Structured worksheet for planning your route's landmarks and sequence",
      fileType: "PDF",
      fileSize: "1.1 MB",
    },
  ]

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
            <span className="text-white">Resources</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-medium">Creator Resources</h1>
          <p className="text-gray-400 mt-2">
            Guides, tutorials, and resources to help you create amazing routes and grow your creator business
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full py-3 pl-12 pr-4 bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Featured Resources Section */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-6">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGuides.map((guide, index) => (
              <div
                key={index}
                className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center mb-1">
                  <span className="text-xs px-2 py-0.5 bg-[#18181c] rounded text-gray-400 mr-2">{guide.type}</span>
                  <span className="text-xs text-gray-500">{guide.minutesToRead} min read</span>
                </div>
                <h3 className="font-medium mb-1">{guide.title}</h3>
                <p className="text-sm text-gray-400">{guide.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Tabs Section */}
        <section>
          <div className="border-b border-[#1a1a1a] mb-8">
            <div className="flex overflow-x-auto space-x-6 pb-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center pb-2 whitespace-nowrap ${
                  activeTab === "all" ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-white"
                }`}
              >
                <Book className="mr-2" size={16} />
                All Resources
              </button>
              <button
                onClick={() => setActiveTab("getting-started")}
                className={`flex items-center pb-2 whitespace-nowrap ${
                  activeTab === "getting-started"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <BookOpen className="mr-2" size={16} />
                Getting Started
              </button>
              <button
                onClick={() => setActiveTab("creating-routes")}
                className={`flex items-center pb-2 whitespace-nowrap ${
                  activeTab === "creating-routes"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Map className="mr-2" size={16} />
                Creating Routes
              </button>
              <button
                onClick={() => setActiveTab("growing-business")}
                className={`flex items-center pb-2 whitespace-nowrap ${
                  activeTab === "growing-business"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <TrendingUp className="mr-2" size={16} />
                Growing Your Business
              </button>
              <button
                onClick={() => setActiveTab("community")}
                className={`flex items-center pb-2 whitespace-nowrap ${
                  activeTab === "community"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Users className="mr-2" size={16} />
                Community
              </button>
            </div>
          </div>

          {/* Resource Cards */}
          <div className="mb-12">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <div
                    key={index}
                    className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5 hover:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center">
                        <div className="text-indigo-400">{resource.icon}</div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs px-2 py-0.5 bg-[#18181c] rounded text-gray-400 mr-2">
                          {resource.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {resource.type === "Video"
                            ? `${resource.minutesToWatch} min watch`
                            : `${resource.minutesToRead} min read`}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-medium mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-400">{resource.description}</p>
                    <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex justify-between items-center">
                      <span className="text-xs text-purple-400 uppercase font-medium">
                        {resource.type === "Video" ? "Watch now" : "Read more"}
                      </span>
                      <ChevronRight size={16} className="text-purple-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-8 text-center">
                <HelpCircle size={40} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-gray-400 mb-4">We couldn't find any resources matching your search criteria.</p>
                <button
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveTab("all")
                  }}
                >
                  Clear search and show all resources
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Downloadable Resources Section */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-6">Downloadable Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {downloadableResources.map((resource, index) => (
              <div
                key={index}
                className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5 hover:border-indigo-500 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-3 mx-auto">
                  <Download size={24} className="text-indigo-400" />
                </div>
                <h3 className="font-medium mb-2 text-center">{resource.title}</h3>
                <p className="text-sm text-gray-400 mb-3 text-center">{resource.description}</p>
                <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-[#1a1a1a]">
                  <span>{resource.fileType}</span>
                  <span>{resource.fileSize}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Video Tutorials</h2>
            <Link
              href="/creator-resources/videos"
              className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
            >
              View all videos <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] overflow-hidden">
              <div className="aspect-video relative bg-[#0c0c0e] flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/travel-route-dashboard-tutorial.png"
                    alt="Video thumbnail"
                    width={640}
                    height={360}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-purple-600/90 flex items-center justify-center">
                      <Youtube size={30} className="text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">Creator Dashboard Overview</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Learn to navigate and use the creator dashboard effectively
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>8:24</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] overflow-hidden">
              <div className="aspect-video relative bg-[#0c0c0e] flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/travel-photography-routes.png"
                    alt="Video thumbnail"
                    width={640}
                    height={360}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-purple-600/90 flex items-center justify-center">
                      <Youtube size={30} className="text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">Route Photography Tips</h3>
                <p className="text-sm text-gray-400 mb-2">Capture stunning photos for your travel routes</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>12:45</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] overflow-hidden">
              <div className="aspect-video relative bg-[#0c0c0e] flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/online-travel-marketing.png"
                    alt="Video thumbnail"
                    width={640}
                    height={360}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-purple-600/90 flex items-center justify-center">
                      <Youtube size={30} className="text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">Marketing Your Routes</h3>
                <p className="text-sm text-gray-400 mb-2">Strategies to promote and sell more routes</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>15:37</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Success Story */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-6">Creator Success Story</h2>
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border border-purple-500/20 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="rounded-xl overflow-hidden aspect-square">
                  <Image
                    src="/placeholder.svg?key=8nusg"
                    alt="Creator profile"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    <Star size={16} className="text-white" />
                  </div>
                  <h3 className="text-lg font-medium">Meet Alice, Level 3 Creator</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  "I started creating routes for my home city as a side project, and within a year it became my
                  full-time business. The key was focusing on unique experiences that visitors wouldn't find elsewhere,
                  and taking time to include highly detailed descriptions and professional photos."
                </p>
                <p className="text-gray-300 mb-6">
                  "My most successful route took me two weeks to research and create, but it's been purchased over 5,000
                  times and has a 4.9-star rating. The effort you put in upfront really pays off in the long run."
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#18181c] rounded-lg p-3 text-center">
                    <div className="text-xl font-medium text-purple-400">35+</div>
                    <div className="text-xs text-gray-400">Routes Created</div>
                  </div>
                  <div className="bg-[#18181c] rounded-lg p-3 text-center">
                    <div className="text-xl font-medium text-purple-400">21k+</div>
                    <div className="text-xs text-gray-400">Total Sales</div>
                  </div>
                  <div className="bg-[#18181c] rounded-lg p-3 text-center">
                    <div className="text-xl font-medium text-purple-400">4.8</div>
                    <div className="text-xs text-gray-400">Average Rating</div>
                  </div>
                </div>
                <Link
                  href="/creator-resources/success-stories"
                  className="text-purple-400 hover:text-purple-300 flex items-center"
                >
                  Read Alice's full story <ExternalLink size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-6 flex items-center">
            <HelpCircle size={20} className="text-purple-400 mr-2" />
            Frequently Asked Questions
          </h2>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className={index !== 0 ? "pt-6 border-t border-[#1a1a1a]" : ""}>
                <h3 className="font-medium mb-2">{item.question}</h3>
                <p className="text-gray-400">{item.answer}</p>
              </div>
            ))}

            <div className="pt-6 border-t border-[#1a1a1a]">
              <p className="text-gray-400">
                Have more questions?{" "}
                <Link href="/creator-support" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Contact creator support
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Community & Support Section */}
        <section>
          <h2 className="text-xl font-medium mb-6">Community & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
              <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
                <Users size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Creator Community</h3>
              <p className="text-gray-400 mb-4">
                Connect with other creators, share tips, and get inspired by joining our active creator community.
              </p>
              <Link
                href="/creator-community"
                className="inline-flex items-center text-purple-400 hover:text-purple-300"
              >
                Join the community <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
              <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Creator Support</h3>
              <p className="text-gray-400 mb-4">
                Need help with your creator account or have questions? Our support team is here to help.
              </p>
              <Link href="/creator-support" className="inline-flex items-center text-purple-400 hover:text-purple-300">
                Contact support <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
