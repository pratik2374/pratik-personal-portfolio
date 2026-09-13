import { client, urlFor } from "@/lib/sanity"
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

export const revalidate = 3600 // revalidate every hour

async function getPost(slug: string) {
  const query = `*[_type == "blog" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    title,
    summary,
    date,
    readTime,
    image,
    content
  }`
  return client.fetch(query, { slug })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  
  const ogImage = post.image ? urlFor(post.image).width(1200).height(630).url() : undefined

  return {
    title: `${post.title} | Pratik Gond`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      authors: ["Pratik Gond"],
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: ogImage ? [ogImage] : [],
    }
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  // Generate JSON-LD Schema for Extreme SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title || "Blog Post",
    "image": post.image ? [urlFor(post.image).url()] : [],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": [{
      "@type": "Person",
      "name": "Pratik Gond",
      "url": "https://pratikgond.tech"
    }],
    "description": post.summary || ""
  }

  const ptComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null
        return (
          <figure className="my-12 flex flex-col items-center">
            <div className="relative w-full overflow-hidden rounded-xl flex justify-center">
              <img
                src={urlFor(value).url()}
                alt={value.alt || 'Blog image'}
                className="max-w-full h-auto max-h-[700px] object-contain rounded-xl"
              />
            </div>
            {(value.caption || value.alt) && (
              <figcaption className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                {value.caption || value.alt}
              </figcaption>
            )}
          </figure>
        )
      },
      code: ({ value }: any) => {
        return (
          <div className="my-8 rounded-xl overflow-hidden bg-[#1e1e1e] text-sm">
            <div className="flex items-center px-4 py-2 bg-[#2d2d2d] text-gray-300 text-xs font-mono uppercase">
              {value.language || 'code'}
            </div>
            <SyntaxHighlighter
              language={value.language || 'javascript'}
              style={atomDark}
              customStyle={{ margin: 0, padding: '1.5rem', background: '#1e1e1e' }}
            >
              {value.code}
            </SyntaxHighlighter>
          </div>
        )
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="pb-24">
        {/* Header Section */}
        <header className="bg-white dark:bg-[#111] pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-10">
              ← Back to Blog
            </Link>
            
            {post.title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-white mb-6 leading-[1.1]">
                {post.title}
              </h1>
            )}
            
            {post.summary && (
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-snug mb-10">
                {post.summary}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span className="text-black dark:text-white font-semibold">Pratik Gond</span>
              {post.date && (
                <>
                  <span>·</span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                </>
              )}
              <span>·</span>
              <span>{post.readTime || '5 min read'}</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {post.image && (
          <div className="w-full max-w-6xl mx-auto px-4 py-10 flex justify-center">
            <div className="relative w-full rounded-lg overflow-hidden flex justify-center">
              <img
                src={urlFor(post.image).width(1600).url()}
                alt={post.title || "Hero Image"}
                className="max-w-full h-auto max-h-[800px] object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-3xl mt-8">
          <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-black dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-lg prose-img:w-full">
            {post.content ? (
              <PortableText value={post.content} components={ptComponents} />
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </div>
      </article>
    </>
  )
}
