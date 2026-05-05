import { useEffect, useState } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Link } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'

const COLLECTIONS = [
  { name: 'blog', label: 'Blog Posts', path: '/blog' },
  { name: 'projects', label: 'Projects', path: '/projects' },
  { name: 'tools', label: 'Tools', path: '/tools' },
  { name: 'experience', label: 'Experience', path: '/experience' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    Promise.all(
      COLLECTIONS.map(async ({ name }) => {
        const snap = await getCountFromServer(collection(db, name))
        return [name, snap.data().count]
      })
    ).then(entries => setCounts(Object.fromEntries(entries)))
  }, [])

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="p-8">
        <p className="text-gray-mid text-sm mb-8">Overview of all content collections.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {COLLECTIONS.map(({ name, label, path }) => (
            <Link
              key={name}
              to={path}
              className="block p-6 bg-card rounded-xl border border-white/5 hover:border-accent-lime/20 transition-colors"
            >
              <p className="text-3xl font-poppins font-bold text-white mb-1">
                {counts[name] ?? '—'}
              </p>
              <p className="text-gray-mid text-sm">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
