import { useState } from 'react'
import StatusBadge from './StatusBadge'
import { Link } from 'react-router-dom'

export default function CollectionTable({ columns, data, basePath, onDelete, onStatusToggle, onReorder }) {
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  if (!data.length) {
    return <p className="text-gray-mid text-sm px-6 py-12 text-center">No items yet. Add your first one.</p>
  }

  const handleDragStart = (e, index) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIndex(index)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }
    const reordered = [...data]
    const [removed] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, removed)
    setDragIndex(null)
    setOverIndex(null)
    onReorder?.(reordered)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left text-xs text-gray-dark font-normal px-3 py-3 w-6"></th>
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
          {data.map((row, index) => (
            <tr
              key={row.id}
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragOver={e => handleDragOver(e, index)}
              onDrop={e => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`border-b border-white/5 group transition-colors cursor-grab active:cursor-grabbing ${
                overIndex === index && dragIndex !== index
                  ? 'bg-white/10 border-accent-lime/40'
                  : 'hover:bg-white/[0.02]'
              } ${dragIndex === index ? 'opacity-40' : ''}`}
            >
              {/* Drag Handle */}
              <td className="px-3 py-3 text-gray-dark/40 group-hover:text-gray-mid transition-colors select-none" title="Drag to reorder">
                <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
                  <circle cx="2" cy="2" r="1.5"/>
                  <circle cx="8" cy="2" r="1.5"/>
                  <circle cx="2" cy="8" r="1.5"/>
                  <circle cx="8" cy="8" r="1.5"/>
                  <circle cx="2" cy="14" r="1.5"/>
                  <circle cx="8" cy="14" r="1.5"/>
                </svg>
              </td>
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
