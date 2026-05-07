import { Link } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import CollectionTable from '../../components/ui/CollectionTable'
import TopBar from '../../components/layout/TopBar'

const COLUMNS = [
  { key: 'companyName', label: 'Company' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
]

export default function ExperienceCollection() {
  const { data, loading, update, remove, reorder } = useCollection('experience')

  return (
    <>
      <TopBar title="Experience" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-mid text-sm">{data.length} items</p>
          <Link to="/experience/new" className="px-4 py-2 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors">
            + New Entry
          </Link>
        </div>
        {loading ? <p className="text-gray-mid text-sm">Loading...</p> : (
          <CollectionTable
            columns={COLUMNS}
            data={data}
            basePath="/experience"
            onDelete={async (id, skipConfirm) => { if (skipConfirm || window.confirm('Delete?')) await remove(id) }}
            onStatusToggle={async (id, s) => await update(id, { status: s })}
            onReorder={reorder}
          />
        )}
      </div>
    </>
  )
}
