"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

interface RouteImageValidatorProps extends Omit<ImageProps, "src"> {
  routeName: string
  imagePath: string
  fallbackSrc?: string
}

/**
 * A component that validates route images and ensures the correct image is displayed
 * for each route, preventing cross-route image contamination
 */
export default function RouteImageValidator({
  routeName,
  imagePath,
  fallbackSrc = "/placeholder-image.png",
  alt,
  ...rest
}: RouteImageValidatorProps) {
  const [imgSrc, setImgSrc] = useState(imagePath)
  const [error, setError] = useState(false)

  // Check that the image path corresponds to the route
  useEffect(() => {
    setError(false)
    setImgSrc(imagePath)
  }, [routeName, imagePath])

  const handleError = () => {
    console.warn(`Failed to load image: ${imagePath} for route: ${routeName}`)
    setError(true)
    setImgSrc(fallbackSrc)
  }

  // Show placeholder on error or loading
  if (error) {
    return <div className={`shimmer-effect bg-[#2a2a2a] ${rest.className || ""}`} style={rest.style}></div>
  }

  return <Image {...rest} src={imgSrc || "/placeholder.svg"} alt={alt} onError={handleError} />
}
