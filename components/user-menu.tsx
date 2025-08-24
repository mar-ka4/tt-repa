"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, User, Lock, Settings, Bookmark, LogOut, Award, Sparkles, ShieldAlert } from "lucide-react"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"

interface UserMenuProps {
  onClose?: () => void
  userNickname?: string
}

export default function UserMenu({ onClose }: UserMenuProps) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLDivElement>(null)
  const [avatarPath, setAvatarPath] = useState("/default-avatar.webp")
  const [isCreator, setIsCreator] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false)

  // Get user data when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      const userDetails = getUserByNickname(user.nickname)
      if (userDetails) {
        if (userDetails.avatar) {
          setAvatarPath(userDetails.avatar)
        }
        // Check if user is verified for creating routes
        setIsCreator(userDetails.isVerifiedForRoutes)
        setIsAdmin(userDetails.isAdmin || false)
        setHasSubmittedForm(userDetails.hasSubmittedVerificationForm)
      }
    } else {
      setAvatarPath("/default-avatar.webp")
      setIsCreator(false)
      setIsAdmin(false)
      setHasSubmittedForm(false)
    }
  }, [isAuthenticated, user])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  const handleLoginClick = () => {
    router.push("/login")
    closeMenu()
  }

  const handleSignupClick = () => {
    router.push("/login?signup=true")
    closeMenu()
  }

  const handleBecomeCreatorClick = () => {
    router.push("/become-creator")
    closeMenu()
  }

  // Click handler outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        if (onClose) onClose()
      }
    }

    // Add event handler
    document.addEventListener("mousedown", handleClickOutside)

    // Remove handler when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div className="relative">
      {isAuthenticated ? (
        // Existing menu button for logged-in users
        <div
          ref={menuButtonRef}
          className="flex items-center bg-[#0D0D0E] border border-[#27272f] rounded-full h-10 overflow-hidden cursor-pointer"
          onClick={toggleMenu}
        >
          <button className="flex items-center justify-center h-full px-3">
            <Menu size={20} />
          </button>
          <div className="h-10 w-10 flex items-center justify-center pr-0 ml-px">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={isAuthenticated ? avatarPath || "/avatar.png" : "/default-avatar.webp"}
                alt="User"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        // Buttons for logged-out users, directly in the header
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoginClick}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors h-10
                       bg-[#0D0D0E] border border-[#27272f] text-white hover:bg-[#27272f]"
          >
            Sign in
          </button>
          <button
            onClick={handleSignupClick}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors h-10
                       bg-[#6C61FF] text-white hover:bg-[#5951E6]"
          >
            Sign up
          </button>
        </div>
      )}

      {/* The dropdown menu itself, only rendered if authenticated and open */}
      {isOpen && isAuthenticated && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-[#0D0D0E] border border-[#27272f] overflow-hidden z-50"
        >
          <div className="py-3">
            {/* Logged-in user menu items */}
            <>
              <Link
                href={`/profile/${user?.nickname}`}
                className="flex items-center px-4 py-3 text-white group"
                onClick={closeMenu}
              >
                <User size={18} className="mr-3 text-gray-400 group-hover:text-[#a0a0e1]" />
                <span className="group-hover:text-[#a0a0e1]">Profile</span>
              </Link>

              <Link href="/my-collection" className="flex items-center px-4 py-3 text-white group" onClick={closeMenu}>
                <Bookmark size={18} className="mr-3 text-gray-400 group-hover:text-[#a0a0e1]" />
                <span className="group-hover:text-[#a0a0e1]">My Routes</span>
              </Link>

              <Link href="/security" className="flex items-center px-4 py-3 text-white group" onClick={closeMenu}>
                <Lock size={18} className="mr-3 text-gray-400 group-hover:text-[#a0a0e1]" />
                <span className="group-hover:text-[#a0a0e1]">Login and security</span>
              </Link>

              <Link href="/settings" className="flex items-center px-4 py-3 text-white group" onClick={closeMenu}>
                <Settings size={18} className="mr-3 text-gray-400 group-hover:text-[#a0a0e1]" />
                <span className="group-hover:text-[#a0a0e1]">Settings</span>
              </Link>

              {isCreator && (
                <div className="px-4 py-2 mt-1">
                  <Link
                    href="/studio"
                    className="flex items-center justify-center w-full px-3 py-2.5 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    onClick={closeMenu}
                    style={{
                      backgroundSize: "200% 100%",
                      backgroundPosition: "0% 0%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundPosition = "100% 0%"
                      e.currentTarget.style.filter = "brightness(1.2)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundPosition = "0% 0%"
                      e.currentTarget.style.filter = "brightness(1)"
                    }}
                  >
                    <Sparkles size={18} className="mr-2 text-white animate-pulse" />
                    <span className="font-medium">Creator Studio</span>
                  </Link>
                </div>
              )}

              {isAdmin && (
                <div className="px-4 py-2 mt-1">
                  <Link
                    href="/admin-studio"
                    className="flex items-center justify-center w-full px-3 py-2.5 text-white rounded-lg bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    onClick={closeMenu}
                    style={{
                      backgroundSize: "200% 100%",
                      backgroundPosition: "0% 0%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundPosition = "100% 0%"
                      e.currentTarget.style.filter = "brightness(1.2)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundPosition = "0% 0%"
                      e.currentTarget.style.filter = "brightness(1)"
                    }}
                  >
                    <ShieldAlert size={18} className="mr-2 text-white animate-pulse" />
                    <span className="font-medium">Admin Studio</span>
                  </Link>
                </div>
              )}

              {!isCreator && !hasSubmittedForm && (
                <div className="px-4 py-3">
                  <button
                    onClick={handleBecomeCreatorClick}
                    className="flex items-center justify-center w-full px-3 py-2.5 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    style={{
                      backgroundSize: "200% 100%",
                      backgroundPosition: "0% 0%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundPosition = "100% 0%"
                      e.currentTarget.style.filter = "brightness(1.2)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundPosition = "0% 0%"
                      e.currentTarget.style.filter = "brightness(1)"
                    }}
                  >
                    <Award size={18} className="mr-2 text-white" />
                    <span className="font-medium">Become a Creator</span>
                  </button>
                </div>
              )}

              {!isCreator && hasSubmittedForm && (
                <div className="text-center text-sm text-gray-400 py-2 px-4">
                  Your creator application is under review
                </div>
              )}

              <div className="border-t border-[#27272f] mt-2"></div>

              <button className="flex items-center w-full px-4 py-3 text-white text-left group" onClick={handleLogout}>
                <LogOut size={18} className="mr-3 text-gray-400 group-hover:text-red-500" />
                <span className="group-hover:text-red-500">Sign out</span>
              </button>
            </>
          </div>
        </div>
      )}
    </div>
  )
}
