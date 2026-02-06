import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'quote',
  title: 'Quote Request',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'Customer Phone',
      type: 'string',
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'message',
      title: 'Additional Message',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Quoted', value: 'quoted'},
          {title: 'Accepted', value: 'accepted'},
          {title: 'Declined', value: 'declined'},
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'quotedPrice',
      title: 'Quoted Price',
      type: 'number',
      description: 'Final quoted price for this request',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Private notes (not visible to customer)',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      customerName: 'customerName',
      productName: 'product.name',
      status: 'status',
      quantity: 'quantity',
    },
    prepare(selection) {
      const {customerName, productName, status, quantity} = selection
      const statusIcon =
        status === 'pending'
          ? '⏳'
          : status === 'quoted'
          ? '💰'
          : status === 'accepted'
          ? '✅'
          : '❌'
      return {
        title: `${customerName} - ${productName || 'No product'}`,
        subtitle: `${statusIcon} ${status} | Qty: ${quantity}`,
      }
    },
  },
})
