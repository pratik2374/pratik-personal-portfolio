import { useCollection } from '../hooks/useCollection'
import ExperienceCard from '../components/ui/ExperienceCard'

export default function Experience() {
  const { data: experience, loading } = useCollection('experience', 'order')

  if (loading) return null

  const sorted = [...experience].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <div className="mb-24 pt-12 sm:pt-0">
      <div className="mb-12">
        <h1 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-white uppercase">
          WORK
        </h1>
        <h1 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          EXPERIENCE
        </h1>
      </div>
      
      <div className="flex flex-col gap-2">
        {sorted.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  )
}
