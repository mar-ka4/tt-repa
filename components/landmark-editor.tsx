"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, Save, X } from "lucide-react"
import FallbackImage from "@/components/fallback-image"

interface LandmarkEditorProps {
  landmark: {
    name: string
    image: string
    description?: string
    gallery?: string[]
  }
  index: number
  onUpdate: (index: number, field: string, value: any) => void
  onRemove: (index: number) => void
}

export default function LandmarkEditor({ landmark, index, onUpdate, onRemove }: LandmarkEditorProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [tempName, setTempName] = useState(landmark.name)
  const [tempDescription, setTempDescription] = useState(landmark.description || "")

  // Initialize gallery with existing images or empty slots
  const gallery = landmark.gallery || [landmark.image, "", "", "", ""]

  // Ensure we always have 5 slots for the gallery
  while (gallery.length < 5) {
    gallery.push("")
  }

  const handleNameSave = () => {
    onUpdate(index, "name", tempName)
    setIsEditingName(false)
  }

  const handleDescriptionSave = () => {
    onUpdate(index, "description", tempDescription)
    setIsEditingDescription(false)
  }

  const handleGalleryUpdate = (galleryIndex: number, imagePath: string) => {
    const newGallery = [...gallery]
    newGallery[galleryIndex] = imagePath
    onUpdate(index, "gallery", newGallery)

    // Also update the main image if updating the first gallery image
    if (galleryIndex === 0 && imagePath) {
      onUpdate(index, "image", imagePath)
    }
  }

  return (
    <div className="bg-[#0f0f11] border border-[#27272f] rounded-md p-4">
      <div className="flex justify-between items-start mb-4">
        {isEditingName ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="flex-grow bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Point name"
            />
            <button
              className="p-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
              onClick={handleNameSave}
            >
              <Save size={16} />
            </button>
            <button
              className="p-2 bg-[#27272f] hover:bg-[#323238] rounded-md text-white transition-colors"
              onClick={() => setIsEditingName(false)}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-lg">
              Point {index + 1}: {landmark.name}
            </h4>
            <button
              className="p-1 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              <Edit size={14} />
            </button>
          </div>
        )}

        <button className="text-red-400 hover:text-red-300 transition-colors" onClick={() => onRemove(index)}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Gallery */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-sm text-gray-400">Gallery</h5>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {gallery.map((image, galleryIndex) => (
            <div key={galleryIndex} className="relative aspect-[4/3]">
              <div className="w-full h-full rounded-md overflow-hidden border border-[#27272f] bg-[#0c0c0e]">
                {image ? (
                  <FallbackImage
                    src={`/${image}`}
                    alt={`Image ${galleryIndex + 1}`}
                    width={200}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Plus size={20} className="text-gray-500" />
                  </div>
                )}
              </div>
              <button
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                onClick={() => {
                  const newPath = prompt("Enter image path:", image || "")
                  if (newPath !== null) {
                    handleGalleryUpdate(galleryIndex, newPath)
                  }
                }}
              >
                <Edit size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-sm text-gray-400">Description</h5>
          {!isEditingDescription && (
            <button
              className="p-1 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsEditingDescription(true)}
            >
              <Edit size={14} />
            </button>
          )}
        </div>

        {isEditingDescription ? (
          <div className="space-y-2">
            <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#0f0f11] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Route point description..."
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1.5 bg-[#27272f] hover:bg-[#323238] rounded-md text-sm text-white transition-colors"
                onClick={() => setIsEditingDescription(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-md text-sm text-white transition-colors flex items-center gap-1"
                onClick={handleDescriptionSave}
              >
                <Save size={14} />
                <span>Save</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#0c0c0e] rounded-md p-3 min-h-[80px]">
            {landmark.description ? (
              <p className="text-sm text-gray-300">{landmark.description}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">No description</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
