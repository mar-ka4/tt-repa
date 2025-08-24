"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Globe, ArrowLeft, Check, AlertCircle, Instagram, Twitter, Facebook, Music } from "lucide-react"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import UserMenu from "@/components/user-menu"

export default function BecomeCreatorPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState("")

  // Form state
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [experience, setExperience] = useState("")
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    facebook: "",
    tiktok: "",
  })
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Auto-resize textarea
  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setter(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.max(e.target.scrollHeight, 120)}px`
  }

  // Initialize textarea heights
  useEffect(() => {
    const textareas = document.querySelectorAll("textarea")
    textareas.forEach((textarea) => {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.max(textarea.scrollHeight, 120)}px`
    })
  }, [bio, experience])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const details = getUserByNickname(user.nickname)
      if (details) {
        setUserDetails(details)

        // If user is already verified or has submitted the form, redirect
        if (details.isVerifiedForRoutes) {
          router.push("/create-route")
          return
        }

        if (details.hasSubmittedVerificationForm) {
          setFormSubmitted(true)
        }
      }
    }

    setLoading(false)
  }, [isAuthenticated, user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!fullName.trim()) {
      setFormError("Please enter your full name")
      return
    }

    if (!bio.trim()) {
      setFormError("Please enter your bio")
      return
    }

    if (!experience.trim()) {
      setFormError("Please describe your experience")
      return
    }

    if (!termsAccepted) {
      setFormError("Please accept the terms and conditions")
      return
    }

    // In a real app, we would submit the form data to an API
    // For now, we'll just simulate a successful submission
    setLoading(true)

    setTimeout(() => {
      setFormSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  if (loading) {
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
      <div className="max-w-[800px] w-full mx-auto px-4 pt-24">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to home</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-medium">Become a Creator</h1>
          <p className="text-gray-400 mt-1">Share your travel experiences and earn money</p>
        </div>

        {formSubmitted ? (
          // Success message after form submission
          <div className="bg-[#27272A] rounded-2xl border border-[#3a3a3e] p-8 text-center">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-medium mb-2">Application Submitted!</h2>
            <p className="text-gray-400 mb-6">
              Thank you for applying to become a creator. We'll review your application and get back to you within 2-3
              business days.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          // Application form
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="bg-[#27272A] rounded-2xl border border-[#3a3a3e] p-5 mb-5">
              <h2 className="text-xl font-medium mb-5">Basic Information</h2>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-xl py-2 px-3 text-gray-200 text-[15px] focus:outline-none focus:border-indigo-500 placeholder:text-gray-500 placeholder:text-[15px]"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => handleTextareaChange(e, setBio)}
                    placeholder="Tell us about yourself and your travel experience"
                    rows={4}
                    className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-xl py-2 px-3 text-gray-200 text-[15px] focus:outline-none focus:border-indigo-500 placeholder:text-gray-500 placeholder:text-[15px] resize-none overflow-hidden min-h-[120px]"
                  ></textarea>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Travel Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={experience}
                    onChange={(e) => handleTextareaChange(e, setExperience)}
                    placeholder="Describe your travel experience, countries visited, and any relevant qualifications"
                    rows={4}
                    className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-xl py-2 px-3 text-gray-200 text-[15px] focus:outline-none focus:border-indigo-500 placeholder:text-gray-500 placeholder:text-[15px] resize-none overflow-hidden min-h-[120px]"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-[#27272A] rounded-2xl border border-[#3a3a3e] p-5 mb-5">
              <h2 className="text-xl font-medium mb-5">Social Media</h2>

              <div className="space-y-4">
                {/* Instagram */}
                <div>
                  <div className="flex items-center mb-1">
                    <Instagram className="w-4 h-4 text-pink-400 mr-1.5" />
                    <label className="text-sm text-gray-300">Instagram</label>
                  </div>
                  <input
                    type="text"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourusername"
                    className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-xl py-2 px-3 text-gray-200 text-[15px] focus:outline-none focus:border-indigo-500 placeholder:text-gray-500 placeholder:text-[15px]"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <div className="flex items-center mb-1">
                    <Twitter className="w-4 h-4 text-blue-400 mr-1.5" />
                    <label className="text-sm text-gray-300">Twitter</label>
                  </div>
                  <input
                    type="text"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="https://twitter.com/yourusername"
                    className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-xl py-2 px-3 text-gray-200 text-[15px] focus:outline-none focus:border-indigo-500 placeholder:text-gray-500 placeholder:text-[15px]"
                  />
                </div>

                {/* Facebook */}
                <div>
                  <div className="flex items-center mb-1">
                    <Facebook className="w-4 h-4 text-blue-600 mr-1.5" />
                    <label className="text-sm text-gray-300">Facebook</label>
                  </div>
                  <input
                    type="text"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/yourusername"
                    className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-xl py-2 px-3 text-gray-200 text-[15px] focus:outline-none focus:border-indigo-500 placeholder:text-gray-500 placeholder:text-[15px]"
                  />
                </div>

                {/* TikTok */}
                <div>
                  <div className="flex items-center mb-1">
                    <Music className="w-4 h-4 text-gray-200 mr-1.5" />
                    <label className="text-sm text-gray-300">TikTok</label>
                  </div>
                  <input
                    type="text"
                    value={socialLinks.tiktok}
                    onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@yourusername"
                    className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-xl py-2 px-3 text-gray-200 text-[15px] focus:outline-none focus:border-indigo-500 placeholder:text-gray-500 placeholder:text-[15px]"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-[#27272A] rounded-2xl border border-[#3a3a3e] p-5 mb-5">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 bg-[#0a0a0c] border-[#2a2a2e] rounded focus:ring-indigo-500 focus:ring-offset-gray-800"
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-400 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-400 hover:underline">
                    Privacy Policy
                  </a>
                  . I understand that my personal information will be processed as described in the Privacy Policy.
                </label>
              </div>
            </div>

            {/* Error message */}
            {formError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-5 flex items-start">
                <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-200 text-sm">{formError}</p>
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-6 py-3 rounded-xl text-white transition-colors ${
                  termsAccepted ? "bg-indigo-500 hover:bg-indigo-600" : "bg-indigo-500/50 cursor-not-allowed"
                }`}
                disabled={loading || !termsAccepted}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
