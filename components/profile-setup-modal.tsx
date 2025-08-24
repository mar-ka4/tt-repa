"use client"

import { useState } from "react"
import { Upload, MapPin, Calendar, User, Phone, Globe, Camera } from "lucide-react"
import Image from "next/image"

interface ProfileSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profileData: any) => void
}

export default function ProfileSetupModal({ isOpen, onClose, onSave }: ProfileSetupModalProps) {
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    birthDate: "",
    phone: "",
    avatar: null as File | null,
    coverImage: null as File | null,
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: "avatar" | "coverImage", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (field === "avatar") {
          setAvatarPreview(e.target?.result as string)
        } else {
          setCoverPreview(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    } else {
      if (field === "avatar") {
        setAvatarPreview(null)
      } else {
        setCoverPreview(null)
      }
    }
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-2xl bg-[#080809] rounded-xl border border-[#1a1a1a] overflow-hidden h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-8 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-2xl font-semibold text-white">Complete Your Profile</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-8">
            {/* Cover Image Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Cover Image</h3>
              <div className="relative">
                <div
                  className="w-full h-48 rounded-xl border-2 border-dashed border-[#2c2c30] bg-[#0c0c0e] flex items-center justify-center cursor-pointer hover:border-[#3a3a3a] transition-colors overflow-hidden"
                  onClick={() => document.getElementById("cover-upload")?.click()}
                >
                  {coverPreview ? (
                    <Image src={coverPreview || "/placeholder.svg"} alt="Cover preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400 text-sm">Click to upload cover image</p>
                      <p className="text-gray-500 text-xs mt-1">Recommended: 1200x400px</p>
                    </div>
                  )}
                </div>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange("coverImage", e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Avatar Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div
                  className="relative w-24 h-24 rounded-full border-2 border-dashed border-[#2c2c30] bg-[#0c0c0e] flex items-center justify-center cursor-pointer hover:border-[#3a3a3a] transition-colors overflow-hidden"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <Camera size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <button
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2c2c30] text-white rounded-lg transition-colors text-sm"
                  >
                    Upload Photo
                  </button>
                  <p className="text-gray-500 text-xs mt-1">Recommended: 400x400px</p>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange("avatar", e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <User size={16} />
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#2c2c30] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#2c2c30] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Calendar size={16} />
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#2c2c30] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#2c2c30] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Globe size={16} />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#2c2c30] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#2c2c30] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Tell us about yourself, your travel experiences, and what makes you passionate about exploring..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-4 px-8 py-6 border-t border-[#1a1a1a] bg-[#080809]">
          <button onClick={handleSkip} className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors">
            Пропустить сейчас
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
