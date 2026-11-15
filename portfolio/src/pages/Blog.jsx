import { useCollection } from '../hooks/useCollection'
import BlogCard from '../components/ui/BlogCard'

export default function Blog() {
  const { data: posts, loading } = useCollection('blog')

  return (
    <div className="mb-16 sm:mb-24 pt-6 sm:pt-0">
      <div className="mb-8 sm:mb-12">
        <h1 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-white uppercase">
          DESIGN
        </h1>
        <h1 className="font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter text-[#333333] uppercase">
          THOUGHTS
        </h1>
      </div>
      
      <div className="flex flex-col gap-4">
        {loading && (!posts || posts.length === 0) ? (
          [1, 2, 3].map(i => (
            <div key={i} className="p-4 sm:p-5 rounded-2xl bg-[#181615] border border-white/5 animate-pulse flex flex-col sm:flex-row gap-4 sm:gap-5">
              <div className="w-full sm:w-44 h-36 sm:h-28 rounded-xl bg-white/10 shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="h-4 bg-white/10 rounded w-1/4 mb-3" />
                <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/5 rounded w-full" />
              </div>
            </div>
          ))
        ) : posts && posts.length > 0 ? (
          posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-gray-mid text-sm font-inter">No blog posts found.</p>
        )}
      </div>
    </div>
  )
}
