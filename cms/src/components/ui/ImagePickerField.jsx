import { useState, useRef } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../lib/firebase'

export default function ImagePickerField({ value, onChange, folder = 'uploads' }) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploadError('')
    setUploading(true)

    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`)
      
      // Use uploadBytes instead of uploadBytesResumable
      // It's a simpler POST request, more likely to succeed with CORS
      const snapshot = await uploadBytes(storageRef, file)
      const downloadUrl = await getDownloadURL(snapshot.ref)
      
      onChange(downloadUrl)
      setUploading(false)
      setPanelOpen(false)
    } catch (err) {
      console.error('Upload error details:', err)
      // Provide a more helpful error message
      let msg = err.message || 'Upload failed'
      if (err.code === 'storage/unauthorized') msg = 'Permission denied. Please check Firebase Storage rules.'
      if (err.code === 'storage/canceled') msg = 'Upload canceled.'
      if (msg.includes('Failed to fetch')) msg = 'CORS error. Please allow localhost in Firebase Storage settings.'
      
      setUploadError(msg)
      setUploading(false)
    }
  }

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setPanelOpen(false)
    }
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
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span className="text-white text-xs font-medium">Choose Image</span>
            </div>
            {/* Remove button */}
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
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setPanelOpen(false)} />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-white text-sm font-medium">Image</span>
              <button onClick={() => setPanelOpen(false)} className="text-gray-dark hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Current preview */}
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
                      Uploading...
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

              {/* Error */}
              {uploadError && (
                <div className="p-2 bg-red-400/10 border border-red-400/20 rounded-lg">
                  <p className="text-red-400 text-[11px] text-center">{uploadError}</p>
                </div>
              )}

              {/* URL Input */}
              <div className="space-y-2">
                <p className="text-xs text-gray-dark font-medium">Or paste image URL</p>
                <div className="flex gap-2">
                  <input
                    type="url"
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

              {/* Clear */}
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setPanelOpen(false) }}
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
