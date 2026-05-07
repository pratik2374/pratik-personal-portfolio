import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import TopBar from '../../components/layout/TopBar'

export default function MessagesCollection() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(new Set())

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === messages.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(messages.map(m => m.id)))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await deleteDoc(doc(db, 'messages', id))
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
    await fetchMessages()
  }

  const handleBulkDelete = async () => {
    if (!selected.size) return
    if (!window.confirm(`Delete ${selected.size} message(s)?`)) return
    const batch = writeBatch(db)
    selected.forEach(id => batch.delete(doc(db, 'messages', id)))
    await batch.commit()
    setSelected(new Set())
    await fetchMessages()
  }

  const formatDate = (ts) => {
    if (!ts?.toDate) return '—'
    return ts.toDate().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <>
      <TopBar title="Messages" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-mid text-sm">{messages.length} messages</p>
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500/20 border border-red-400/20 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Delete {selected.size} Selected
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-gray-mid text-sm">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-mid text-sm text-center py-12">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {/* Select All */}
            <label className="flex items-center gap-3 px-4 py-2 text-xs text-gray-dark cursor-pointer hover:text-gray-mid transition-colors">
              <input
                type="checkbox"
                checked={messages.length > 0 && selected.size === messages.length}
                onChange={toggleAll}
                className="accent-accent-lime w-3.5 h-3.5"
              />
              Select All
            </label>

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`rounded-xl border p-5 transition-all ${
                  selected.has(msg.id)
                    ? 'bg-white/[0.04] border-accent-lime/30'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selected.has(msg.id)}
                    onChange={() => toggleSelect(msg.id)}
                    className="accent-accent-lime mt-1 w-3.5 h-3.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-white font-medium text-sm truncate">{msg.name || 'Anonymous'}</span>
                        <span className="text-gray-dark text-xs">·</span>
                        <a href={`mailto:${msg.email}`} className="text-accent-lime text-xs hover:underline truncate">{msg.email}</a>
                      </div>
                      <span className="text-gray-dark text-[10px] shrink-0">{formatDate(msg.createdAt)}</span>
                    </div>
                    {msg.budget && msg.budget !== 'Select...' && (
                      <span className="inline-block text-[10px] text-accent-orange bg-accent-orange/10 border border-accent-orange/20 rounded-full px-2 py-0.5 mb-2">{msg.budget}</span>
                    )}
                    <p className="text-gray-mid text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-400/40 hover:text-red-400 text-xs transition-colors shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
