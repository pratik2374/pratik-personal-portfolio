"use client"

import Image, { type ImageLoader } from "next/image"
import { urlFor } from "@/lib/image"
import type { SanityImage as SanityImageValue } from "@/lib/sanity"

interface SanityImageProps {
  image: SanityImageValue
  alt: string
  sizes: string
  /** Fill the (positioned, sized) parent instead of using the image's own dimensions. */
  fill?: boolean
  /** Crop to this width / height ratio. Defaults to the image's natural ratio. */
  aspectRatio?: number
  preload?: boolean
  className?: string
}

/**
 * next/image backed by Sanity's image CDN: Sanity resizes and re-encodes each
 * srcset width (no double optimisation through /_next/image), and the image's
 * LQIP blurs in underneath so there is never an empty box or a layout jump.
 */
export function SanityImage({ image, alt, sizes, fill, aspectRatio, preload, className }: SanityImageProps) {
  const dims = image.asset?.metadata?.dimensions
  const lqip = image.asset?.metadata?.lqip

  const loader: ImageLoader = ({ width, quality }) => {
    let img = urlFor(image).width(width).quality(quality || 75)
    if (aspectRatio) img = img.height(Math.round(width / aspectRatio)).fit("crop")
    return img.url()
  }

  const naturalWidth = dims?.width || 1600
  const ratio = aspectRatio || dims?.aspectRatio || 16 / 9
  const sizing = fill
    ? { fill: true as const }
    : { width: naturalWidth, height: Math.round(naturalWidth / ratio) }

  return (
    <Image
      {...sizing}
      loader={loader}
      src={urlFor(image).url()}
      alt={alt}
      sizes={sizes}
      preload={preload}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
      className={className}
      style={fill ? undefined : { width: "100%", height: "auto" }}
    />
  )
}
