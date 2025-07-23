import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'announcementBanner',
  title: 'Announcement Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Announcement Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Announcement Content',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctaLink',
      title: 'Call-to-Action Link',
      type: 'url',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title,
        subtitle: 'Announcement Banner',
        media: media,
      }
    },
  },
})
