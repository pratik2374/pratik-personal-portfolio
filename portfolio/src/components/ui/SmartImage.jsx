import { useEffect, useRef, useState } from 'react'
import { getOptimizedImageUrl } from '../../lib/sanity'

/**
 * Sanity image that fades in over its blurred LQIP placeholder.
 * The wrapper owns the size/aspect ratio (pass it via `className`), so the
 * layout never shifts while the image loads.
 */
export default function SmartImage({
  image,
  alt = '',
  width,
  height,
  fit = 'crop',
  className = '',
  imgClassName = 'w-full h-full object-cover',
  priority = false,
  placeholder = true,
  fallback = null,
}) {
  const src = getOptimizedImageUrl(image, { width, height, fit })
  const [loadedSrc, setLoadedSrc] = useState(null)
  const imgRef = useRef(null)
  const loaded = loadedSrc === src

  // Images served from the browser cache can finish before React attaches onLoad.
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth > 0) setLoadedSrc(src)
  }, [src])

  if (!src) return fallback

  const lqip = placeholder ? image?.lqip : null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {lqip && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 scale-110 blur-xl bg-cover bg-center transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundImage: `url("${lqip}")` }}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoadedSrc(src)}
        className={`relative motion-safe:transition-opacity motion-safe:duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  )
}
