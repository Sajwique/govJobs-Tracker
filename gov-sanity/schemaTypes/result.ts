import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'result',
  title: 'Result',
  type: 'document',
  fields: [
    defineField({
      name: 'job',
      title: 'Related Job Post',
      type: 'reference',
      to: [{type: 'job'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., SSC GD Constable 2023 Final Result Declared',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Result summary and highlights',
    }),
    defineField({
      name: 'resultDate',
      title: 'Result Date',
      type: 'datetime',
      options: {
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'HH:mm',
      },
    }),
    defineField({
      name: 'cutoffMarks',
      title: 'Cut-off Marks',
      type: 'text',
      description: 'Category-wise cut-off details',
    }),
    defineField({
      name: 'meritListInfo',
      title: 'Merit List Information',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'buttons',
      title: 'Important Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Button Text',
              options: {
                list: [
                  {title: 'Download Result', value: 'result'},
                  {title: 'Official Notification', value: 'notification'},
                  {title: 'Cut-off Marks', value: 'cutoff'},
                  {title: 'Merit List', value: 'meritList'},
                  {title: 'Scorecard', value: 'scorecard'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              type: 'url',
              title: 'Link URL',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'nextSteps',
      title: 'Next Steps',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Document verification, medical test dates, etc.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Declared', value: 'declared'},
          {title: 'Provisional', value: 'provisional'},
          {title: 'Final', value: 'final'},
          {title: 'Withheld', value: 'withheld'},
        ],
        layout: 'radio',
      },
      initialValue: 'declared',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      jobTitle: 'job.title',
      status: 'status',
    },
    prepare: ({title, jobTitle, status}) => ({
      title: title,
      subtitle: `${jobTitle || 'No job linked'} | Status: ${status}`,
    }),
  },
})
