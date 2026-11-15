import { useCollection } from '../hooks/useCollection'
import ExperienceCard from '../components/ui/ExperienceCard'

export default function Experience() {
  const { data: experience, loading } = useCollection('experience', 'order')

  const sorted = [...experience].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <div className="mb-16 sm:mb-24 pt-6 sm:pt-0">
      <div className="mb-8 sm:mb-12">
        <h1 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-white uppercase">
          WORK
        </h1>
        <h1 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-[#333333] uppercase">
          EXPERIENCE
        </h1>
      </div>
      
      <div className="flex flex-col gap-2">
        {loading && sorted.length === 0 ? (
          [1, 2, 3, 4].map(i => (
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
    </div>
  )
}
