"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import type mapboxgl from "mapbox-gl" // Import type for mapboxgl

// Define props for the component
interface MapPreviewCardProps {
  routeId: string
  routeName: string
  routeLocation: string
  routeDescription: string
  routeType: string // "route" or "list"
  mapCenter: [number, number]
  mapZoom: number
  landmarks?: { name: string; coordinates?: [number, number] }[]
}

export default function MapPreviewCard({
  routeId,
  routeName,
  routeLocation,
  routeDescription,
  routeType,
  mapCenter,
  mapZoom,
  landmarks,
}: MapPreviewCardProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)

  // Dynamically load Mapbox GL JS if not already loaded
  useEffect(() => {
    if (window.mapboxgl) {
      setMapboxLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.js"
    script.onload = () => setMapboxLoaded(true)
    script.onerror = () => console.error("Failed to load Mapbox GL JS for preview card.")
    document.body.appendChild(script)

    const cssLink = document.createElement("link")
    cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css"
    cssLink.rel = "stylesheet"
    document.head.appendChild(cssLink)

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Initialize map when Mapbox is loaded
  useEffect(() => {
    if (!mapboxLoaded || !mapContainerRef.current) return

    // Prevent re-initialization if map already exists
    if (mapRef.current) return

    try {
      if (!window.mapboxgl.accessToken) {
        // Fallback or ensure token is set if not globally available
        window.mapboxgl.accessToken =
          "pk.eyJ1IjoidjBkZXYiLCJhIjoiY20yNWJqZGNzMDFnZzJrcHo4aWVhZGNwZCJ9.VJJBmkR8R_PJKJGOGJhJhQ"
      }

      const mapInstance = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11", // Standard street style
        center: mapCenter,
        zoom: mapZoom,
        interactive: false, // Make the map non-interactive for the preview
        attributionControl: false, // Hide attribution for cleaner look
      })

      mapInstance.on("load", () => {
        mapRef.current = mapInstance

        // Add markers for all landmarks if they exist
        if (landmarks && landmarks.length > 0) {
          const landmarksWithCoords = landmarks.filter((landmark) => landmark.coordinates)

          landmarksWithCoords.forEach((landmark) => {
            if (landmark.coordinates) {
              // Create a custom marker element for each landmark
              const markerElement = document.createElement("div")
              markerElement.className = "map-preview-marker"
              markerElement.style.cssText = `
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: #6C61FF; /* Purple color instead of red */
                border: 2px solid #5B52E8; /* Darker purple border */
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transform: translate(-50%, -100%); /* Position correctly over the coordinate */
              `
              // Embed Lucide MapPin icon as SVG
              markerElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`

              new window.mapboxgl.Marker({ element: markerElement }).setLngLat(landmark.coordinates).addTo(mapInstance)
            }
          })

          // Fit map to show all landmarks
          if (landmarksWithCoords.length > 1) {
            const bounds = new window.mapboxgl.LngLatBounds()
            landmarksWithCoords.forEach((landmark) => {
              if (landmark.coordinates) {
                bounds.extend(landmark.coordinates)
              }
            })
            mapInstance.fitBounds(bounds, {
              padding: 50, // More padding for multiple markers
              maxZoom: 14, // Adjust max zoom if needed
            })
          }
        } else {
          // Fallback: single marker at map center
          const markerElement = document.createElement("div")
          markerElement.className = "map-preview-marker"
          markerElement.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #6C61FF; /* Purple color instead of red */
            border: 2px solid #5B52E8; /* Darker purple border */
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transform: translate(-50%, -100%); /* Position correctly over the coordinate */
          `
          markerElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`

          new window.mapboxgl.Marker({ element: markerElement }).setLngLat(mapCenter).addTo(mapInstance)
        }
      })

      mapInstance.on("error", (e: any) => {
        console.error("Mapbox preview error:", e.error)
      })
    } catch (error) {
      console.error("Failed to initialize Mapbox for preview card:", error)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [mapboxLoaded, mapCenter, mapZoom, landmarks])

  // Determine the link URL based on route type
  const linkUrl = routeType === "list" ? `/list/${routeId}` : `/route/${routeId}`

  return (
    <Link href={linkUrl} className="block group cursor-pointer">
      <div className="bg-[#101012] rounded-xl overflow-hidden border border-[#222225] hover:border-[#333338] transition-colors shadow-lg">
        {/* Top section: Map preview */}
        <div className="relative h-48 w-full bg-[#0c0c0e]">
          {!mapboxLoaded ? (
            <div className="absolute inset-0 skeleton flex items-center justify-center text-gray-500">
              Loading Map...
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full" />
          )}
          {/* Removed Magnifying glass icon */}
        </div>

        {/* Bottom section: Text details */}
        <div className="p-4 space-y-1">
          {/* Removed category display */}
          <h3 className="text-white font-semibold text-lg">{routeName}</h3>
          <p className="text-gray-300 text-sm line-clamp-2">{routeLocation}</p>
        </div>
      </div>
    </Link>
  )
}
