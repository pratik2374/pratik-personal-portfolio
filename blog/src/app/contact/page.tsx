import { Metadata } from "next"
import Link from "next/link"
import { Mail, Globe, MessageSquare, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact & Editorial | Pratik Gond",
  description: "Get in touch with Pratik Gond for technical inquiries, speaking, engineering consulting, or editorial feedback.",
  alternates: {
    canonical: "https://blog.pratikgond.tech/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Contact</span>
      </nav>

      <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-4">
          Direct Channels
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
          Have feedback on an architectural deep dive, a question about LLM agents, or want to discuss engineering consulting? My inbox is always open.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Direct Email Card */}
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151515] shadow-xs hover:border-orange-500/50 transition-colors flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Direct Email</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              Best for technical inquiries, consulting queries, collaboration opportunities, or errata corrections.
            </p>
          </div>
          <a
            href="mailto:pratik.gond.dev@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
          >
            <span>pratik.gond.dev@gmail.com</span>
            <Send className="w-4 h-4" />
          </a>
        </div>

        {/* Portfolio & Work Card */}
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151515] shadow-xs hover:border-orange-500/50 transition-colors flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Main Portfolio</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              Explore my production applications, open-source projects, case studies, and engineering background.
            </p>
          </div>
          <a
            href="https://pratikgond.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium transition-colors"
          >
            <span>Visit pratikgond.tech</span>
            <span className="text-sm">↗</span>
          </a>
        </div>
      </div>

      {/* Social Network Links */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-8 bg-gray-50 dark:bg-[#0c0c0c]">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          Connect Across the Web
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Find me discussing system architecture, building AI tools, and shipping code on these platforms:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://github.com/pratikgond"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151515] hover:border-orange-500 transition-colors"
          >
            <svg className="w-6 h-6 fill-current text-gray-900 dark:text-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">GitHub</div>
              <div className="text-xs text-gray-500">@pratikgond · Code repositories &amp; PRs</div>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/pratikgond"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151515] hover:border-orange-500 transition-colors"
          >
            <svg className="w-6 h-6 fill-current text-blue-600" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">LinkedIn</div>
              <div className="text-xs text-gray-500">in/pratikgond · Professional network</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
