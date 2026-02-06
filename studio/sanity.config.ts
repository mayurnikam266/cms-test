import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Test Agency CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 's9692oke',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

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
            S.listItem()
              .title('Contact Submissions')
              .child(S.documentTypeList('contact').title('Contacts')),
            S.listItem()
              .title('Quote Requests')
              .child(S.documentTypeList('quote').title('Quotes')),
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
