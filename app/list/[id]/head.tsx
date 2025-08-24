import { routes } from "@/data/routes"
import { headers } from "next/headers"

export default function Head({ params }: { params: { id: string } }) {
  const route = routes.find((r) => r.id === params.id)

  const h = headers()
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000"
  const protocol = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  const baseUrl = `${protocol}://${host}`

  const title = route ? `${route.name} • ${route.location}` : "Route"
  const description =
    (route?.description || "Discover curated routes with landmarks and maps.").slice(0, 180)

  const imageUrl = `${baseUrl}/api/og/list/${params.id}`
  const pageUrl = `${baseUrl}/list/${params.id}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  )
}
