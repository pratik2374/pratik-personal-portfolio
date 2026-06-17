import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import CropModal from './CropModal'

// aspect prop → numeric ratio for crop + thumbnail shape
const RATIO = { square: 1, portrait: 3 / 4, landscape: 16 / 9, free: undefined }

// Thumbnail container class based on aspect
const THUMB = {
  square:    'aspect-square',
  portrait:  'aspect-[3/4] max-w-[180px]',
  landscape: 'aspect-video',
  free:      'h-40',
}

async function uploadBlob(blob, folder) {
  const path = `${folder}/${Date.now()}.webp`
  const { error } = await supabase.storage
    .from('media')
    .upload(path, blob, { contentType: 'image/webp', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

export default function ImagePickerField({ value, onChange, folder = 'uploads', aspect = 'free' }) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef(null)

  const thumbClass = THUMB[aspect] ?? THUMB.free
  const aspectRatio = RATIO[aspect]

  const closePanel = () => {
    setPanelOpen(false)
    setUploadError('')
    setUrlInput('')
    if (fileRef.current) fileRef.current.value = ''
  }

  // Step 1: file picked → show crop modal
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result)
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  // Step 2: crop confirmed → upload
  const handleCropConfirm = async (blob) => {
    setCropSrc(null)
    closePanel()
    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadBlob(blob, folder)
      onChange(url)
    } catch (err) {
      console.error('Upload error:', err)
      setUploadError(err.message || 'Upload failed')
      setPanelOpen(true)
    } finally {
      setUploading(false)
    }
  }

  const handleUrlApply = () => {
    const url = urlInput.trim()
    if (!url) return
    onChange(url)
    closePanel()
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange('')
  }

  return (
    <>
      {/* Crop modal — renders above everything */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          initialAspect={aspectRatio}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className="relative">
        {/* ── Thumbnail ── */}
        <div
          onClick={() => !uploading && setPanelOpen(true)}
          className={`relative rounded-xl overflow-hidden border w-full transition-all group
            ${uploading ? 'cursor-wait' : 'cursor-pointer'}
            ${value
              ? 'border-white/10 hover:border-white/30'
              : 'border-dashed border-white/10 hover:border-white/30 flex items-center justify-center bg-bg/50'
            } ${thumbClass}`}
        >
          {uploading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg/80 gap-2">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-[11px] text-gray-mid">Uploading…</span>
            </div>
          )}

          {value ? (
            <>
              <img src={value} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-white text-[11px] font-medium">Change</span>
              </div>
              <button type="button" onClick={handleClear}
                className="absolute top-2 right-2 w-5 h-5 bg-black/60 hover:bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10">
                ✕
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-dark py-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs">Click to add image</span>
            </div>
          )}
        </div>

        {/* ── Picker Panel ── */}
        {panelOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={closePanel} />
            <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-[#181615] border border-white/10 rounded-xl shadow-2xl overflow-hidden">

              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="text-white text-sm font-medium">Image</span>
                <button onClick={closePanel} className="text-gray-dark hover:text-white transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Current image preview — fixed height, centered with object-contain */}
              {value && (
                <div className="relative h-44 bg-[#0e0c0b] flex items-center justify-center overflow-hidden">
                  <img src={value} alt="current" className="max-w-full max-h-full object-contain" />
                </div>
              )}

              <div className="p-4 space-y-3">
                {/* Choose & Crop */}
                <label className="block">
                  <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-white/8 hover:bg-white/12 text-white transition-colors cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Choose & Crop
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>

                {uploadError && (
                  <div className="p-2 bg-red-400/10 border border-red-400/20 rounded-lg">
                    <p className="text-red-400 text-[11px] text-center">{uploadError}</p>
                  </div>
                )}

                {/* URL paste */}
                <div className="space-y-1.5">
                  <p className="text-[11px] text-gray-dark font-medium">Or paste image URL</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleUrlApply()}
                      placeholder="https://..."
                      className="flex-1 bg-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                    />
                    <button type="button" onClick={handleUrlApply}
                      className="px-3 py-2 bg-accent-lime text-bg text-xs font-bold rounded-lg hover:bg-accent-lime/90 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {value && (
                  <button type="button" onClick={() => { onChange(''); closePanel() }}
                    className="w-full text-xs text-red-400/50 hover:text-red-400 transition-colors py-1">
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
