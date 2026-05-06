import { motion } from 'framer-motion'

export default function ExperienceCard({ experience }) {
  const content = (
    <>
      <div className="flex-1 pr-8">
        <h3 className="font-poppins font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-accent-orange transition-colors">
          {experience.companyName || experience.company}
        </h3>
        <p className="text-gray-mid text-sm sm:text-base font-inter mb-4 leading-relaxed">
          {experience.description}
        </p>
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

  const cardClasses = "group relative flex items-center p-6 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
  
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5, ease: "easeOut" }
  }

  if (experience.link) {
    return (
      <motion.a href={experience.link} target="_blank" rel="noreferrer" className={cardClasses} {...motionProps}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.div className={cardClasses} {...motionProps}>
      {content}
    </motion.div>
  )
}
