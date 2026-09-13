import { getCliClient } from 'sanity/cli'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { htmlToBlocks } from '@sanity/block-tools'
import { Schema } from '@sanity/schema'
import { JSDOM } from 'jsdom'
import { readFileSync } from 'fs'

const client = getCliClient()

const firebaseConfig = {
  apiKey: "AIzaSyCRS8PLiSV5o-52BFDu58RR4oYhEx7QrEk",
  authDomain: "personal-portfolio-ac2cd.firebaseapp.com",
  projectId: "personal-portfolio-ac2cd",
  storageBucket: "personal-portfolio-ac2cd.firebasestorage.app",
  messagingSenderId: "1193994002",
  appId: "1:1193994002:web:84912183b4d8cdb25e75cb",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// We need a compiled schema for block-tools
const defaultSchema = Schema.compile({
  name: 'myBlog',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        { title: 'Title', name: 'title', type: 'string' },
        { title: 'Body', name: 'body', type: 'array', of: [{ type: 'block' }] },
      ],
    },
  ],
})

const blockContentType = defaultSchema.get('blogPost').fields.find((field: any) => field.name === 'body').type

function convertHtmlToPortableText(html: string) {
  if (!html) return undefined
  try {
    return htmlToBlocks(html, blockContentType, {
      parseHtml: (htmlContent) => new JSDOM(htmlContent).window.document,
    })
  } catch (err) {
    console.error("Failed to convert HTML", err)
    return undefined
  }
}

async function uploadImageFromUrl(url: string) {
  if (!url) return undefined
  try {
    console.log(`Uploading image: ${url}`)
    const res = await fetch(url)
    const buffer = await res.arrayBuffer()
    const asset = await client.assets.upload('image', Buffer.from(buffer))
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id }
    }
  } catch (err) {
    console.error("Failed to upload image", url, err.message)
    return undefined
  }
}

async function migrateCollection(collectionName: string, type: string) {
  console.log(`Migrating ${collectionName} to ${type}...`)
  const snapshot = await getDocs(collection(db, collectionName))
  for (const doc of snapshot.docs) {
    const data = doc.data()
    console.log(`- Document: ${data.title || data.companyName || doc.id}`)
    
    // Upload main image
    let imageAsset = await uploadImageFromUrl(data.image || data.logo)
    
    // Document Base
    const sanityDoc: any = {
      _type: type,
    }
    
    // Type specific mappings
    if (type === 'blog') {
      sanityDoc.title = data.title
      sanityDoc.slug = { _type: 'slug', current: data.slug || doc.id }
      if (data.createdAt) {
        const d = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        sanityDoc.date = d.toISOString().split('T')[0]
      }
      sanityDoc.readTime = data.readTime || '5 min read'
      sanityDoc.summary = data.summary
      sanityDoc.content = convertHtmlToPortableText(data.content || data.description)
      sanityDoc.image = imageAsset
    } 
    else if (type === 'project') {
      sanityDoc.title = data.title
      sanityDoc.slug = { _type: 'slug', current: data.slug || doc.id }
      sanityDoc.image = imageAsset
      sanityDoc.description = convertHtmlToPortableText(data.description || data.content)
      sanityDoc.link = data.link
      sanityDoc.github = data.github
      sanityDoc.demo = data.demo
      sanityDoc.video = data.video
      
      if (data.gallery && Array.isArray(data.gallery)) {
        sanityDoc.gallery = []
        for (const gUrl of data.gallery) {
          const gAsset = await uploadImageFromUrl(gUrl)
          if (gAsset) sanityDoc.gallery.push(gAsset)
        }
      }
    }
    else if (type === 'experience') {
      sanityDoc.companyName = data.companyName || data.company
      sanityDoc.role = data.role
      sanityDoc.slug = { _type: 'slug', current: doc.id }
      sanityDoc.date = data.date || data.period
      sanityDoc.description = data.description
      sanityDoc.image = imageAsset
    }
    else if (type === 'tool') {
      sanityDoc.title = data.title || data.name
      sanityDoc.slug = { _type: 'slug', current: doc.id }
      sanityDoc.image = imageAsset
    }

    try {
      await client.create(sanityDoc)
      console.log(`  -> Created ${sanityDoc.title || sanityDoc.companyName || sanityDoc.slug?.current}`)
    } catch (err) {
      console.error(`  -> Failed to create doc:`, err.message)
    }
  }
}

async function run() {
  await migrateCollection('tools', 'tool')
  await migrateCollection('experience', 'experience')
  await migrateCollection('projects', 'project')
  await migrateCollection('blog', 'blog')
  console.log("Migration complete!")
}

run()
