"use client"

import { useRef, useEffect } from "react"
import { useWishlist } from "@/context/wishlist-context"
import type { Wishlist } from "@/data/users"

interface RemoveFromWishlistDialogProps {
  isOpen: boolean
  onClose: () => void
  routeId: number
  routeName: string
  wishlists: Wishlist[]
  onRemoveSuccess: () => void
}

export default function RemoveFromWishlistDialog({
  isOpen,
  onClose,
  routeId,
  routeName,
  wishlists,
  onRemoveSuccess,
}: RemoveFromWishlistDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { removeFromWishlist } = useWishlist()

  // Handle click outside to close dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevent body scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Handle removing from all wishlists
  const handleRemoveFromAll = () => {
    wishlists.forEach((wishlist) => {
      removeFromWishlist(wishlist.id, routeId)
    })
    onRemoveSuccess()
    onClose()
  }

  // Handle removing from a specific wishlist
  const handleRemoveFromWishlist = (wishlistId: number) => {
    removeFromWishlist(wishlistId, routeId)
    onRemoveSuccess()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div ref={dialogRef} className="bg-[#121214] rounded-xl max-w-md w-full p-6 relative">
        <h2 className="text-xl font-medium mb-4">Delete Route</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete "{routeName}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#27272f] text-white hover:bg-[#27272f] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (wishlists.length > 1) {
                handleRemoveFromAll()
              } else {
                handleRemoveFromWishlist(wishlists[0].id)
              }
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
