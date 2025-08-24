"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import { Globe, Award, Flag, AlertTriangle, Key, Palette } from "lucide-react" // Added Palette icon
import UserMenu from "@/components/user-menu"

export default function AdminStudioPage() {
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

        // If user is not an admin, redirect to home
        if (!details.isAdmin) {
          router.push("/")
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
      {/* Header - copied from studio page */}
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
          <h1 className="text-2xl font-medium">Admin Studio</h1>
          <div className="flex items-center mt-2 text-gray-400">
            <span>{userDetails.email}</span>
            <span className="mx-2">•</span>
            <Link href={`/profile/${user.nickname}`} className="text-indigo-400 hover:underline">
              View profile
            </Link>
          </div>
        </div>

        {/* Grid of options - with dark cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Creator Applications */}
          <Link
            href="/admin-studio/creator-applications"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Award size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Creator Applications</h2>
            <p className="text-sm text-gray-400">Review and approve creator applications</p>
          </Link>

          {/* User Reports - Updated link to the new page */}
          <Link
            href="/admin-studio/user-reports"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Flag size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">User Reports</h2>
            <p className="text-sm text-gray-400">Manage reported content and users</p>
          </Link>

          {/* Content Moderation - Disabled */}
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 relative overflow-hidden cursor-not-allowed opacity-80">
            <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20 z-10 flex items-center justify-center">
              <div className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">Coming Soon</div>
            </div>
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <AlertTriangle size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Content Moderation</h2>
            <p className="text-sm text-gray-400">Review and moderate flagged content</p>
          </div>

          {/* Secret Key Generation */}
          <Link
            href="/admin-studio/secret-keys"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Key size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Secret Keys</h2>
            <p className="text-sm text-gray-400">Generate and manage API secret keys</p>
          </Link>

          {/* Icon Library - New Link */}
          <Link
            href="/admin-studio/icon-library"
            className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-4">
              <Palette size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium mb-2">Icon Library</h2>
            <p className="text-sm text-gray-400">Browse and manage available icons</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
