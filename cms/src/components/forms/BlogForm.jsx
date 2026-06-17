import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import ImagePickerField from '../ui/ImagePickerField'
import SlugInput from '../ui/SlugInput'
import TopBar from '../layout/TopBar'
import { slugify } from '../../utils/slugify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const EMPTY = { title: '', slug: '', status: 'draft', date: '', image: '', readTime: '', summary: '', content: '' }

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ]
}

const QUILL_FORMATS = [
  'header', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'align',
  'blockquote', 'code-block',
  'link', 'image'
]

export default function BlogForm({ isEdit }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { add, update, getById } = useCollection('blog')
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      getById(id).then(doc => { if (doc) setForm({ ...EMPTY, ...doc }) })
    }
  }, [isEdit, id])

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleTitleChange = (e) => {
    const title = e.target.value
    setForm(prev => ({ ...prev, title, slug: isEdit ? prev.slug : slugify(title) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { id: _, ...data } = form
      if (isEdit) await update(id, data)
      else await add(data)
      navigate('/blog')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TopBar title={isEdit ? 'Edit Post' : 'New Post'} />
      <div className="max-w-2xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Title">
            <input
              type="text" value={form.title} onChange={handleTitleChange} required
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
            />
          </Field>
          <SlugInput value={form.slug} onChange={v => set('slug', v)} />
          <Field label="Status">
            <select
              value={form.status} onChange={e => set('status', e.target.value)}
              className="bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
            >
              <option value="draft">Draft</option>
              <option value="live">Live</option>
            </select>
          </Field>
          <Field label="Date">
            <input
              type="date" value={form.date} onChange={e => set('date', e.target.value)}
              className="bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
            />
          </Field>
          <Field label="Read Time (e.g. 6min read)">
            <input
              type="text" value={form.readTime} onChange={e => set('readTime', e.target.value)}
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50"
              placeholder="6min read"
            />
          </Field>
          <Field label="Cover Image">
            <ImagePickerField value={form.image} onChange={v => set('image', v)} folder="blog" aspect="landscape" />
          </Field>
          <Field label="Summary">
            <textarea
              value={form.summary} onChange={e => set('summary', e.target.value)} rows={2}
              className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-lime/50 resize-none"
            />
          </Field>
          <Field label="Content (Rich Text / Word-like Editor)">
            <style>{`
              .custom-quill-editor .ql-editor {
                min-height: 250px;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #ffffff;
              }
              .custom-quill-editor .ql-editor.ql-blank::before {
                color: rgba(255, 255, 255, 0.3) !important;
                font-style: normal;
              }
              .ql-toolbar.ql-snow {
                border-color: rgba(255, 255, 255, 0.1) !important;
                background-color: #1c1a19;
              }
              .ql-container.ql-snow {
                border-color: rgba(255, 255, 255, 0.1) !important;
                background-color: #151312;
              }
              .ql-snow .ql-stroke {
                stroke: #998f8f !important;
              }
              .ql-snow .ql-fill {
                fill: #998f8f !important;
              }
              .ql-snow .ql-picker {
                color: #998f8f !important;
              }
              .ql-snow .ql-picker-options {
                background-color: #1c1a19 !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
              }
              .ql-snow .ql-picker-item:hover, .ql-snow .ql-picker-label:hover {
                color: #c5ff41 !important;
              }
              .ql-snow .ql-picker-item:hover .ql-stroke, .ql-snow .ql-picker-label:hover .ql-stroke {
                stroke: #c5ff41 !important;
              }
              .ql-snow.ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus,
              .ql-snow.ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label.ql-active {
                color: #c5ff41 !important;
              }
              .ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke {
                stroke: #c5ff41 !important;
              }
              .ql-snow.ql-toolbar button:hover .ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-fill {
                fill: #c5ff41 !important;
              }
            `}</style>
            <div className="bg-bg border border-white/10 rounded-lg overflow-hidden text-white">
              <ReactQuill
                theme="snow"
                value={form.content || ''}
                onChange={v => set('content', v)}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                className="text-white bg-bg custom-quill-editor"
                placeholder="Start writing your design thoughts like a Word document..."
              />
            </div>
          </Field>
          <div className="flex gap-3 pt-2">
            <button
              type="submit" disabled={saving}
              className="px-6 py-2.5 bg-accent-lime text-bg text-sm font-poppins font-semibold rounded-lg hover:bg-accent-lime/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
            <button type="button" onClick={() => navigate('/blog')} className="px-6 py-2.5 border border-white/10 text-gray-mid text-sm rounded-lg hover:border-white/20 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-mid mb-1.5">{label}</label>
      {children}
    </div>
  )
}
