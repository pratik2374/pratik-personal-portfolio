import { useCollection } from '../../hooks/useCollection'
import ToolCard from '../ui/ToolCard'
import { motion } from 'framer-motion'

export default function ToolsSection() {
  const { data: tools, loading } = useCollection('tools')

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
          PREMIUM
        </h2>
        <h2 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-[#333333] uppercase">
          TOOLS
        </h2>
      </motion.div>

      {/* Tools Grid with Skeleton Fallback */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {loading && tools.length === 0 ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 sm:p-6 bg-white/5 rounded-2xl animate-pulse flex flex-col">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-xl bg-white/10" />
              <div className="h-5 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-4/5" />
            </div>
          ))
        ) : (
          tools.slice(0, 6).map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))
        )}
      </div>
    </section>
  )
}
