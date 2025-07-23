import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'mainBanner',
  title: 'Main Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slides',
      title: 'Banner Slides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
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
              name: 'link',
              type: 'url',
              title: 'Link URL',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        }),
      ],
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
      slideCount: 'slides.length',
    },
    prepare({title, slideCount}) {
      return {
        title: title,
        subtitle: `Main Banner · ${slideCount || 0} slides`,
      }
    },
  },
})
