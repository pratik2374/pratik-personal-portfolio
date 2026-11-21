import { useCollection } from '../hooks/useCollection'
import { useSettings } from '../hooks/useSettings'
import ExperienceCard from '../components/ui/ExperienceCard'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import { ExperienceListSkeleton } from '../components/ui/Skeleton'

export default function Experience() {
  const { headings } = useSettings()
  const { data: experience, loading } = useCollection('experience')

  const sorted = [...experience].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <div className="mb-16 sm:mb-24 pt-6 sm:pt-0">
      <SectionHeading as="h1" text={headings.workExperience} />

      <div className="flex flex-col gap-2">
        {loading && sorted.length === 0 ? (
          <ExperienceListSkeleton count={4} />
        ) : (
          sorted.map((exp, i) => (
            <Reveal key={exp.id} index={i}>
              <ExperienceCard experience={exp} />
            </Reveal>
          ))
        )}
      </div>
    </div>
  )
}
