export default {
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title or caption for the image',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Installation', value: 'installation' },
          { title: 'Products', value: 'products' },
          { title: 'Projects', value: 'projects' },
          { title: 'Events', value: 'events' },
          { title: 'Team', value: 'team' },
          { title: 'Other', value: 'other' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional description for the image'
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this image in featured section',
      initialValue: false
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      category: 'category'
    },
    prepare(selection: any) {
      const { title, media, category } = selection;
      return {
        title,
        media,
        subtitle: category ? `Category: ${category}` : 'No category'
      };
    }
  }
};
