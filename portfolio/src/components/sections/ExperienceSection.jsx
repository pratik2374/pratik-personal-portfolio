import { useCollection } from '../../hooks/useCollection'
import ExperienceCard from '../ui/ExperienceCard'

export default function ExperienceSection() {
  const { data: experience, loading } = useCollection('experience', 'order')

  if (loading) return null

  const sorted = [...experience].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/5">
      <h2 className="font-poppins font-semibold text-2xl text-white mb-10">Experience</h2>
      <div>
        {sorted.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </section>
  )
}
