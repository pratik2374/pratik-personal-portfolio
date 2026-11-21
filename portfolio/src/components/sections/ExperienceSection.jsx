import { useCollection } from '../../hooks/useCollection'
import ExperienceCard from '../ui/ExperienceCard'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { useSettings } from '../../hooks/useSettings'
import { ExperienceListSkeleton } from '../ui/Skeleton'

export default function ExperienceSection() {
  const { headings } = useSettings()
  const { data: experience, loading } = useCollection('experience')

  const sorted = [...experience].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <section className="mb-16 sm:mb-24">
      <SectionHeading text={headings.experience} />

      {/* Experience List with Skeleton Fallback */}
      <div className="flex flex-col gap-2">
        {loading && sorted.length === 0 ? (
          <ExperienceListSkeleton count={3} />
        ) : (
          sorted.map((exp, i) => (
            <Reveal key={exp.id} index={i}>
              <ExperienceCard experience={exp} />
            </Reveal>
          ))
        )}
      </div>
    </section>
  )
}
