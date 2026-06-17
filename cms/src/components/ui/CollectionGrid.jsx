import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import CropModal from './CropModal'
import { supabase } from '../../lib/supabase'

async function uploadBlob(blob, folder) {
  const path = `${folder}/${Date.now()}.webp`
  const { error } = await supabase.storage
    .from('media')
    .upload(path, blob, { contentType: 'image/webp', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

const ASPECT_CLASS = {
  square:    'aspect-square',
  portrait:  'aspect-[3/4]',
  landscape: 'aspect-video',
  free:      'aspect-video',
}

const ASPECT_RATIO = {
  square:    1,
  portrait:  3 / 4,
  landscape: 16 / 9,
  free:      undefined,
}

// ── Single card ──────────────────────────────────────────────────────────────
function ItemCard({ item, basePath, folder, aspect, onDelete, onStatusToggle, onUpdate }) {
  const [cropSrc, setCropSrc]     = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result)
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleCropConfirm = async (blob) => {
    setCropSrc(null)
    setUploading(true)
    try {
      const url = await uploadBlob(blob, folder)
      await onUpdate(item.id, { image: url })
    } catch (err) {
      console.error('Image update failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const label = item.title || item.name || 'Untitled'
  const thumbClass = ASPECT_CLASS[aspect] ?? ASPECT_CLASS.landscape

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          initialAspect={ASPECT_RATIO[aspect]}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className="flex flex-col bg-[#1a1918] rounded-2xl border border-white/[0.06] overflow-visible group/card">

        {/* ── Image area — click to change ── */}
        <div
          className={`relative rounded-t-2xl overflow-hidden cursor-pointer group/img bg-[#111] ${thumbClass}`}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#111]">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-[11px] text-gray-dark">Uploading…</span>
            </div>
          ) : item.image ? (
            <>
              <img src={item.image} alt={label} className="w-full h-full object-cover" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-white text-[11px] font-semibold">Change</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-dark hover:text-gray-mid transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs">Add Image</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-1 p-3.5 gap-2.5">
          <p className="text-white font-poppins font-semibold text-[13px] leading-snug line-clamp-2">
            {label}
          </p>
          {item.description && (
            <p className="text-gray-dark text-[11px] leading-relaxed line-clamp-2">{item.description}</p>
          )}

          {/* ── Footer: status + actions ── */}
          <div className="flex items-center justify-between mt-auto pt-1">
            {/* Status toggle */}
            <button
              type="button"
              onClick={() => onStatusToggle(item.id, item.status === 'live' ? 'draft' : 'live')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                item.status === 'live'
                  ? 'bg-accent-lime/15 text-accent-lime hover:bg-accent-lime/25'
                  : 'bg-white/[0.05] text-gray-dark hover:bg-white/10 hover:text-gray-mid'
              }`}
            >
              {item.status === 'live' ? 'Live' : 'Draft'}
            </button>

            <div className="flex items-center gap-0.5">
              {/* Edit */}
              <Link
                to={`${basePath}/${item.id}`}
                title="Edit"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-dark hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Link>
              {/* Delete */}
              <button
                type="button"
                title="Delete"
                onClick={() => { if (window.confirm(`Delete "${label}"?`)) onDelete(item.id) }}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-dark hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Grid ─────────────────────────────────────────────────────────────────────
export default function CollectionGrid({
  data,
  basePath,
  folder,
  aspect = 'landscape',
  onDelete,
  onStatusToggle,
  onUpdate,
}) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-dark">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-30">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
        <p className="text-sm">No items yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          basePath={basePath}
          folder={folder}
          aspect={aspect}
          onDelete={onDelete}
          onStatusToggle={onStatusToggle}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}
