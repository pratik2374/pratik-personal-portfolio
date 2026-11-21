import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Cpu, Server, Terminal, Award } from "lucide-react"
import { SITE_URL } from "@/lib/sanity"
import { jsonLd } from "@/lib/seo"
import { PERSON_ID } from "@/lib/profile"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Pratik Gond, Software Engineer specializing in Artificial Intelligence, RAG toolchains, distributed systems, and web architecture.",
  alternates: {
    canonical: "/about",
  },
}

// Google's ProfilePage type: tells search engines this page is about the site's author
// (the Person entity itself is defined once, site-wide, in the root layout).
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#page`,
  url: `${SITE_URL}/about`,
  name: "About Pratik Gond",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  mainEntity: { "@id": PERSON_ID },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(profilePageSchema) }} />
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-orange-500 transition-colors min-h-[44px] min-w-[44px] py-2 active:scale-[0.98] duration-150"
        >
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">About</span>
      </nav>

      {/* Hero Header */}
      <header className="mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-4">
          <Terminal className="w-3.5 h-3.5" />
          <span>About the Author</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white mb-6 leading-tight">
          Hi, I&apos;m <span className="text-orange-500">Pratik Gond</span>.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed font-normal">
          I build resilient software systems, explore frontier Artificial Intelligence, and write technical blueprints for modern engineering teams.
        </p>
      </header>

      {/* Profile Card & Highlights */}
      <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#151515]/70 mb-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">2 Years</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Engineering Experience</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">AI & Agents</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">RAG, LLMs & Multi-Agent</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">Scale & Cloud</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Distributed Architecture</div>
          </div>
        </div>
      </div>

      {/* Main Narrative */}
      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-orange-500 mb-16">
        <h2>Engineering Philosophy</h2>
        <p>
          I believe exceptional software is born at the intersection of rigorous architecture, uncompromising performance,
          and deliberate aesthetic simplicity. Modern full-stack engineering is no longer just about writing code; it is about
          orchestrating complex distributed systems, integrating generative intelligence responsibly, and maintaining sub-second
          responsiveness for users across the globe.
        </p>
        <p>
          Over the past 2 years of software engineering, I have designed and deployed products ranging from high-concurrency
          web applications and reactive frontend dashboards to complex autonomous agent pipelines and vector search infrastructures.
        </p>

        <h2>What This Publication Is About</h2>
        <p>
          This blog serves as an open technical laboratory where I document:
        </p>
        <ul>
          <li><strong>Autonomous AI & LLM Systems:</strong> Building agentic architectures, evaluating reasoning models, vector retrieval (RAG), and deterministic orchestration.</li>
          <li><strong>Distributed Architecture & Backend:</strong> Event sourcing with Kafka, caching hierarchies, database sharding, fault tolerance, and idempotency guarantees.</li>
          <li><strong>Modern Web Platforms:</strong> Deep explorations of Next.js, React 19, TypeScript, edge runtimes, and zero-bundle web applications.</li>
          <li><strong>Engineering Craft & System Design:</strong> Pragmatic lessons learned from shipping to real customers in high-stakes production environments.</li>
        </ul>
      </article>

      {/* CTA to Portfolio */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#141414] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Want to see live projects?</h3>
          <p className="text-gray-600 dark:text-gray-400 text-base max-w-xl font-normal">
            Explore interactive case studies, production demo videos, GitHub repositories, and full work history on my main portfolio.
          </p>
        </div>
        <a
          href="https://pratikgond.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors shrink-0 active:scale-[0.98] duration-150"
        >
          <span>Explore Portfolio</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
