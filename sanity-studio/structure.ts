import type {StructureResolver} from 'sanity/structure'
import {UserIcon} from '@sanity/icons/User'

/** Singleton document types: one fixed document each, opened directly from the sidebar. */
export const SINGLETON_TYPES = new Set(['siteSettings'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Insanity')
    .items([
      S.listItem()
        .title('Profile & Site Settings')
        .id('siteSettings')
        .icon(UserIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Profile & Site Settings'),
        ),
      S.divider(),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Posts')
                .schemaType('blog')
                .child(
                  S.documentTypeList('blog')
                    .title('Posts')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Categories')
                .schemaType('category')
                .child(
                  S.documentTypeList('category')
                    .title('Categories')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
            ]),
        ),
      S.listItem()
        .title('Portfolio')
        .child(
          S.list()
            .title('Portfolio')
            .items([
              S.documentTypeListItem('project').title('Projects'),
              S.listItem()
                .title('Experience')
                .schemaType('experience')
                .child(
                  S.documentTypeList('experience')
                    .title('Experience')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
              S.documentTypeListItem('tool').title('Tools'),
            ]),
        ),
    ])
