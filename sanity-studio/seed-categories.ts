import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const CATEGORIES = [
  {
    _id: 'category-ai-agents',
    _type: 'category',
    title: 'Artificial Intelligence & Agents',
    slug: { _type: 'slug', current: 'ai-agents' },
    description: 'Deep dives into LLM architectures, autonomous agents, RAG pipelines, and modern AI engineering.',
    color: 'orange',
    order: 1,
  },
  {
    _id: 'category-software-architecture',
    _type: 'category',
    title: 'Software Architecture & Engineering',
    slug: { _type: 'slug', current: 'software-architecture' },
    description: 'Production-grade system design, clean architecture patterns, reliability, and code craftsmanship.',
    color: 'blue',
    order: 2,
  },
  {
    _id: 'category-web-engineering',
    _type: 'category',
    title: 'Modern Web & Frontend',
    slug: { _type: 'slug', current: 'web-engineering' },
    description: 'Next.js, React 19, TypeScript, performance engineering, and state-of-the-art UI architectures.',
    color: 'emerald',
    order: 3,
  },
  {
    _id: 'category-system-design-cloud',
    _type: 'category',
    title: 'System Design & Cloud',
    slug: { _type: 'slug', current: 'system-design-cloud' },
    description: 'Distributed systems, cloud infrastructure, database scaling, and resilient backend pipelines.',
    color: 'purple',
    order: 4,
  },
]

async function seed() {
  console.log('--- 1. Creating/Ensuring Categories ---')
  for (const cat of CATEGORIES) {
    const res = await client.createOrReplace(cat)
    console.log(`✓ Category ready: ${res.title} (${res._id})`)
  }

  console.log('\n--- 2. Patching Existing Featured Post ---')
  const gptPostId = '50869ef7-ee69-447a-ae5e-302d5be285e4'
  try {
    await client
      .patch(gptPostId)
      .set({
        isFeatured: true,
        category: { _type: 'reference', _ref: 'category-ai-agents' },
        tags: ['AI Agents', 'LLMs', 'Autonomous Systems', 'GPT-6'],
      })
      .commit()
    console.log(`✓ Patched GPT-6 Astra post with category and isFeatured=true`)
  } catch (err: any) {
    console.error('Failed to patch GPT post:', err.message)
  }

  console.log('\n--- 3. Creating Quality Topic Posts ---')
  const samplePosts = [
    {
      _id: 'post-resilient-distributed-systems',
      _type: 'blog',
      title: 'Building Resilient Distributed Systems: Lessons from Production Failures',
      slug: { _type: 'slug', current: 'building-resilient-distributed-systems' },
      isFeatured: false,
      category: { _type: 'reference', _ref: 'category-software-architecture' },
      tags: ['Architecture', 'System Design', 'Microservices', 'Scalability'],
      date: '2026-10-18',
      readTime: '7 min read',
      summary: 'A comprehensive guide to fault tolerance, idempotency keys, circuit breakers, and graceful degradation in high-throughput cloud architectures.',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'In distributed systems engineering, failures are not an exception—they are an inevitable guarantee. When designing services that scale across multiple nodes and geographies, assuming network reliability is a fatal flaw.'
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Core Architectural Tenets for High Availability'
            }
          ],
          markDefs: [],
          style: 'h2'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '1. Idempotency by Default: Every non-GET mutating operation must accept an Idempotency-Key. If an intermittent network partition drops a connection after processing, clients can safely retry without duplicating records.'
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '2. Circuit Breakers & Fallbacks: Never let downstream outages cascade upward. Use circuit breakers (such as Resilience4j or Polly patterns) with exponential backoff and full jitter.'
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: '3. Graceful Degradation: If the recommendation engine is down, serve cached fallback popular items rather than a 500 error.'
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ]
    },
    {
      _id: 'post-mastering-nextjs-16-react-19',
      _type: 'blog',
      title: 'Mastering Next.js 16 & React 19: Server Actions, Streaming, and Zero-JS Architecture',
      slug: { _type: 'slug', current: 'mastering-nextjs-16-react-19-server-actions' },
      isFeatured: false,
      category: { _type: 'reference', _ref: 'category-web-engineering' },
      tags: ['Next.js', 'React 19', 'Web Performance', 'TypeScript'],
      date: '2026-10-29',
      readTime: '6 min read',
      summary: 'Deep dive into modern React 19 paradigms, React Server Components (RSC), Turbopack internals, and building lightning-fast interactive web applications.',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Next.js 16 and React 19 represent a monumental evolution in how we conceive, render, and hydrate full-stack applications. The boundary between client and server is no longer an afterthought—it is a first-class architectural primitive.'
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'The Power of Turbopack and Zero-Bundle Server Components'
            }
          ],
          markDefs: [],
          style: 'h2'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'By keeping complex markdown parsers, cryptographic modules, and database drivers strictly on the server, we ship zero JavaScript bytes for content that does not need client-side reactivity. First Contentful Paint (FCP) and Time to Interactive (TTI) drop to sub-second benchmarks even on 3G cellular connections.'
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ]
    },
    {
      _id: 'post-event-driven-architectures-kafka',
      _type: 'blog',
      title: 'Event-Driven Architectures at Scale: Kafka, Event Sourcing, and CQRS in Practice',
      slug: { _type: 'slug', current: 'event-driven-architectures-kafka-cqrs' },
      isFeatured: false,
      category: { _type: 'reference', _ref: 'category-system-design-cloud' },
      tags: ['Kafka', 'Event Driven', 'Cloud', 'Distributed Systems'],
      date: '2026-11-04',
      readTime: '9 min read',
      summary: 'Architectural patterns for decoupled microservices, handling schema evolution, achieving strict message ordering, and managing eventual consistency.',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Synchronous REST microservices quickly become fragile webs of latency and cascading failures. Transitioning to an event-driven architecture using Apache Kafka allows systems to achieve true decoupled asynchronous orchestration.'
            }
          ],
          markDefs: [],
          style: 'normal'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Partitioning Keys and Strict Ordering Guarantees'
            }
          ],
          markDefs: [],
          style: 'h2'
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Choosing the right partition key is critical. In financial and order-processing systems, partitioning by aggregate root ID (e.g. accountId or orderId) guarantees total in-order processing within a single consumer partition while scaling consumption linearly across broker nodes.'
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ]
    }
  ]

  for (const post of samplePosts) {
    const res = await client.createOrReplace(post)
    console.log(`✓ Post ready: ${res.title} (${res._id})`)
  }

  console.log('\nSeed completed successfully!')
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
