import { getCliClient } from 'sanity/cli'
import fs from 'fs'
import path from 'path'

const client = getCliClient()

async function main() {
  console.log('--- 1. Uploading Editorial Cover Image to Sanity ---')
  const imagePath = 'C:\\Users\\prati\\.gemini\\antigravity\\brain\\3a027f37-71f3-4fc0-9e49-604597c4c64e\\llm_memory_cover_1794851741160.jpg'
  
  const imageStream = fs.createReadStream(imagePath)
  const imageAsset = await client.assets.upload('image', imageStream, {
    filename: 'llm_memory_cover.jpg',
  })
  console.log(`✓ Image uploaded successfully: ${imageAsset._id}`)

  console.log('\n--- 2. Loading Parsed Portable Text Blocks ---')
  const blocksPath = 'C:\\Users\\prati\\.gemini\\antigravity\\brain\\3a027f37-71f3-4fc0-9e49-604597c4c64e\\scratch\\memory_post_blocks.json'
  const blocks = JSON.parse(fs.readFileSync(blocksPath, 'utf-8'))
  console.log(`✓ Loaded ${blocks.length} content blocks.`)

  console.log('\n--- 3. Creating and Publishing Blog Post Document ---')
  const postDocument = {
    _id: 'post-llm-chatbot-memory-management',
    _type: 'blog',
    title: 'Your LLM Chatbot Has Amnesia: Designing Memory That Actually Understands Users',
    slug: {
      _type: 'slug',
      current: 'llm-chatbot-memory-management',
    },
    summary:
      'Why context stuffing and message summarization fail in long-running LLM chatbots, and how Dr. Aria uses a 5-layer encrypted memory architecture.',
    date: '2026-11-16',
    readTime: '14 min read',
    isFeatured: true,
    featuredInDesignThoughts: true,
    category: {
      _type: 'reference',
      _ref: 'category-ai-agents',
    },
    tags: [
      'LLM Engineering',
      'AI Memory Architecture',
      'System Design',
      'Node.js',
      'MongoDB',
      'Dr. Aria',
    ],
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
      alt: '5-layer LLM chatbot memory architecture and cognitive nodes',
    },
    content: blocks,
  }

  const result = await client.createOrReplace(postDocument)
  console.log(`✓ Post published to Sanity Content Lake! ID: ${result._id}`)
  console.log(`✓ Title: ${result.title}`)
  console.log(`✓ Slug: /blog/${result.slug?.current}`)
}

main().catch((err) => {
  console.error('Error publishing blog post:', err)
  process.exit(1)
})
