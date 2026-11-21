import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool, defineDocuments, defineLocations} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './schemaTypes'
import {structure, SINGLETON_TYPES} from './structure'

// Where the Presentation tool loads the blog from. Set SANITY_STUDIO_PREVIEW_ORIGIN
// (e.g. https://blog.pratikgond.tech) when building/deploying the studio.
const PREVIEW_ORIGIN = process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000'

// Actions that would break a singleton (there must always be exactly one document).
const SINGLETON_ALLOWED_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Insanity',

  projectId: '8j6w8ohu',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    presentationTool({
      title: 'Live preview',
      previewUrl: {
        initial: PREVIEW_ORIGIN,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
      resolve: {
        // Which document opens in the editor when you browse to a page in the preview.
        mainDocuments: defineDocuments([
          {route: '/blog/:slug', filter: `_type == "blog" && slug.current == $slug`},
          {route: '/category/:slug', filter: `_type == "category" && slug.current == $slug`},
        ]),
        // "Used on these pages" links shown on each document.
        locations: {
          blog: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug ? [{title: doc.title || 'Untitled post', href: `/blog/${doc.slug}`}] : []),
                {title: 'Blog home', href: '/'},
              ],
            }),
          }),
          category: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug ? [{title: doc.title || 'Untitled category', href: `/category/${doc.slug}`}] : []),
                {title: 'Blog home', href: '/'},
              ],
            }),
          }),
          siteSettings: defineLocations({
            locations: [
              {title: 'Blog home', href: '/'},
              {title: 'About', href: '/about'},
            ],
          }),
        },
      },
    }),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
    // Singletons can't be created from "New document" menus.
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    // No delete / duplicate / unpublish on singletons.
    actions: (actions, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(({action}) => action && SINGLETON_ALLOWED_ACTIONS.has(action))
        : actions,
  },
})
