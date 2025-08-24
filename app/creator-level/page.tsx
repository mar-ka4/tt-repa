"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import {
  Globe,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Clock,
  Zap,
  Check,
  HelpCircle,
  ArrowRight,
  BarChart2,
  Shield,
  Gift,
  Headphones,
  Briefcase,
} from "lucide-react"
import UserMenu from "@/components/user-menu"

export default function CreatorLevelPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)

  // Mock data for creator level
  const [creatorStats, setCreatorStats] = useState({
    currentLevel: 1,
    progress: 75, // percentage to next level
    totalRoutes: 8,
    totalSales: 124,
    totalEarnings: 1240,
    averageRating: 4.7,
    requiredForNextLevel: {
      routes: 10,
      sales: 150,
      rating: 4.5,
    },
  })

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

  // Level details
  const levels = [
    {
      level: 1,
      name: "Explorer",
      revenueShare: "50%",
      requirements: "Get verified as a creator",
      benefits: ["50% revenue share", "Basic analytics", "Standard support", "Community access"],
      color: "from-indigo-400 to-purple-500",
    },
    {
      level: 2,
      name: "Pathfinder",
      revenueShare: "60%",
      requirements: "10+ routes, 150+ sales, 4.5+ rating",
      benefits: [
        "60% revenue share",
        "Advanced analytics",
        "Priority support",
        "Featured in collections",
        "Early access to new features",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      level: 3,
      name: "Trailblazer",
      revenueShare: "75%",
      requirements: "25+ routes, 500+ sales, 4.7+ rating",
      benefits: [
        "75% revenue share",
        "Premium analytics",
        "Dedicated support manager",
        "Homepage features",
        "Custom branding options",
        "Exclusive creator events",
        "Co-marketing opportunities",
      ],
      color: "from-pink-500 to-rose-500",
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
            <span className="text-white">Creator Level</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-medium">Creator Level</h1>
          <p className="text-gray-400 mt-2">
            Unlock more benefits and higher revenue share as you level up your creator status
          </p>
        </div>

        {/* Current Level Card */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border border-purple-500/20 p-6 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Award size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-medium">
                    Level {creatorStats.currentLevel}: {levels[creatorStats.currentLevel - 1].name}
                  </h2>
                  <p className="text-purple-300">
                    Current revenue share: {levels[creatorStats.currentLevel - 1].revenueShare}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-4">
                You're {creatorStats.progress}% of the way to Level{" "}
                {creatorStats.currentLevel < 3 ? creatorStats.currentLevel + 1 : "Max"}
                {creatorStats.currentLevel < 3 ? `: ${levels[creatorStats.currentLevel].name}` : ""}
              </p>
            </div>

            {creatorStats.currentLevel < 3 && (
              <Link
                href="#level-requirements"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors text-white font-medium"
              >
                How to Level Up
              </Link>
            )}
          </div>

          {/* Progress bar */}
          {creatorStats.currentLevel < 3 && (
            <div className="mt-4">
              <div className="w-full h-3 bg-[#18181c] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${levels[creatorStats.currentLevel - 1].color} rounded-full`}
                  style={{ width: `${creatorStats.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>
                  Level {creatorStats.currentLevel}: {levels[creatorStats.currentLevel - 1].name}
                </span>
                <span>
                  Level {creatorStats.currentLevel + 1}: {levels[creatorStats.currentLevel].name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center">
                <TrendingUp size={20} className="text-indigo-400" />
              </div>
              <span className="text-gray-400">Total Routes</span>
            </div>
            <div className="text-2xl font-medium">{creatorStats.totalRoutes}</div>
            {creatorStats.currentLevel < 3 && (
              <div className="mt-2 text-sm text-gray-500">
                <span className="text-purple-400">
                  {creatorStats.requiredForNextLevel.routes - creatorStats.totalRoutes} more
                </span>{" "}
                for next level
              </div>
            )}
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center">
                <Users size={20} className="text-indigo-400" />
              </div>
              <span className="text-gray-400">Total Sales</span>
            </div>
            <div className="text-2xl font-medium">{creatorStats.totalSales}</div>
            {creatorStats.currentLevel < 3 && (
              <div className="mt-2 text-sm text-gray-500">
                <span className="text-purple-400">
                  {creatorStats.requiredForNextLevel.sales - creatorStats.totalSales} more
                </span>{" "}
                for next level
              </div>
            )}
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center">
                <DollarSign size={20} className="text-indigo-400" />
              </div>
              <span className="text-gray-400">Total Earnings</span>
            </div>
            <div className="text-2xl font-medium">${creatorStats.totalEarnings}</div>
            <div className="mt-2 text-sm text-gray-500">Lifetime earnings</div>
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center">
                <Star size={20} className="text-indigo-400" />
              </div>
              <span className="text-gray-400">Average Rating</span>
            </div>
            <div className="text-2xl font-medium">{creatorStats.averageRating}</div>
            {creatorStats.currentLevel < 3 && (
              <div className="mt-2 text-sm text-gray-500">
                <span
                  className={
                    creatorStats.averageRating >= creatorStats.requiredForNextLevel.rating
                      ? "text-green-400"
                      : "text-purple-400"
                  }
                >
                  {creatorStats.averageRating >= creatorStats.requiredForNextLevel.rating ? "Meets" : "Needs"}{" "}
                  {creatorStats.requiredForNextLevel.rating}+
                </span>{" "}
                for next level
              </div>
            )}
          </div>
        </div>

        {/* Level Requirements */}
        <div id="level-requirements" className="scroll-mt-24">
          <h2 className="text-xl font-medium mb-6">Level Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {levels.map((level) => (
              <div
                key={level.level}
                className={`bg-[#0c0c0e] rounded-xl border ${creatorStats.currentLevel === level.level ? "border-purple-500" : "border-[#1a1a1a]"} p-6 relative`}
              >
                {creatorStats.currentLevel === level.level && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                    Current Level
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}
                  >
                    <span className="text-white font-medium">{level.level}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{level.name}</h3>
                    <p className="text-purple-300 text-sm">{level.revenueShare} revenue share</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">Requirements:</h4>
                  <p>{level.requirements}</p>
                </div>

                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Benefits:</h4>
                  <ul className="space-y-2">
                    {level.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips to Level Up */}
        {creatorStats.currentLevel < 3 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/20 p-6 mb-10">
            <h2 className="text-xl font-medium mb-4 flex items-center">
              <Zap size={20} className="text-purple-400 mr-2" />
              Tips to Reach Level {creatorStats.currentLevel + 1}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mr-4 flex-shrink-0">
                  <TrendingUp size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Create More Quality Routes</h3>
                  <p className="text-gray-400">
                    Focus on creating unique, high-quality routes with detailed descriptions and beautiful photos.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mr-4 flex-shrink-0">
                  <Star size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Improve Your Ratings</h3>
                  <p className="text-gray-400">
                    Respond to feedback and continuously improve your routes based on user comments.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mr-4 flex-shrink-0">
                  <Users size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Promote Your Routes</h3>
                  <p className="text-gray-400">
                    Share your routes on social media and engage with the traveler community to increase sales.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Be Consistent</h3>
                  <p className="text-gray-400">
                    Regularly publish new routes and keep your existing ones updated with fresh information.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/creator-resources"
                className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                View more resources for creators
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        )}

        {/* Benefits Highlight */}
        <h2 className="text-xl font-medium mb-6">Key Benefits of Higher Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <DollarSign size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Higher Revenue Share</h3>
            <p className="text-gray-400">
              Earn up to 75% of the revenue from your route sales as you reach higher levels.
            </p>
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <BarChart2 size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
            <p className="text-gray-400">
              Gain deeper insights into your route performance and user behavior with premium analytics.
            </p>
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Shield size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Featured Placement</h3>
            <p className="text-gray-400">
              Get your routes featured prominently on the platform, increasing visibility and sales.
            </p>
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Headphones size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Priority Support</h3>
            <p className="text-gray-400">
              Receive faster and more personalized support as you level up, including a dedicated manager at Level 3.
            </p>
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Briefcase size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Custom Branding</h3>
            <p className="text-gray-400">
              Level 3 creators can customize their profile with unique branding elements and personalization.
            </p>
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Gift size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Exclusive Events</h3>
            <p className="text-gray-400">
              Join exclusive creator events and gain co-marketing opportunities at the highest level.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 mb-10">
          <h2 className="text-xl font-medium mb-6 flex items-center">
            <HelpCircle size={20} className="text-purple-400 mr-2" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">How often are creator levels evaluated?</h3>
              <p className="text-gray-400">
                Creator levels are evaluated at the beginning of each month based on your performance over the previous
                3 months.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Can my level be downgraded?</h3>
              <p className="text-gray-400">
                Yes, if your metrics fall below the requirements for your current level for 3 consecutive months, your
                level may be adjusted. We'll notify you in advance if you're at risk.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">How are route sales counted?</h3>
              <p className="text-gray-400">
                Each unique purchase of your route counts as one sale. Bundle sales are counted proportionally based on
                the number of routes in the bundle.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">What happens to my existing routes if my level changes?</h3>
              <p className="text-gray-400">
                Your existing routes remain published regardless of level changes. Revenue share adjustments apply to
                all sales made after your level change.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
            <p className="text-gray-400">
              Have more questions?{" "}
              <Link href="/creator-support" className="text-purple-400 hover:text-purple-300 transition-colors">
                Contact creator support
              </Link>
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border border-purple-500/20 p-8 text-center">
          <h2 className="text-xl font-medium mb-3">Ready to Level Up Your Creator Journey?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Create more high-quality routes, engage with travelers, and watch your creator status grow along with your
            earnings.
          </p>
          <Link
            href="/create-route"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors text-white font-medium"
          >
            Create a New Route
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </main>
  )
}
