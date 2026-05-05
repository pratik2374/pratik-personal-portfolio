import StatusBadge from './StatusBadge'
import { Link } from 'react-router-dom'

export default function CollectionTable({ columns, data, basePath, onDelete, onStatusToggle }) {
  if (!data.length) {
    return <p className="text-gray-mid text-sm px-6 py-12 text-center">No items yet. Add your first one.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left text-xs text-gray-dark font-normal px-4 py-3 w-10">
              <input type="checkbox" className="accent-accent-lime" />
            </th>
            {columns.map(col => (
              <th key={col.key} className="text-left text-xs text-gray-dark font-normal px-4 py-3">
                {col.label}
              </th>
            ))}
            <th className="text-xs text-gray-dark font-normal px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] group">
              <td className="px-4 py-3">
                <input type="checkbox" className="accent-accent-lime" />
              </td>
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-gray-mid max-w-xs truncate">
                  {col.key === 'status' ? (
                    <StatusBadge
                      status={row.status}
                      onClick={() => onStatusToggle(row.id, row.status === 'live' ? 'draft' : 'live')}
                    />
                  ) : col.render ? col.render(row) : (
                    <span className="text-white">{row[col.key]}</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <Link
                  to={`${basePath}/${row.id}`}
                  className="text-gray-mid hover:text-white text-xs mr-4 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(row.id)}
                  className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
