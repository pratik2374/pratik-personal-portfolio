import { useCollection } from '../hooks/useCollection'
import { useSettings } from '../hooks/useSettings'
import ToolCard from '../components/ui/ToolCard'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import { ToolGridSkeleton } from '../components/ui/Skeleton'

export default function Tools() {
  const { headings } = useSettings()
  const { data: tools, loading } = useCollection('tools')

  return (
    <div className="mb-16 sm:mb-24 pt-6 sm:pt-0">
      <SectionHeading as="h1" text={headings.tools} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {loading && tools.length === 0 ? (
          <ToolGridSkeleton count={6} />
        ) : (
          tools.map((tool, i) => (
            <Reveal key={tool.id} index={i} className="h-full min-w-0">
              <ToolCard tool={tool} />
            </Reveal>
          ))
        )}
      </div>
    </div>
  )
}
