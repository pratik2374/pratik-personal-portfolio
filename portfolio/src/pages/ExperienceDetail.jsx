import { useParams } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { useDocumentBySlug } from '../hooks/useDocumentBySlug'
import ContactForm from '../components/ui/ContactForm'
import SmartImage from '../components/ui/SmartImage'
import VideoPlayer from '../components/ui/VideoPlayer'
import Gallery from '../components/ui/Gallery'
import { DetailSkeleton } from '../components/ui/Skeleton'
import { BackLink, DetailNotFound, PROSE_CLASSES } from '../components/ui/DetailParts'

export default function ExperienceDetail() {
  const { slug } = useParams()
  const { doc: exp, loading } = useDocumentBySlug('experience', slug)

  if (loading && !exp) return <DetailSkeleton />
  if (!exp) return <DetailNotFound label="Experience record not found." to="/experience" back="Back to Experience" />

  return (
    <article className="mb-24 pt-12 sm:pt-0">
      <BackLink to="/experience">Back to Experience</BackLink>

      {/* Hero media */}
      <div className="mb-8">
        {exp.video ? (
          <VideoPlayer url={exp.video} title={exp.companyName} />
        ) : (
          exp.image && (
            <SmartImage
              image={exp.image}
              width={1200}
              height={675}
              alt={exp.image.alt || exp.companyName}
              priority
              className="w-full aspect-video rounded-2xl border border-white/10 bg-[#1c1a19]"
            />
          )
        )}
      </div>

      <h1 className="font-poppins font-bold text-3xl sm:text-5xl leading-[1.1] text-white tracking-tight mb-2">
        {exp.companyName}
      </h1>

      {exp.role && (
        <h2 className="font-poppins font-medium text-lg sm:text-xl text-accent-orange tracking-tight mb-2">
          {exp.role}
        </h2>
      )}

      {(exp.date || exp.employmentType) && (
        <p className="text-gray-mid text-sm sm:text-base font-inter mb-6">
          {[exp.date, exp.employmentType].filter(Boolean).join(' · ')}
        </p>
      )}

      {exp.link && (
        <div className="flex flex-wrap gap-4 mt-6 mb-10">
          <a
            href={exp.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange text-white text-sm font-poppins font-bold rounded-xl hover:bg-accent-orange/90 active:scale-[0.98] transition-[transform,background-color] duration-150 ease-out"
          >
            <span>Visit Company / Project Website</span>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      )}

      <div className={`${PROSE_CLASSES} mb-16`}>
        {Array.isArray(exp.description) && exp.description.length > 0 ? (
          <PortableText value={exp.description} />
        ) : typeof exp.description === 'string' && exp.description ? (
          <p>{exp.description}</p>
        ) : (
          <p>No description provided.</p>
        )}
      </div>

      <Gallery images={exp.gallery} title={exp.companyName} heading="Gallery / Proof of Work" />

      <ContactForm />
    </article>
  )
}
