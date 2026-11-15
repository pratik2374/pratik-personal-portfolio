import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { slugify } from '../../utils/slugify'

const MotionLink = motion(Link)

export default function ExperienceCard({ experience }) {
  const companyName = experience.companyName || experience.company || 'Company'

  // Extract raw text from description if it's PortableText or string
  let rawText = ''
  if (Array.isArray(experience.description)) {
    rawText = experience.description
      .map(block => block?.children?.map(c => c.text).join('') || '')
      .join(' ')
  } else if (typeof experience.description === 'string') {
    rawText = experience.description
  }

  // Extract clean role & summary if bullets were typed into description
  let role = experience.role || ''
  let cleanSummary = rawText

  if (rawText.includes('•')) {
    const parts = rawText.split('•').map(p => p.trim()).filter(Boolean)
    if (!role && parts[0].length < 80) {
      role = parts[0]
      cleanSummary = parts.slice(1).join('. ')
    } else {
      cleanSummary = parts.join('. ')
    }
  }

  // Clean up any double periods or trailing dots
  cleanSummary = cleanSummary.replace(/\.\s*\./g, '.').trim()

  const content = (
    <>
      <div className="flex-1 pr-6 sm:pr-8">
        <h3 className="font-poppins font-bold text-xl sm:text-2xl text-white mb-1.5 group-hover:text-accent-orange transition-colors">
          {companyName}
        </h3>
        
        {role && (
          <p className="text-accent-orange font-poppins font-medium text-sm sm:text-base mb-2.5">
            {role}
          </p>
        )}

        {cleanSummary && (
          <p className="text-gray-mid text-sm sm:text-base font-inter mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {cleanSummary}
          </p>
        )}

        <p className="text-gray-dark text-xs sm:text-sm font-inter">
          {experience.date || experience.period || 'Jan 2020 - Present'}
        </p>
      </div>

      {/* Arrow Icon */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-accent-orange opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-[calc(50%+4px)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>
    </>
  )

  const cardClasses = "group relative flex items-center p-5 sm:p-6 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 active:bg-white/[0.08] transition-[background-color,border-color] duration-150 ease-out"
  
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5, ease: "easeOut" }
  }

  const expSlug = experience.slug || (experience.companyName ? slugify(experience.companyName) : '')

  if (expSlug) {
    return (
      <MotionLink to={`/experience/${expSlug}`} className={cardClasses} {...motionProps}>
        {content}
      </MotionLink>
    )
  }

  return (
    <motion.div className={cardClasses} {...motionProps}>
      {content}
    </motion.div>
  )
}
