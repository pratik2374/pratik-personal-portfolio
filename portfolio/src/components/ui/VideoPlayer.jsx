/** Turns YouTube / Vimeo / Loom links into embed URLs; anything else is a direct file. */
export function getEmbedUrl(url) {
  if (!url) return null

  const yt = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
  if (yt) return { type: 'youtube', url: `https://www.youtube-nocookie.com/embed/${yt[1]}` }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/)
  if (vimeo) return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeo[1]}` }

  const loom = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)
  if (loom) return { type: 'loom', url: `https://www.loom.com/embed/${loom[1]}` }

  return { type: 'direct', url }
}

export default function VideoPlayer({ url, title }) {
  const embed = getEmbedUrl(url)
  if (!embed) return null

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-[#1c1a19]">
      {embed.type === 'direct' ? (
        <video src={embed.url} controls playsInline preload="metadata" className="w-full h-full object-contain" />
      ) : (
        <iframe
          src={embed.url}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      )}
    </div>
  )
}
