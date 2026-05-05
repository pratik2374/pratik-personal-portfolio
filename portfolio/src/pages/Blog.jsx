import { useCollection } from '../hooks/useCollection'
import BlogCard from '../components/ui/BlogCard'

export default function Blog() {
  const { data: posts, loading } = useCollection('blog')

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-poppins font-bold text-4xl text-white mb-4">Blog</h1>
      <p className="text-gray-mid mb-12">Writing about AI, engineering, and building things.</p>
      {loading ? (
        <p className="text-gray-mid">Loading...</p>
      ) : (
        <div>
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
