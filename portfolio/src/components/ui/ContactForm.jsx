import { useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', budget: 'Select...', message: '' })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: serverTimestamp()
      })
      setStatus('success')
      setForm({ name: '', email: '', budget: 'Select...', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="mt-24 pt-12 border-t border-white/5">
      <div className="mb-12">
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-white uppercase">
          LET'S WORK
        </h2>
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          TOGETHER
        </h2>
      </div>

      {status === 'success' ? (
        <div className="bg-accent-orange/10 border border-accent-orange/20 text-accent-orange p-6 rounded-xl font-poppins text-center">
          Thanks for reaching out! I'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1">Name</label>
              <input 
                required
                type="text" 
                placeholder="Your Name"
                className="w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-orange transition-colors"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1">Email</label>
              <input 
                required
                type="email" 
                placeholder="you@example.com"
                className="w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-orange transition-colors"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1">Budget</label>
            <div className="relative">
              <select 
                className="w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-orange transition-colors appearance-none"
                value={form.budget}
                onChange={e => setForm({...form, budget: e.target.value})}
              >
                <option>Select...</option>
                <option>$1k - $5k</option>
                <option>$5k - $10k</option>
                <option>$10k+</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-mid">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#666666] text-[11px] uppercase tracking-wider font-semibold mb-2 ml-1">Message</label>
            <textarea 
              required
              rows={4}
              placeholder="Message"
              className="w-full bg-[#2d2a29] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent-orange transition-colors resize-none"
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full bg-accent-orange text-white font-poppins font-semibold text-sm py-4 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 mt-4"
          >
            {status === 'submitting' ? 'Sending...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  )
}
