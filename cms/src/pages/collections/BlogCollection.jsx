import { Link } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import CollectionTable from '../../components/ui/CollectionTable'
import TopBar from '../../components/layout/TopBar'

const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'slug', label: 'Slug' },
  { key: 'readTime', label: 'Read Time' },
]

export default function BlogCollection() {
  const { data, loading, update, remove, reorder } = useCollection('blog')

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) await remove(id)
  }

  const handleStatusToggle = async (id, newStatus) => {
    await update(id, { status: newStatus })
  }

  return (
    <>
      <TopBar title="Design Thoughts" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-mid text-sm">{data.length} items</p>
          <Link
            to="/blog/new"
            className="px-4 py-2 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors"
          >
            + New Post
          </Link>
        </div>
        {loading ? (
          <p className="text-gray-mid text-sm">Loading...</p>
        ) : (
          <CollectionTable
            columns={COLUMNS}
            data={data}
            basePath="/blog"
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
            onReorder={reorder}
          />
        )}
      </div>
    </>
  )
}
