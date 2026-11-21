import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { preloadProps } from '../routes'

export default function NotFound() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Page not found | Pratik Gond'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="mb-16 sm:mb-24 pt-6 sm:pt-0">
      <div className="mb-8 sm:mb-12">
        <h1 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-white uppercase">
          404
        </h1>
        <p className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-[#333333] uppercase">
          NOT FOUND
        </p>
      </div>
      <p className="text-gray-mid font-inter mb-8 max-w-md">
        This page doesn’t exist or has moved.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-accent-orange text-white text-sm font-poppins font-bold rounded-xl hover:bg-accent-orange/90 active:scale-[0.98] transition-[transform,background-color] duration-150"
        >
          Go home
        </Link>
        <Link
          to="/projects"
          {...preloadProps('/projects')}
          className="inline-flex items-center px-6 py-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-poppins font-semibold rounded-xl active:scale-[0.98] transition-all"
        >
          See projects
        </Link>
      </div>
    </div>
  )
}
