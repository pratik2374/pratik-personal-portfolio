import { useCollection } from '../hooks/useCollection'
import ToolCard from '../components/ui/ToolCard'

export default function Tools() {
  const { data: tools, loading } = useCollection('tools')

  return (
    <div className="mb-24 pt-12 sm:pt-0">
      <div className="mb-12">
        <h1 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-white uppercase">
          PREMIUM
        </h1>
        <h1 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          TOOLS
        </h1>
      </div>
      
      {loading ? (
        <p className="text-gray-mid">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}
