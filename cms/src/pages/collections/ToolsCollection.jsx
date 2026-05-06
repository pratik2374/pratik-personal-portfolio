import { Link } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import CollectionTable from '../../components/ui/CollectionTable'
import TopBar from '../../components/layout/TopBar'

const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'description', label: 'Description' },
  { key: 'link', label: 'Link', render: row => row.link ? <a href={row.link} target="_blank" rel="noreferrer" className="text-accent-lime hover:underline text-xs">{row.link}</a> : '—' },
]

export default function ToolsCollection() {
  const { data, loading, update, remove, reorder } = useCollection('tools')

  return (
    <>
      <TopBar title="Tools" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-mid text-sm">{data.length} items</p>
          <Link to="/tools/new" className="px-4 py-2 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors">
            + New Tool
          </Link>
        </div>
        {loading ? <p className="text-gray-mid text-sm">Loading...</p> : (
          <CollectionTable
            columns={COLUMNS}
            data={data}
            basePath="/tools"
            onDelete={async (id) => { if (window.confirm('Delete?')) await remove(id) }}
            onStatusToggle={async (id, s) => await update(id, { status: s })}
            onReorder={reorder}
          />
        )}
      </div>
    </>
  )
}
