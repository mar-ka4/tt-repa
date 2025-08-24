"use client"

import { useEffect, useMemo, useState } from "react"
import { X } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { routeCategories, getCategoriesByType } from "@/data/route-categories"

type DurationType = "hours" | "days"

interface Filters {
  routeType: string
  minPrice: number
  maxPrice: number
  minDuration: number
  maxDuration: number
  durationType: DurationType
  minPoints: number
  maxPoints: number
  difficulty: string
  categories: string[]
}

interface FiltersModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: Filters) => void
  onClearFilters: () => void
  initialFilters: Filters
  filterCount: number
}

const PURPLE = "#6C61FF"

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max))
}

function digitsOnly(val: string) {
  return val.replace(/\D/g, "")
}

export default function FiltersModal({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters,
  filterCount,
}: FiltersModalProps) {
  // Local state controlled by sliders and chips
  const [routeType, setRouteType] = useState(initialFilters.routeType)
  const [priceRange, setPriceRange] = useState<number[]>([initialFilters.minPrice, initialFilters.maxPrice])
  const [durationType, setDurationType] = useState<DurationType>(initialFilters.durationType)
  const [durationRange, setDurationRange] = useState<number[]>([initialFilters.minDuration, initialFilters.maxDuration])
  const [pointsRange, setPointsRange] = useState<number[]>([initialFilters.minPoints, initialFilters.maxPoints])
  const [difficulty, setDifficulty] = useState(initialFilters.difficulty)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories || [])

  // Text inputs (to allow free typing with later clamping)
  const [priceMinText, setPriceMinText] = useState(String(initialFilters.minPrice))
  const [priceMaxText, setPriceMaxText] = useState(String(initialFilters.maxPrice))
  const [durationMinText, setDurationMinText] = useState(String(initialFilters.minDuration))
  const [durationMaxText, setDurationMaxText] = useState(String(initialFilters.maxDuration))
  const [pointsMinText, setPointsMinText] = useState(String(initialFilters.minPoints))
  const [pointsMaxText, setPointsMaxText] = useState(String(initialFilters.maxPoints))

  // Category group tabs
  const categoryGroups: { id: "art" | "historical" | "nature" | "urban" | "food" | "unique"; label: string }[] = useMemo(
    () => [
      { id: "art", label: "Art & Culture" },
      { id: "historical", label: "Historical" },
      { id: "nature", label: "Nature" },
      { id: "urban", label: "Urban" },
      { id: "food", label: "Food & Drinks" },
      { id: "unique", label: "Unique" },
    ],
    [],
  )
  const [activeGroup, setActiveGroup] = useState<"art" | "historical" | "nature" | "urban" | "food" | "unique">("art")
  const visibleCategories = useMemo(() => getCategoriesByType(activeGroup), [activeGroup])

  // Sync local state when modal opens with new initialFilters
  useEffect(() => {
    if (!isOpen) return
    setRouteType(initialFilters.routeType)
    setPriceRange([initialFilters.minPrice, initialFilters.maxPrice])
    setDurationType(initialFilters.durationType)
    setDurationRange([initialFilters.minDuration, initialFilters.maxDuration])
    setPointsRange([initialFilters.minPoints, initialFilters.maxPoints])
    setDifficulty(initialFilters.difficulty)
    setSelectedCategories(initialFilters.categories || [])

    // Initialize text inputs
    setPriceMinText(String(initialFilters.minPrice))
    setPriceMaxText(String(initialFilters.maxPrice))
    setDurationMinText(String(initialFilters.minDuration))
    setDurationMaxText(String(initialFilters.maxDuration))
    setPointsMinText(String(initialFilters.minPoints))
    setPointsMaxText(String(initialFilters.maxPoints))
  }, [isOpen, initialFilters])

  // Keep input text in sync when sliders move
  useEffect(() => {
    setPriceMinText(String(priceRange[0]))
    setPriceMaxText(String(priceRange[1]))
  }, [priceRange])

  useEffect(() => {
    setDurationMinText(String(durationRange[0]))
    setDurationMaxText(String(durationRange[1]))
  }, [durationRange])

  useEffect(() => {
    setPointsMinText(String(pointsRange[0]))
    setPointsMaxText(String(pointsRange[1]))
  }, [pointsRange])

  // Adjust duration range bounds when switching between hours/days
  useEffect(() => {
    const maxAllowed = durationType === "hours" ? 24 : 30
    setDurationRange(([min, max]) => {
      const clampedMin = clamp(min, 0, maxAllowed)
      const clampedMax = clamp(max, clampedMin, maxAllowed)
      return [clampedMin, clampedMax]
    })
  }, [durationType])

  // Price histogram (static demo data, reacts to active range for color)
  const histogramData = useMemo(
    () => [15, 25, 40, 65, 85, 95, 80, 60, 45, 35, 30, 25, 20, 18, 15, 15, 12, 10, 10, 10, 10, 10, 10, 10],
    [],
  )
  const isBarInActiveRange = (index: number) => {
    const [minPrice, maxPrice] = priceRange
    const barMinPrice = (index / histogramData.length) * 50
    const barMaxPrice = ((index + 1) / histogramData.length) * 50
    return barMaxPrice > minPrice && barMinPrice < maxPrice
  }

  // Scroll lock while open
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleClear = () => {
    onClearFilters()
    onClose()
  }

  const handleApply = () => {
    onApplyFilters({
      routeType,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minDuration: durationRange[0],
      maxDuration: durationRange[1],
      durationType,
      minPoints: pointsRange[0],
      maxPoints: pointsRange[1],
      difficulty,
      categories: selectedCategories,
    })
    onClose()
  }

  // Commit handlers for integer-only inputs
  const commitPriceMin = () => {
    const minVal = clamp(parseInt(priceMinText || "0", 10), 0, 50)
    const newMin = Math.min(minVal, priceRange[1])
    setPriceRange([newMin, priceRange[1]])
  }
  const commitPriceMax = () => {
    const maxVal = clamp(parseInt(priceMaxText || "0", 10), 0, 50)
    const newMax = Math.max(maxVal, priceRange[0])
    setPriceRange([priceRange[0], newMax])
  }

  const commitDurationMin = () => {
    const maxAllowed = durationType === "hours" ? 24 : 30
    const minVal = clamp(parseInt(durationMinText || "0", 10), 0, maxAllowed)
    const newMin = Math.min(minVal, durationRange[1])
    setDurationRange([newMin, durationRange[1]])
  }
  const commitDurationMax = () => {
    const maxAllowed = durationType === "hours" ? 24 : 30
    const maxVal = clamp(parseInt(durationMaxText || "0", 10), 0, maxAllowed)
    const newMax = Math.max(maxVal, durationRange[0])
    setDurationRange([durationRange[0], newMax])
  }

  const commitPointsMin = () => {
    const minVal = clamp(parseInt(pointsMinText || "0", 10), 0, 30)
    const newMin = Math.min(minVal, pointsRange[1])
    setPointsRange([newMin, pointsRange[1]])
  }
  const commitPointsMax = () => {
    const maxVal = clamp(parseInt(pointsMaxText || "0", 10), 0, 30)
    const newMax = Math.max(maxVal, pointsRange[0])
    setPointsRange([pointsRange[0], newMax])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80">
      <div
        className="w-full max-w-2xl mx-4 flex flex-col rounded-2xl border border-[#1f1f23] bg-[#121212] shadow-xl"
        style={{ maxHeight: "90vh" }}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-[#1f1f23] bg-[#121212] px-6 py-4">
          <h2 className="text-xl font-medium text-white">Filters</h2>
          <button
            className="p-1 text-gray-400 transition-colors hover:text-white"
            aria-label="Close filters"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar space-y-10 overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 140px)" }}>
          {/* Route Type */}
          <section className="space-y-4">
            <h3 className="text-base font-medium text-gray-300">Route Type</h3>
            <div className="flex flex-wrap gap-2">
              {["all", "walking", "cycling", "camper", "hiking", "car"].map((type) => {
                const active = routeType === type
                return (
                  <button
                    key={type}
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      active
                        ? "text-white"
                        : "border border-[#2c2c30] text-gray-300 transition-colors hover:border-[#3c3c40]"
                    }`}
                    style={active ? { border: `1px solid ${PURPLE}`, boxShadow: `0 0 0 2px ${PURPLE}1A inset` } : {}}
                    onClick={() => setRouteType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Categories */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-300">Categories</h3>
              {selectedCategories.length > 0 && (
                <div className="text-xs text-gray-400">{selectedCategories.length} selected</div>
              )}
            </div>

            {/* Group Tabs */}
            <div className="flex flex-wrap gap-2">
              {categoryGroups.map((g) => {
                const active = activeGroup === g.id
                return (
                  <button
                    key={g.id}
                    className={`rounded-full px-3 py-1.5 text-xs ${
                      active
                        ? "text-white"
                        : "border border-[#2c2c30] text-gray-300 hover:border-[#3c3c40] transition-colors"
                    }`}
                    style={active ? { border: `1px solid ${PURPLE}`, boxShadow: `0 0 0 2px ${PURPLE}1A inset` } : {}}
                    onClick={() => setActiveGroup(g.id)}
                  >
                    {g.label}
                  </button>
                )
              })}
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((cat) => {
                const active = selectedCategories.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "text-white"
                        : "border-[#2c2c30] text-gray-300 hover:border-[#3c3c40] transition-colors"
                    }`}
                    style={active ? { border: `1px solid ${PURPLE}`, boxShadow: `0 0 0 2px ${PURPLE}1A inset` } : {}}
                    onClick={() => toggleCategory(cat.id)}
                    aria-pressed={active}
                  >
                    <span>{cat.icon}</span>
                    <span className="whitespace-nowrap">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Price Range */}
          <section className="space-y-4">
            <h3 className="text-base font-medium text-gray-300">Price Range</h3>

            {/* Histogram that colors bars within active range */}
            <div className="relative pt-1">
              <div className="flex h-10 items-end justify-between px-1">
                {histogramData.map((height, i) => (
                  <div
                    key={i}
                    className="rounded-sm transition-colors duration-200"
                    style={{
                      height: `${height}%`,
                      width: "10px",
                      backgroundColor: isBarInActiveRange(i) ? PURPLE : "#52525b",
                      minHeight: "4px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Slider + integer inputs */}
            <div className="space-y-3 mt-1.5">
              <Slider
                value={priceRange}
                onValueChange={(vals) => {
                  setPriceRange(vals)
                }}
                min={0}
                max={50}
                step={1}
                aria-label="Price range"
                className="w-full"
              />
              <div className="flex justify-between gap-2">
                <input
                  aria-label="Minimum price"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  value={priceMinText}
                  onChange={(e) => setPriceMinText(digitsOnly(e.target.value))}
                  onBlur={commitPriceMin}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur()
                    }
                  }}
                  className="inline-block w-20 text-center rounded-full border border-[#2c2c30] bg-[#0D0D0E] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#6C61FF]"
                />
                <input
                  aria-label="Maximum price"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  value={priceMaxText}
                  onChange={(e) => setPriceMaxText(digitsOnly(e.target.value))}
                  onBlur={commitPriceMax}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur()
                    }
                  }}
                  className="inline-block w-20 text-center rounded-full border border-[#2c2c30] bg-[#0D0D0E] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#6C61FF]"
                />
              </div>
            </div>
          </section>

          {/* Duration */}
          <section className="space-y-4">
            <h3 className="text-base font-medium text-gray-300">Duration</h3>
            <div className="flex gap-2">
              {(["hours", "days"] as DurationType[]).map((t) => {
                const active = durationType === t
                return (
                  <button
                    key={t}
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      active
                        ? "text-white"
                        : "border border-[#2c2c30] text-gray-300 hover:border-[#3c3c40] transition-colors"
                    }`}
                    style={active ? { border: `1px solid ${PURPLE}`, boxShadow: `0 0 0 2px ${PURPLE}1A inset` } : {}}
                    onClick={() => setDurationType(t)}
                  >
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                )
              })}
            </div>

            <div className="space-y-3">
              <Slider
                value={durationRange}
                onValueChange={(vals) => {
                  setDurationRange(vals)
                }}
                min={0}
                max={durationType === "hours" ? 24 : 30}
                step={1}
                aria-label="Duration range"
                className="w-full"
              />
              <div className="flex justify-between gap-2">
                <input
                  aria-label="Minimum duration"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  value={durationMinText}
                  onChange={(e) => setDurationMinText(digitsOnly(e.target.value))}
                  onBlur={commitDurationMin}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur()
                    }
                  }}
                  className="inline-block w-24 text-center rounded-full border border-[#2c2c30] bg-[#0D0D0E] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#6C61FF]"
                />
                <input
                  aria-label="Maximum duration"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  value={durationMaxText}
                  onChange={(e) => setDurationMaxText(digitsOnly(e.target.value))}
                  onBlur={commitDurationMax}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur()
                    }
                  }}
                  className="inline-block w-24 text-center rounded-full border border-[#2c2c30] bg-[#0D0D0E] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#6C61FF]"
                />
              </div>
            </div>
          </section>

          {/* Points Count */}
          <section className="space-y-4">
            <h3 className="text-base font-medium text-gray-300">Points Count</h3>
            <div className="space-y-3">
              <Slider
                value={pointsRange}
                onValueChange={(vals) => {
                  setPointsRange(vals)
                }}
                min={0}
                max={30}
                step={1}
                aria-label="Points count range"
                className="w-full"
              />
              <div className="flex justify-between gap-2">
                <input
                  aria-label="Minimum points"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  value={pointsMinText}
                  onChange={(e) => setPointsMinText(digitsOnly(e.target.value))}
                  onBlur={commitPointsMin}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur()
                    }
                  }}
                  className="inline-block w-24 text-center rounded-full border border-[#2c2c30] bg-[#0D0D0E] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#6C61FF]"
                />
                <input
                  aria-label="Maximum points"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="text"
                  value={pointsMaxText}
                  onChange={(e) => setPointsMaxText(digitsOnly(e.target.value))}
                  onBlur={commitPointsMax}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur()
                    }
                  }}
                  className="inline-block w-24 text-center rounded-full border border-[#2c2c30] bg-[#0D0D0E] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#6C61FF]"
                />
              </div>
            </div>
          </section>

          {/* Difficulty */}
          <section className="space-y-4">
            <h3 className="text-base font-medium text-gray-300">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              {["all", "easy", "medium", "hard"].map((diff) => {
                const active = difficulty === diff
                return (
                  <button
                    key={diff}
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      active
                        ? "text-white"
                        : "border border-[#2c2c30] text-gray-300 hover:border-[#3c3c40] transition-colors"
                    }`}
                    style={active ? { border: `1px solid ${PURPLE}`, boxShadow: `0 0 0 2px ${PURPLE}1A inset` } : {}}
                    onClick={() => setDifficulty(diff)}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="rounded-b-2xl border-t border-[#1f1f23] bg-[#121212] px-6 py-4">
          <div className="flex gap-3">
            <button
              className="flex-1 rounded-full border border-[#2c2c30] bg-transparent px-4 py-2.5 text-gray-300 transition-colors hover:bg-[#1f1f23]"
              onClick={handleClear}
            >
              Clear All
            </button>
            <button
              className="flex-1 rounded-full bg-[#6C61FF] px-4 py-2.5 text-white transition-colors hover:bg-[#5951E6]"
              onClick={handleApply}
            >
              Apply Filters ({filterCount})
            </button>
          </div>

          {/* Selected category summary */}
          {selectedCategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategories.slice(0, 8).map((id) => {
                const c = routeCategories.find((x) => x.id === id)
                if (!c) return null
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full border border-[#2c2c30] bg-[#0D0D0E] px-2.5 py-1 text-xs text-gray-200"
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </span>
                )
              })}
              {selectedCategories.length > 8 && (
                <span className="text-xs text-gray-400">+{selectedCategories.length - 8} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
