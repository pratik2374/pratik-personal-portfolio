import Link from "next/link"
import { client, urlFor } from "@/lib/sanity"
import Image from "next/image"

// Revalidate every hour
export const revalidate = 3600

async function getPosts() {
  const query = `*[_type == "blog" && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    date,
    readTime,
    image
  }`
  return client.fetch(query)
}

export default async function Home() {
  const posts = await getPosts()
  
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1)

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Exploring <span className="text-orange-500">ideas</span>, engineering, and the future of web.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
          A collection of thoughts on software development, artificial intelligence, and building products people love.
        </p>
      </div>

      {featuredPost && (
        <div className="mb-20">
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6">
              {featuredPost.image ? (
                <Image
                  src={urlFor(featuredPost.image).width(1200).height(600).url()}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <time dateTime={featuredPost.date}>
                  {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
                <span>·</span>
                <span>{featuredPost.readTime || '5 min read'}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-500 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg line-clamp-2">
                {featuredPost.summary}
              </p>
            </div>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recentPosts.map((post: any) => (
          <Link key={post._id} href={`/blog/${post.slug}`} className="group flex flex-col">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
              {post.image ? (
                <Image
                  src={urlFor(post.image).width(600).height(340).url()}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</div>
              )}
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
                <span>·</span>
                <span>{post.readTime || '5 min read'}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                {post.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
