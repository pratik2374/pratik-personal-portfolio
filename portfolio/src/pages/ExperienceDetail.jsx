import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDocumentBySlug } from '../hooks/useDocumentBySlug'
import ContactForm from '../components/ui/ContactForm'
import { urlFor } from '../lib/sanity'

// Helper to parse different video URL styles (YouTube, Vimeo, Loom, Direct Video URLs)
function getEmbedUrl(url) {
  if (!url) return null

  // YouTube Match
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const ytMatch = url.match(ytRegex)
  if (ytMatch) {
    return { type: 'youtube', url: `https://www.youtube.com/embed/${ytMatch[1]}` }
  }

  // Vimeo Match
  const vimeoRegex = /vimeo\.com\/(?:video\/)?([0-9]+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  // Loom Match
  const loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/
  const loomMatch = url.match(loomRegex)
  if (loomMatch) {
    return { type: 'loom', url: `https://www.loom.com/embed/${loomMatch[1]}` }
  }

  // Fallback to direct video file URL (MP4, WebM, etc.)
  return { type: 'direct', url }
}

function VideoPlayer({ url, title }) {
  const embed = getEmbedUrl(url)
  if (!embed) return null

  if (embed.type === 'direct') {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-[#1c1a19]">
        <video
          src={embed.url}
          controls
          className="w-full h-full object-contain"
          playsInline
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-[#1c1a19]">
      <iframe
        src={embed.url}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  )
}

function preprocessDescription(text) {
  if (!text) return 'No description provided.'
  // Match raw image URLs (with optional float prefix like: left|https://... or right| https://...)
  // and convert them to markdown image tags before parsing.
  const rawImageRegex = /(?<!\()(?:(left|right)\s*\|\s*)?(https?:\/\/[^\s)]+\.(?:png|jpg|jpeg|gif|webp)(?:\?[^\s)]+)?)(?!\))/gi
  return text.replace(rawImageRegex, (match, align, url) => {
    const alignment = align || 'center'
    return `![${alignment}](${url})`
  })
}

export default function ExperienceDetail() {
  const { slug } = useParams()
  const { doc: exp, loading, error } = useDocumentBySlug('experience', slug)
  const [activeImageIndex, setActiveImageIndex] = useState(null)

  // Lightbox keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (activeImageIndex === null || !exp?.gallery) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImageIndex(null)
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % exp.gallery.length)
      }
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + exp.gallery.length) % exp.gallery.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImageIndex, exp?.gallery])

  if (loading) return <div className="mb-24 pt-12 sm:pt-0 text-gray-mid">Loading...</div>

  if (error || !exp) {
    return (
      <div className="mb-24 pt-12 sm:pt-0">
        <p className="text-gray-mid mb-4">Experience record not found.</p>
        <Link to="/experience" className="text-accent-orange hover:underline">← Back to Experience</Link>
      </div>
    )
  }

  return (
    <article className="mb-24 pt-12 sm:pt-0">
      {/* Back Link */}
      <Link to="/experience" className="group inline-flex items-center gap-2 text-sm text-[#998f8f] hover:text-accent-orange transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Experience
      </Link>

      {/* Hero Media Section */}
      <div className="mb-8">
        {exp.video ? (
          <VideoPlayer url={exp.video} title={exp.companyName} />
        ) : (
          exp.image && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#1c1a19]">
              <img src={urlFor(exp.image).url()} alt={exp.companyName} className="w-full h-full object-cover" />
            </div>
          )
        )}
      </div>

      {/* Header details */}
      <h1 className="font-poppins font-bold text-4xl sm:text-5xl leading-[1.1] text-white tracking-tight mb-2">
        {exp.companyName}
      </h1>
      
      {exp.role && (
        <h2 className="font-poppins font-semibold text-lg sm:text-xl text-accent-lime tracking-tight mb-2">
          {exp.role}
        </h2>
      )}

      <p className="text-gray-mid text-sm sm:text-base font-inter mb-6">
        {exp.date || 'Jan 2020 - Present'}
      </p>

      {/* Action Buttons */}
      {exp.link && (
        <div className="flex flex-wrap gap-4 mt-6 mb-10">
          <a
            href={exp.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange text-white text-sm font-poppins font-bold rounded-xl hover:bg-accent-orange/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Visit Company / Project Website</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      )}

      {/* Description Content */}
      <div className="prose prose-invert prose-lg max-w-none text-[#888888] font-inter leading-[1.8] text-[15px] sm:text-base
        prose-headings:font-poppins prose-headings:text-white prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6
        prose-h2:text-3xl prose-h3:text-2xl
        prose-p:mb-6
        prose-a:text-accent-orange prose-a:no-underline hover:prose-a:underline
        prose-code:text-accent-orange prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
        prose-pre:bg-[#2d2a29] prose-pre:border prose-pre:border-white/10 mb-16">
        {exp.description ? (
          <PortableText value={exp.description} />
        ) : (
          <p>No description provided.</p>
        )}
      </div>

      {/* Gallery Section */}
      {exp.gallery && exp.gallery.length > 0 && (
        <div className="mb-20">
          <h2 className="font-poppins font-bold text-2xl text-white mb-6">Gallery / Proof of Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {exp.gallery.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#1c1a19] cursor-pointer group relative"
              >
                <img
                  src={urlFor(img).url()}
                  alt={`${exp.companyName} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && exp?.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-10 select-none"
          >
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveImageIndex(null)} />

            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-50 text-xl font-bold border border-white/10"
              title="Close (Esc)"
            >
              ✕
            </button>

            {exp.gallery.length > 1 && (
              <button
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + exp.gallery.length) % exp.gallery.length)}
                className="absolute left-4 sm:left-8 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-50 border border-white/10"
                title="Previous (Left Arrow)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            <motion.div
              key={activeImageIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-full max-h-[85vh] z-40 flex flex-col items-center gap-4"
            >
              <img
                src={urlFor(exp.gallery[activeImageIndex]).url()}
                alt={`${exp.companyName} gallery zoomed ${activeImageIndex + 1}`}
                className="max-w-[90vw] max-h-[75vh] sm:max-h-[78vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none"
              />
              <span className="text-gray-mid text-sm font-medium font-poppins">
                {activeImageIndex + 1} / {exp.gallery.length}
              </span>
            </motion.div>

            {exp.gallery.length > 1 && (
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % exp.gallery.length)}
                className="absolute right-4 sm:right-8 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-50 border border-white/10"
                title="Next (Right Arrow)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ContactForm />
    </article>
  )
}
