import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'admitCard',
  title: 'Admit Card',
  type: 'document',
  fields: [
    defineField({
      name: 'job',
      title: 'Related Job Post',
      type: 'reference',
      to: [{type: 'job'}],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., SSC GD Constable Admit Card Released',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Brief summary about the admit card availability',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'datetime',
      options: {
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'HH:mm',
      },
    }),
    defineField({
      name: 'downloadWindow',
      title: 'Download Period',
      type: 'string',
      description: 'e.g., 15 October - 30 October 2023',
    }),
    defineField({
      name: 'instructions',
      title: 'Important Instructions',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key points for candidates',
    }),
    defineField({
      name: 'requiredDocuments',
      title: 'Documents to Carry',
      type: 'array',
      of: [{type: 'string'}],
      description: 'ID proofs and other required documents',
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
                  {title: 'Download Admit Card', value: 'admitCard'},
                  {title: 'Official Website', value: 'officialWebsite'},
                  {title: 'Exam Center Details', value: 'examCenter'},
                  {title: 'Contact Helpdesk', value: 'helpdesk'},
                  {title: 'Candidate Login', value: 'login'},
                ],
              },
            }),
            defineField({
              name: 'url',
              type: 'url',
              title: 'Link URL',
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
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Released', value: 'released'},
          {title: 'Coming Soon', value: 'comingSoon'},
          {title: 'Delayed', value: 'delayed'},
        ],
        layout: 'radio',
      },
      initialValue: 'comingSoon',
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
