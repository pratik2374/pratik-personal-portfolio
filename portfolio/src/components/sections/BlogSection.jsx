import { useCollection } from '../../hooks/useCollection'
import BlogCard from '../ui/BlogCard'
import { motion } from 'framer-motion'

export default function BlogSection() {
  const { data: posts, loading } = useCollection('blog')

  if (loading) return null
  
  // Fallback to placeholder posts if the database is empty
  const displayPosts = posts && posts.length > 0 ? posts.slice(0, 3) : [
    {
      id: 'placeholder-1',
      title: 'The Future of Interface Design: Moving Beyond Screens',
      summary: 'Exploring the paradigm shift from graphical user interfaces to spatial computing and zero-UI environments. As we look towards the next decade, how will designers adapt to multimodal interactions?',
      readTime: '5min read',
      createdAt: new Date()
    },
    {
      id: 'placeholder-2',
      title: 'Why Micro-interactions Matter in Modern Web Apps',
      summary: 'A deep dive into how subtle animations and state changes can dramatically improve user retention and perceived performance. We explore the psychology behind satisfying digital experiences.',
      readTime: '4min read',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: 'placeholder-3',
      title: 'Designing for Accessibility: A Comprehensive Guide',
      summary: "Creating inclusive digital products isn't just about compliance—it's about good design. Practical strategies for integrating accessibility into your product development lifecycle from day one.",
      readTime: '8min read',
      createdAt: new Date(Date.now() - 172800000)
    }
  ]

  return (
    <section className="mb-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12"
      >
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-white uppercase">
          DESIGN
        </h2>
        <h2 className="font-poppins font-bold text-5xl sm:text-[72px] leading-[0.9] tracking-tighter text-[#333333] uppercase">
          THOUGHTS
        </h2>
      </motion.div>
      <div className="flex flex-col gap-2">
        {displayPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
