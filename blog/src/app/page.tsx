import { client, BlogPost, Category } from "@/lib/sanity"
import { BlogHomeView } from "@/components/BlogHomeView"
import { Metadata } from "next"

export const revalidate = 3600 // Revalidate cache every hour

export const metadata: Metadata = {
  title: "Pratik Gond | Engineering, AI & Architecture Journal",
  description:
    "Technical deep dives into Artificial Intelligence, autonomous agents, modern web architecture, and production software engineering by Pratik Gond.",
  alternates: {
    canonical: "https://blog.pratikgond.tech",
  },
}

async function getCategories(): Promise<Category[]> {
  const query = `*[_type == "category" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    color,
    order
  }`
  return client.fetch(query).catch(() => [])
}

async function getAllPosts(): Promise<BlogPost[]> {
  const query = `*[_type == "blog" && !(_id in path("drafts.**")) && defined(slug.current)] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    date,
    readTime,
    isFeatured,
    tags,
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      description
    },
    image
  }`
  return client.fetch(query).catch(() => [])
}

export default async function Home() {
  const [categories, allPosts] = await Promise.all([
    getCategories(),
    getAllPosts(),
  ])

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
      <BlogHomeView
        categories={categories}
        allPosts={allPosts}
      />
    </div>
  )
}
