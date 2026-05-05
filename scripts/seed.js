import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const serviceAccount = require('./serviceAccountKey.json')

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

async function seed() {
  // Settings
  await db.collection('settings').doc('general').set({
    name: 'Pratik Gond',
    tagline: 'AI Engineer · LLMs · RAG · Generative AI · C++',
    bio: 'AI Engineer with 1+ year of production experience building LLM-powered applications, RAG pipelines, and multi-agent systems. Delivered solutions serving 500+ daily users with 96% retrieval accuracy and 80% reduction in manual workflows. Currently at NIT Kurukshetra (IT, 2027).',
    email: 'pratik.gond.dev@gmail.com',
    github: 'https://github.com/pratik2374',
    linkedin: 'https://linkedin.com/in/pratikgond',
  })
  console.log('✓ Settings seeded')

  // Experience
  const experiences = [
    {
      companyName: 'Build Fast with AI',
      slug: 'build-fast-with-ai',
      status: 'live',
      link: 'https://buildfastwithai.com',
      date: 'Apr 2025 – Mar 2026',
      order: 1,
      description: `AI Engineer Intern (Full-time · 1 Year · Remote)\n\n• Shipped a production RAG chatbot serving 500+ vendors daily at <8s latency with 96% retrieval accuracy via A/B testing of retrieval strategies, embedding models, and chunking approaches.\n• Engineered automated compliance checks on image data from 300+ vendors weekly using LLMs, OpenCV, and SQL — eliminating ~80% of manual review effort.\n• Optimized end-to-end data pipelines and LLM API architecture, cutting latency by 10% while building a multilingual product recommendation engine using semantic embeddings.\n• Led sprint planning, code reviews, and architecture decisions for a team of 3; mentored a junior intern on RAG architecture and prompt engineering.`,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      companyName: 'Fiverr — 3D Product Animation',
      slug: 'fiverr-3d-animation',
      status: 'live',
      link: 'https://fiverr.com',
      date: 'Apr 2020 – Jan 2024',
      order: 2,
      description: `Freelancer (3 years 10 months)\n\n• Delivered 15+ 3D product animation projects for international clients across travel, lifestyle, and consumer goods — earning 5-star ratings across all engagements.\n• Managed complete client engagements independently — scoping, timelines, revisions, and delivery.\n• Produced optimized animations using Cinema 4D and Adobe After Effects for Instagram, YouTube, and Facebook Ads.`,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  ]

  for (const exp of experiences) {
    await db.collection('experience').add(exp)
  }
  console.log('✓ Experience seeded')

  // Projects
  const projects = [
    {
      title: 'Dr. Aria — AI-Powered Mental Wellness Platform',
      slug: 'dr-aria',
      status: 'live',
      link: 'https://github.com/pratik2374',
      description: 'Production-ready AI therapy platform using GPT-4o, real-time SSE streaming, and a research-backed multi-framework system prompt (CBT · Psychodynamic · Humanistic · Crisis Intervention). Features a 5-layer longitudinal memory system across 8 MongoDB collections and AES-256-GCM per-user encryption.',
      image: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      title: 'Karen — Offline/Online AI Voice Assistant',
      slug: 'karen',
      status: 'live',
      link: 'https://github.com/pratik2374',
      description: 'Dual-mode agentic voice assistant: online mode uses OpenAI + Agno with MCP integrations; offline mode falls back to local Faster-Whisper STT and Piper ONNX TTS — guaranteeing zero-data-leak functionality without internet. Built with async-first core handling voice I/O and persistent SQLite-backed memory.',
      image: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  ]

  for (const project of projects) {
    await db.collection('projects').add(project)
  }
  console.log('✓ Projects seeded')

  // Tools
  const tools = [
    { title: 'VS Code', slug: 'vscode', status: 'live', description: 'Code Editor', image: '', link: 'https://code.visualstudio.com' },
    { title: 'Python', slug: 'python', status: 'live', description: 'Primary Language', image: '', link: 'https://python.org' },
    { title: 'React', slug: 'react', status: 'live', description: 'Frontend Framework', image: '', link: 'https://react.dev' },
    { title: 'LangChain', slug: 'langchain', status: 'live', description: 'LLM Orchestration', image: '', link: 'https://langchain.com' },
    { title: 'Docker', slug: 'docker', status: 'live', description: 'Containerization', image: '', link: 'https://docker.com' },
    { title: 'Node.js', slug: 'nodejs', status: 'live', description: 'Backend Runtime', image: '', link: 'https://nodejs.org' },
  ]

  for (const tool of tools) {
    await db.collection('tools').add(tool)
  }
  console.log('✓ Tools seeded')

  console.log('\n✅ All seed data written to Firestore.')
}

seed().catch(console.error)
