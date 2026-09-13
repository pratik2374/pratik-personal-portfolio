import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | Pratik Gond",
  description: "Learn more about Pratik Gond",
}

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-lg dark:prose-invert prose-orange">
      <h1>About Me</h1>
      <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl mb-8 flex items-center justify-center text-gray-500">
        [Add your awesome team/personal photo here via Sanity later]
      </div>
      <p>
        Hi, I'm Pratik Gond. I'm a Software Engineer with over 12+ years of experience building modern web applications, AI systems, and high-performance digital experiences.
      </p>
      <p>
        This blog is my dedicated space to share engineering deep-dives, design thoughts, and insights into the rapidly evolving world of Artificial Intelligence.
      </p>
      <h2>What you'll find here</h2>
      <ul>
        <li><strong>Engineering Deep Dives:</strong> Technical tutorials on React, Next.js, and backend architecture.</li>
        <li><strong>AI & RAG:</strong> Explorations of modern LLM toolchains (LangChain, vector databases).</li>
        <li><strong>Design:</strong> Thoughts on creating beautiful, intuitive interfaces.</li>
      </ul>
      <p>
        Want to see my actual work? Check out my <a href="https://pratikgond.tech">Main Portfolio</a>.
      </p>
    </div>
  )
}
