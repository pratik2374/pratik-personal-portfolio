import { useCollection } from '../../hooks/useCollection'
import ToolCard from '../ui/ToolCard'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { useSettings } from '../../hooks/useSettings'
import { ToolGridSkeleton } from '../ui/Skeleton'

export default function ToolsSection() {
  const { headings } = useSettings()
  const { data: tools, loading } = useCollection('tools')

  return (
    <section className="mb-16 sm:mb-24">
      <SectionHeading text={headings.tools} />

      {/* Tools Grid with Skeleton Fallback */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {loading && tools.length === 0 ? (
          <ToolGridSkeleton count={6} />
        ) : (
          tools.slice(0, 6).map((tool, i) => (
            <Reveal key={tool.id} index={i} className="h-full">
              <ToolCard tool={tool} />
            </Reveal>
          ))
        )}
      </div>
    </section>
  )
}
