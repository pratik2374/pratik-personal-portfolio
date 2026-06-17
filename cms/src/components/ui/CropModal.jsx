import { useState, useRef, useCallback } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// Extract cropped region from the image element and return a WebP blob
async function getCroppedBlob(imageEl, pctCrop, quality = 0.9) {
  const sx = (pctCrop.x / 100) * imageEl.naturalWidth
  const sy = (pctCrop.y / 100) * imageEl.naturalHeight
  const sw = (pctCrop.width / 100) * imageEl.naturalWidth
  const sh = (pctCrop.height / 100) * imageEl.naturalHeight

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(sw)
  canvas.height = Math.round(sh)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(imageEl, sx, sy, sw, sh, 0, 0, sw, sh)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
      'image/webp',
      quality
    )
  })
}

const ASPECTS = [
  { label: '1:1',  value: 1,          hint: 'Square' },
  { label: '3:4',  value: 3 / 4,      hint: 'Portrait' },
  { label: '16:9', value: 16 / 9,     hint: 'Landscape' },
  { label: 'Free', value: undefined,   hint: 'Freeform' },
]

export default function CropModal({ src, initialAspect, onConfirm, onCancel }) {
  const imgRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completed, setCompleted] = useState()
  const [aspect, setAspect] = useState(initialAspect)
  const [confirming, setConfirming] = useState(false)

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget
    const init = centerCrop(
      makeAspectCrop({ unit: '%', width: 88 }, aspect ?? width / height, width, height),
      width, height
    )
    setCrop(init)
    setCompleted(init)
  }, [aspect])

  const changeAspect = (next) => {
    setAspect(next)
    if (!imgRef.current) return
    const { width, height } = imgRef.current
    const newCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 88 }, next ?? width / height, width, height),
      width, height
    )
    setCrop(newCrop)
    setCompleted(newCrop)
  }

  const handleConfirm = async () => {
    if (!imgRef.current || !completed) return
    setConfirming(true)
    try {
      const blob = await getCroppedBlob(imgRef.current, completed)
      onConfirm(blob)
    } catch (err) {
      console.error('Crop error:', err)
      setConfirming(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#181615] rounded-2xl border border-white/10 w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div>
            <p className="text-white font-poppins font-semibold text-sm">Crop Image</p>
            <p className="text-gray-dark text-[11px] mt-0.5">Drag to reposition · Pull corners to resize</p>
          </div>
          <button onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-dark hover:text-white hover:bg-white/5 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Crop canvas */}
        <div className="flex-1 overflow-auto bg-[#0e0c0b] flex items-center justify-center p-6 min-h-0">
          <ReactCrop
            crop={crop}
            onChange={(_, pct) => setCrop(pct)}
            onComplete={(_, pct) => setCompleted(pct)}
            aspect={aspect}
            keepSelection
            style={{ maxHeight: '55vh' }}
          >
            <img
              ref={imgRef}
              src={src}
              onLoad={onImageLoad}
              style={{ maxHeight: '55vh', maxWidth: '100%', display: 'block' }}
              alt="crop"
            />
          </ReactCrop>
        </div>

        {/* Aspect buttons */}
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-gray-dark mr-1 uppercase tracking-wider">Ratio</span>
          {ASPECTS.map(({ label, value, hint }) => (
            <button
              key={label}
              type="button"
              title={hint}
              onClick={() => changeAspect(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                aspect === value
                  ? 'bg-accent-lime text-bg'
                  : 'bg-white/5 text-gray-mid hover:bg-white/10 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 py-4 border-t border-white/[0.06] shrink-0">
          <button type="button" onClick={onCancel}
            className="flex-1 py-2.5 border border-white/10 text-gray-mid text-sm rounded-xl hover:border-white/20 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} disabled={confirming || !completed}
            className="flex-1 py-2.5 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-xl hover:bg-accent-lime/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {confirming
              ? <><div className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />Processing…</>
              : 'Crop & Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}
