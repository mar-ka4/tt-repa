"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Lock, X } from "lucide-react"

// Updated Achievement interface to match data/achievements.ts for consistency
interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ElementType
  gradient: string
  category: "travel" | "social" | "creation" | "exploration" | "gastronomy" | "nature" | "adventure" | "culture"
  progressGoal: number // Corresponds to totalProgress
  currentProgress: number // Corresponds to currentProgress
  unlocked: boolean // This property will be used to indicate if it's fully completed
}

interface AchievementCardProps {
  achievement: Achievement
  onDragStart: (e: React.DragEvent, id: string) => void
  onDrop: (e: React.DragEvent, targetId: string) => void
  onDragOver: (e: React.DragEvent) => void
  isHighlighted: boolean // Re-added for the "green zone"
}

function AchievementCard({ achievement, onDragStart, onDrop, onDragOver, isHighlighted }: AchievementCardProps) {
  const { name, description, icon: Icon, gradient, currentProgress, progressGoal } = achievement

  // Determine the display state based on currentProgress and progressGoal
  const isFullyCompleted = currentProgress >= progressGoal && progressGoal > 0
  const hasProgress = currentProgress > 0 && currentProgress < progressGoal
  const isLocked = currentProgress === 0

  const progressPercentage = progressGoal > 0 ? (currentProgress / progressGoal) * 100 : 0

  return (
    <div
      className={`bg-[#18181c] border rounded-xl p-4 flex flex-col items-center text-center transition-all duration-100
      ${isHighlighted ? "border-green-500" : "border-[#27272f]"}
    `}
      draggable={isFullyCompleted || hasProgress} // Allow dragging if completed or in progress
      onDragStart={(e) => onDragStart(e, achievement.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, achievement.id)}
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-4 transition-all duration-300 relative
          ${isFullyCompleted ? gradient + " border-opacity-50" : "bg-[#1a1a1a] border-[#27272f]"}
        `}
      >
        {isFullyCompleted ? (
          <Icon size={36} className="text-white" />
        ) : (
          <>
            {hasProgress ? (
              // Circular progress bar for in-progress achievements, similar to AchievementBadge
              <div className="relative w-full h-full flex items-center justify-center">
                <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 36 36">
                  <circle
                    className="text-gray-700"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="transparent"
                    r="16"
                    cx="18"
                    cy="18"
                  />
                  <circle
                    className="text-purple-500" // Using purple to match AchievementBadge
                    strokeWidth="3"
                    strokeDasharray="100" // using 100 as in AchievementBadge, simpler to calculate from percentage
                    strokeDashoffset={100 - progressPercentage}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="16"
                    cx="18"
                    cy="18"
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "center",
                      transition: "stroke-dashoffset 0.5s ease-in-out",
                    }}
                  />
                </svg>
                <Icon size={36} className="text-gray-400" /> {/* Icon color when in progress */}
              </div>
            ) : (
              // Lock icon for locked achievements with no progress
              <Lock size={36} className="text-gray-500" />
            )}
          </>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <div className="mt-auto">
        {isFullyCompleted && (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check size={20} className="text-white" />
          </div>
        )}
        {hasProgress && (
          <span className="text-xs text-gray-400 mt-1">
            {currentProgress}/{progressGoal}
          </span>
        )}
        {isLocked && (
          <div className="w-8 h-8 rounded-full bg-[#0c0c0e] border border-[#27272f] flex items-center justify-center">
            <Lock size={16} className="text-gray-500" />
          </div>
        )}
      </div>
    </div>
  )
}

interface AchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  achievements: Achievement[]
}

export default function AchievementsModal({ isOpen, onClose, achievements }: AchievementsModalProps) {
  const [filter, setFilter] = useState("all")
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [localAchievements, setLocalAchievements] = useState<Achievement[]>([])

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Allow drop
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      return
    }

    const newAchievements = [...localAchievements]
    const draggedIndex = newAchievements.findIndex((ach) => ach.id === draggedId)
    const targetIndex = newAchievements.findIndex((ach) => ach.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null)
      return
    }

    const [removed] = newAchievements.splice(draggedIndex, 1)
    newAchievements.splice(targetIndex, 0, removed)

    setLocalAchievements(newAchievements)
    setDraggedId(null)
  }

  useEffect(() => {
    // Sort achievements: completed first, then in-progress, then locked
    const sortedAchievements = [...achievements].sort((a, b) => {
      const aCompleted = a.currentProgress >= a.progressGoal && a.progressGoal > 0
      const bCompleted = b.currentProgress >= b.progressGoal && b.progressGoal > 0
      const aInProgress = a.currentProgress > 0 && a.currentProgress < a.progressGoal
      const bInProgress = b.currentProgress > 0 && b.currentProgress < b.progressGoal

      // Fully completed first
      if (aCompleted && !bCompleted) return -1
      if (!aCompleted && bCompleted) return 1

      // Then in-progress
      if (aInProgress && !bInProgress) return -1
      if (!aInProgress && bInProgress) return 1

      // Finally, sort by name for stable order
      return a.name.localeCompare(b.name)
    })
    setLocalAchievements(sortedAchievements)
  }, [achievements])

  if (!isOpen) return null

  const filteredAchievements = localAchievements.filter((ach) => {
    const isFullyCompleted = ach.currentProgress >= ach.progressGoal && ach.progressGoal > 0

    if (filter === "completed") {
      return isFullyCompleted
    }
    if (filter === "in-progress") {
      return ach.currentProgress > 0 && ach.currentProgress < ach.progressGoal
    }
    return true
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#080809] border border-[#27272f] rounded-xl shadow-lg flex flex-col w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-[#080809]">
          <h2 className="text-xl font-medium">My Achievements</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#27272f] rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-[#1a1a1a] flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "all" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-400 hover:bg-[#27272f]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "completed" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-400 hover:bg-[#27272f]"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "in-progress" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-400 hover:bg-[#27272f]"
            }`}
          >
            In Progress
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-dark-scrollbar">
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredAchievements.map((ach, index) => (
                <AchievementCard
                  key={ach.id}
                  achievement={ach}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  isHighlighted={index < 8} // Apply green border to the first 8 cards
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">No achievements found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  )
}
