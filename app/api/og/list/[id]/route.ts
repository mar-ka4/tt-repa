import { NextRequest } from "next/server"
import { routes } from "@/data/routes"

type LngLat = [number, number]

const locationCenters: Record<string, { center: LngLat; zoom: number }> = {
  "Berlin, Germany": { center: [13.405, 52.52], zoom: 10 },
  "Tokyo, Japan": { center: [139.6917, 35.6895], zoom: 10 },
  Iceland: { center: [-19.0208, 64.9631], zoom: 5.5 },
  "London, UK": { center: [-0.1276, 51.5074], zoom: 10 },
  "Venice, Italy": { center: [12.3155, 45.4408], zoom: 11 },
  "Paris, France": { center: [2.3522, 48.8566], zoom: 10 },
  "New York, USA": { center: [-74.006, 40.7128], zoom: 10 },
  "Rome, Italy": { center: [12.4964, 41.9028], zoom: 10 },
  "Bangkok, Thailand": { center: [100.5018, 13.7563], zoom: 10 },
  "Cape Town, South Africa": { center: [18.4241, -33.9249], zoom: 10 },
}

function getFallbackCenterByLocation(location: string): { center: LngLat; zoom: number } {
  const key = Object.keys(locationCenters).find((k) =>
    location.toLowerCase().includes(k.toLowerCase().split(",")[0]),
  )
  if (key) return locationCenters[key]
  return { center: [2.3522, 48.8566], zoom: 10 }
}

function getCenterForRoute(routeId: string): { center: LngLat; zoom: number } {
  const route = routes.find((r) => r.id === routeId)
  if (!route) return { center: [2.3522, 48.8566], zoom: 10 }

  const coords = (route.landmarks || [])
    .map((lm) => lm.coordinates)
    .filter(Boolean) as LngLat[]

  if (coords.length > 0) {
    return { center: coords[0], zoom: coords.length > 1 ? 12 : 13 }
  }

  return getFallbackCenterByLocation(route.location || "")
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const route = routes.find((r) => r.id === id)
  if (!route) {
    return new Response("Not found", { status: 404 })
  }

  const mapboxToken = process.env.MAPBOX_TOKEN
  if (!mapboxToken) {
    // Provide a minimal fallback card if token is missing to avoid broken previews
    const fallbackPng = await createTinyFallbackPng()
    return new Response(fallbackPng, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, s-maxage=300",
      },
    })
  }

  const { center, zoom } = getCenterForRoute(id)
  const marker = `pin-s+9c27b0(${center[0]},${center[1]})`
  // Use standard 1200x630 (no @2x) to avoid oversized images for some scrapers
  const staticUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${encodeURIComponent(
    marker,
  )}/${center[0]},${center[1]},${zoom},0/1200x630?logo=false&attribution=false&access_token=${mapboxToken}`

  try {
    const imgRes = await fetch(staticUrl)
    if (!imgRes.ok) {
      console.error("Mapbox static image error:", imgRes.status, await imgRes.text())
      const png = await createTinyFallbackPng()
      return new Response(png, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, s-maxage=300",
        },
      })
    }

    const arrayBuffer = await imgRes.arrayBuffer()
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch (e) {
    console.error("Error fetching static map:", e)
    const png = await createTinyFallbackPng()
    return new Response(png, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, s-maxage=300",
      },
    })
  }
}

// Tiny 1x1 PNG buffer for graceful degradation if Mapbox is unavailable
async function createTinyFallbackPng(): Promise<Uint8Array> {
  // Pre-encoded 1x1 transparent PNG
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}
