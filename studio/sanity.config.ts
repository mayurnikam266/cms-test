import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Test Agency CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 's9692oke',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2024-02-01',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Products')
              .child(S.documentTypeList('product').title('Products')),
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),
            S.listItem()
              .title('Announcements')
              .child(S.documentTypeList('announcement').title('Announcements')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) =>
                !['product', 'category', 'announcement', 'contact', 'quote'].includes(
                  listItem.getId() || ''
                )
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
