import { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../lib/firebase'

export default function ImageUploader({ value, onChange, folder }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    setUploading(true)
    uploadTask.on(
      'state_changed',
      snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      err => { console.error(err); setUploading(false) },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        onChange(url)
        setUploading(false)
        setProgress(0)
      }
    )
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/10">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-bg/80 text-white text-xs rounded px-1 hover:bg-red-500/80"
          >
            ✕
          </button>
        </div>
      )}
      <label className="flex items-center gap-3 cursor-pointer">
        <span className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-mid hover:bg-white/10 transition-colors">
          {uploading ? `${progress}%` : 'Choose image'}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
        {uploading && (
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent-lime transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </label>
    </div>
  )
}
