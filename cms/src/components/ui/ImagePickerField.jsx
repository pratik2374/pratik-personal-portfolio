import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

// Compress + convert to WebP client-side before uploading
function compressToWebP(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
        'image/webp',
        quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Image load failed')) }
    img.src = objectUrl
  })
}

export default function ImagePickerField({ value, onChange, folder = 'uploads' }) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef(null)

  const closePanel = () => {
    setPanelOpen(false)
    setUploadError('')
    setUrlInput('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadError('')
    setUploading(true)

    try {
      const blob = await compressToWebP(file)
      const path = `${folder}/${Date.now()}.webp`

      const { error } = await supabase.storage
        .from('media')
        .upload(path, blob, { contentType: 'image/webp', upsert: false })

      if (error) throw error

      const { data } = supabase.storage.from('media').getPublicUrl(path)
      onChange(data.publicUrl)
      closePanel()
    } catch (err) {
      console.error('Upload error:', err)
      setUploadError(err.message || 'Upload failed')
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
    <div className="relative">
      {/* Thumbnail / Click Target */}
      <div
        onClick={() => setPanelOpen(true)}
        className={`
          relative rounded-xl overflow-hidden border cursor-pointer transition-all group
          ${value
            ? 'border-white/10 hover:border-white/30 h-40'
            : 'border-dashed border-white/10 hover:border-white/30 h-28 flex items-center justify-center bg-bg/50'
          }
        `}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span className="text-white text-xs font-medium">Choose Image</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-red-500 text-white text-xs rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-dark">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="text-xs">Click to add image</span>
          </div>
        )}
      </div>

      {/* Picker Panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closePanel} />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-white text-sm font-medium">Image</span>
              <button onClick={closePanel} className="text-gray-dark hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {value && (
              <div className="relative h-36 bg-[#111]">
                <img src={value} alt="current" className="w-full h-full object-contain" />
              </div>
            )}

            <div className="p-4 space-y-4">
              {/* Upload */}
              <label className="block">
                <div className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${uploading ? 'bg-white/5 text-gray-mid' : 'bg-white/10 hover:bg-white/15 text-white'}`}>
                  {uploading ? (
                    <>
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                      Compressing & uploading…
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      Choose Image
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <div className="p-2 bg-red-400/10 border border-red-400/20 rounded-lg">
                  <p className="text-red-400 text-[11px] text-center">{uploadError}</p>
                </div>
              )}

              {/* URL paste */}
              <div className="space-y-2">
                <p className="text-xs text-gray-dark font-medium">Or paste image URL</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUrlApply()}
                    placeholder="https://..."
                    className="flex-1 bg-bg border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={handleUrlApply}
                    className="px-3 py-2 bg-accent-lime text-bg text-xs font-bold rounded-lg hover:bg-accent-lime/90 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); closePanel() }}
                  className="w-full text-xs text-red-400/60 hover:text-red-400 transition-colors py-1"
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
