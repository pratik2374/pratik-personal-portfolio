import { useCollection } from '../hooks/useCollection'
import ToolCard from '../components/ui/ToolCard'

export default function Tools() {
  const { data: tools, loading } = useCollection('tools')

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-poppins font-bold text-4xl text-white mb-4">Tools</h1>
      <p className="text-gray-mid mb-12">My everyday toolkit.</p>
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
