"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import {
  Globe,
  Map,
  BarChart2,
  CreditCard,
  Plus,
  BookOpen,
  Award,
  MessageSquare,
  Users,
  HelpCircle,
} from "lucide-react"
import UserMenu from "@/components/user-menu"

export default function StudioPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)

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
        <div className="mb-8">
          <h1 className="text-2xl font-medium">Creator Studio</h1>
          <div className="flex items-center mt-2 text-gray-400">
            <span>{userDetails.name}</span>
            <span className="mx-2">•</span>
            <span>{userDetails.email}</span>
            <span className="mx-2">•</span>
            <Link href={`/profile/${user.nickname}`} className="text-indigo-400 hover:underline">
              View profile
            </Link>
          </div>
        </div>

        {/* Grid of options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Route - with animated gradient border */}
          <div className="relative group">
            {/* Animated gradient border */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl opacity-75 group-hover:opacity-100 blur-[0.5px] animate-gradient-x"></div>

            <Link href="/create-route" className="relative bg-[#0c0c0e] rounded-xl p-6 flex flex-col h-full z-10 block">
              <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
                <Plus size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-lg font-medium mb-2">Create New Route</h2>
              <p className="text-sm text-gray-400">Create a new route to share with travelers</p>
            </Link>
          </div>

          {/* My Routes */}
          <Link
            href="/my-routes"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Map size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Created Routes</h2>
            <p className="text-sm text-gray-400">Manage and edit your created routes</p>
          </Link>

          {/* Analytics */}
          <Link
            href="/analytics"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <BarChart2 size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Analytics</h2>
            <p className="text-sm text-gray-400">View insights and performance of your routes</p>
          </Link>

          {/* Payments */}
          <Link
            href="/payments"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <CreditCard size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Payments</h2>
            <p className="text-sm text-gray-400">Manage your earnings and payment methods</p>
          </Link>

          {/* Resources */}
          <Link
            href="/creator-resources"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <BookOpen size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Resources</h2>
            <p className="text-sm text-gray-400">Guides and tips to create better routes</p>
          </Link>

          {/* Creator Level */}
          <Link
            href="/creator-level"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Award size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Creator Level</h2>
            <p className="text-sm text-gray-400 mb-3">Your current creator level and benefits</p>
            <div className="w-full h-2 bg-[#18181c] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Level 2</span>
              <span>60% to Level 3</span>
            </div>
          </Link>

          {/* Feedback */}
          <Link
            href="/creator-feedback"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <MessageSquare size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Feedback</h2>
            <p className="text-sm text-gray-400">View and respond to user feedback on your routes</p>
          </Link>

          {/* Community - Disabled */}
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 relative overflow-hidden cursor-not-allowed opacity-80">
            <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20 z-10 flex items-center justify-center">
              <div className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">Coming Soon</div>
            </div>
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Users size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Creator Community</h2>
            <p className="text-sm text-gray-400">Connect with other route creators</p>
          </div>

          {/* Help & Support */}
          <Link
            href="/creator-support"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <HelpCircle size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Help & Support</h2>
            <p className="text-sm text-gray-400">Get help with creator-related questions</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
