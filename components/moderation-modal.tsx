"use client"

import { useState } from "react"
import { X, Shield, Clock, Ban, Unlock } from "lucide-react"
import { banUser, unbanUser } from "@/data/users"

interface ModerationModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onUserUpdated: () => void
}

export default function ModerationModal({ isOpen, onClose, user, onUserUpdated }: ModerationModalProps) {
  const [selectedAction, setSelectedAction] = useState<string>("")
  const [banDuration, setBanDuration] = useState<number>(7)
  const [banReason, setBanReason] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleAction = async () => {
    if (!selectedAction) return

    setIsProcessing(true)

    try {
      if (selectedAction === "temporary") {
        banUser(
          user.nickname,
          "temporary",
          banDuration,
          banReason || "Temporary suspension for community guidelines violation",
        )
      } else if (selectedAction === "permanent") {
        banUser(
          user.nickname,
          "permanent",
          undefined,
          banReason || "Permanent ban for severe community guidelines violation",
        )
      } else if (selectedAction === "unban") {
        unbanUser(user.nickname)
      }

      onUserUpdated()
      onClose()
    } catch (error) {
      console.error("Error processing moderation action:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setSelectedAction("")
    setBanDuration(7)
    setBanReason("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#18181c] border border-[#27272f] rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-red-400" />
            <h3 className="text-lg font-medium">Moderation Actions</h3>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-[#27272f] rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">
            User: <span className="text-white font-medium">@{user.nickname}</span>
          </p>
          <p className="text-sm text-gray-400">
            Status:{" "}
            <span className={`font-medium ${user.isBanned ? "text-red-400" : "text-green-400"}`}>
              {user.isBanned ? "Banned" : "Active"}
            </span>
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {/* Temporary Ban Option */}
          <div
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedAction === "temporary"
                ? "border-orange-500 bg-orange-500/10"
                : "border-[#27272f] hover:border-[#3a3a3a]"
            }`}
            onClick={() => setSelectedAction("temporary")}
          >
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-orange-400" />
              <div>
                <div className="font-medium">Temporary Ban</div>
                <div className="text-sm text-gray-400">Block user for a specific duration</div>
              </div>
            </div>
          </div>

          {/* Permanent Ban Option */}
          <div
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedAction === "permanent"
                ? "border-red-500 bg-red-500/10"
                : "border-[#27272f] hover:border-[#3a3a3a]"
            }`}
            onClick={() => setSelectedAction("permanent")}
          >
            <div className="flex items-center gap-3">
              <Ban size={18} className="text-red-400" />
              <div>
                <div className="font-medium">Permanent Ban</div>
                <div className="text-sm text-gray-400">Block user permanently</div>
              </div>
            </div>
          </div>

          {/* Unban Option - only show if user is currently banned */}
          {user.isBanned && (
            <div
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedAction === "unban"
                  ? "border-green-500 bg-green-500/10"
                  : "border-[#27272f] hover:border-[#3a3a3a]"
              }`}
              onClick={() => setSelectedAction("unban")}
            >
              <div className="flex items-center gap-3">
                <Unlock size={18} className="text-green-400" />
                <div>
                  <div className="font-medium">Unban User</div>
                  <div className="text-sm text-gray-400">Remove ban and restore access</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Duration Selection for Temporary Ban */}
        {selectedAction === "temporary" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Ban Duration</label>
            <select
              value={banDuration}
              onChange={(e) => setBanDuration(Number(e.target.value))}
              className="w-full bg-[#0c0c0e] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={1}>1 Day</option>
              <option value={3}>3 Days</option>
              <option value={7}>1 Week</option>
              <option value={14}>2 Weeks</option>
              <option value={30}>1 Month</option>
              <option value={90}>3 Months</option>
            </select>
          </div>
        )}

        {/* Reason Input */}
        {(selectedAction === "temporary" || selectedAction === "permanent") && (
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Reason (Optional)</label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter reason for the ban..."
              rows={3}
              className="w-full bg-[#0c0c0e] border border-[#27272f] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2 bg-[#27272f] hover:bg-[#3a3a3a] rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            disabled={!selectedAction || isProcessing}
            className={`flex-1 py-2 rounded-md transition-colors font-medium ${
              selectedAction === "unban"
                ? "bg-green-500 hover:bg-green-600 disabled:bg-green-500/50"
                : "bg-red-500 hover:bg-red-600 disabled:bg-red-500/50"
            } disabled:cursor-not-allowed`}
          >
            {isProcessing ? "Processing..." : selectedAction === "unban" ? "Unban User" : "Apply Ban"}
          </button>
        </div>
      </div>
    </div>
  )
}
