import { Link } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import CollectionGrid from '../../components/ui/CollectionGrid'
import TopBar from '../../components/layout/TopBar'

export default function ToolsCollection() {
  const { data, loading, update, remove } = useCollection('tools')

  return (
    <>
      <TopBar title="Tools" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-mid text-sm">{data.length} items</p>
          <Link to="/tools/new"
            className="px-4 py-2 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors">
            + New Tool
          </Link>
        </div>
        {loading ? (
          <p className="text-gray-mid text-sm">Loading…</p>
        ) : (
          <CollectionGrid
            data={data}
            basePath="/tools"
            folder="tools"
            aspect="square"
            onDelete={async (id) => remove(id)}
            onStatusToggle={async (id, s) => update(id, { status: s })}
            onUpdate={async (id, patch) => update(id, patch)}
          />
        )}
      </div>
    </>
  )
}
