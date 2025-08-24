import type React from "react"
import { Lock } from "lucide-react"

interface AchievementBadgeProps {
  name: string
  icon: React.ElementType
  gradient: string
  unlocked: boolean
  currentProgress?: number // Added for progress display
  progressGoal?: number // Added for progress display
}

export default function AchievementBadge({
  name,
  icon: Icon,
  gradient,
  unlocked,
  currentProgress = 0,
  progressGoal = 1,
}: AchievementBadgeProps) {
  const progressPercentage = progressGoal > 0 ? (currentProgress / progressGoal) * 100 : 0

  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-[80px]">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative
          ${unlocked ? gradient + " border-opacity-50" : "bg-[#1a1a1a] border-[#27272f]"}
        `}
      >
        {unlocked ? (
          <Icon size={28} className="text-white" />
        ) : (
          <>
            {currentProgress > 0 && currentProgress < progressGoal ? (
              // Circular progress bar for in-progress achievements
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
                    className="text-purple-500"
                    strokeWidth="3"
                    strokeDasharray="100"
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
                <Icon size={28} className="text-gray-400" />
              </div>
            ) : (
              // Lock icon for locked achievements with no progress
              <Lock size={28} className="text-gray-500" />
            )}
          </>
        )}
      </div>
      <span
        className={`text-center text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
          unlocked ? "text-white" : "text-gray-500"
        }`}
      >
        {name}
      </span>
      {currentProgress > 0 && currentProgress < progressGoal && (
        <span className="text-xs text-gray-400 mt-1">
          {currentProgress}/{progressGoal}
        </span>
      )}
    </div>
  )
}
