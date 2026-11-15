import { useCollection } from '../../hooks/useCollection'
import BlogCard from '../ui/BlogCard'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function BlogSection() {
  const { data: posts, loading } = useCollection('blog')

  // 1. Separate chosen/featured blogs from remaining blogs
  const allPosts = posts || []
  const chosenPosts = allPosts.filter(p => p.featuredInDesignThoughts === true || p.isFeatured === true)
  const remainingPosts = allPosts.filter(p => !chosenPosts.some(cp => cp.id === p.id))

  // 2. Selection logic:
  // If user has chosen blogs in CMS, prioritize them (up to 3).
  // If fewer than 3 chosen, backfill with newest blogs up to 3 total.
  // If total available blogs is less than 3 (e.g. 1 or 2), display EXACTLY the total count available.
  let displayPosts = []
  if (chosenPosts.length >= 3) {
    displayPosts = chosenPosts.slice(0, 3)
  } else {
    displayPosts = [...chosenPosts, ...remainingPosts].slice(0, 3)
  }

  return (
    <section className="mb-16 sm:mb-24">
      {/* Section Heading — In Code, Renders Instantly */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-white uppercase">
            DESIGN
          </h2>
          <h2 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-[#333333] uppercase">
            THOUGHTS
          </h2>
        </motion.div>

        {/* View all thoughts link if multiple blogs exist */}
        {allPosts.length > 3 && (
          <Link 
            to="/blog" 
            className="text-sm font-poppins font-semibold text-accent-orange hover:underline inline-flex items-center gap-1.5 pb-2"
          >
            <span>View All ({allPosts.length})</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        )}
      </div>

      {/* Editorial Posts List */}
      <div className="flex flex-col">
        {loading && displayPosts.length === 0 ? (
          [1, 2].map(i => (
            <div key={i} className="border-b border-white/5 pb-8 mb-8 animate-pulse">
              <div className="h-7 bg-white/10 rounded-md w-3/4 mb-3" />
              <div className="h-4 bg-white/5 rounded-md w-full mb-2" />
              <div className="h-4 bg-white/5 rounded-md w-2/3 mb-4" />
              <div className="h-3 bg-white/5 rounded-md w-1/4" />
            </div>
          ))
        ) : displayPosts.length > 0 ? (
          displayPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-gray-mid text-sm font-inter">No blog posts published yet.</p>
        )}
      </div>
    </section>
  )
}
