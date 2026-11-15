import { useCollection } from '../../hooks/useCollection'
import ExperienceCard from '../ui/ExperienceCard'
import { motion } from 'framer-motion'

export default function ExperienceSection() {
  const { data: experience, loading } = useCollection('experience', 'order')

  const sorted = [...experience].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <section className="mb-16 sm:mb-24">
      {/* Section Heading — In Code, Renders Instantly */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 sm:mb-12"
      >
        <h2 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-white uppercase">
          12 YEARS OF
        </h2>
        <h2 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-[#333333] uppercase">
          EXPERIENCE
        </h2>
      </motion.div>

      {/* Experience List with Skeleton Fallback */}
      <div className="flex flex-col gap-2">
        {loading && sorted.length === 0 ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-4 sm:p-6 rounded-2xl animate-pulse">
              <div className="h-6 sm:h-7 bg-white/10 rounded-md w-1/3 mb-3" />
              <div className="h-4 bg-white/5 rounded-md w-4/5 mb-2" />
              <div className="h-3 bg-white/5 rounded-md w-1/4" />
            </div>
          ))
        ) : (
          sorted.map(exp => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))
        )}
      </div>
    </section>
  )
}
