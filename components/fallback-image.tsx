"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc?: string
}

export default function FallbackImage({
  src,
  fallbackSrc = "/placeholder-image.png",
  alt,
  ...rest
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
    setImgSrc(fallbackSrc)
  }

  if (error) {
    return <div className={`shimmer-effect bg-[#2a2a2a] ${rest.className || ""}`} style={rest.style}></div>
  }

  return <Image {...rest} src={imgSrc || "/placeholder.svg"} alt={alt} onError={handleError} />
}
