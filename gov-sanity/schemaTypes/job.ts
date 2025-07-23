import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'job',
  title: 'Government Job Post',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Exercise Image',
      description: 'An image showing the proper form or demonstration of the exercise',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Description of the exercise image for accessibility and SEO purposes',
        },
      ],
    }),
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Job Description',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'vacancyTotal',
      title: 'Total Vacancies',
      type: 'number',
    }),

    defineField({
      name: 'vacancyDetails',
      title: 'Vacancy Details',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'postName',
              type: 'string',
              title: 'Post Name',
            }),
            defineField({
              name: 'total',
              type: 'number',
              title: 'Total Posts',
            }),
            defineField({
              name: 'categoryBreakdown',
              title: 'Category-wise Vacancy',
              type: 'object',
              fields: [
                defineField({name: 'ur', type: 'number', title: 'UR (General)'}),
                defineField({name: 'ewc', type: 'number', title: 'EWS'}),
                defineField({name: 'obc', type: 'number', title: 'OBC'}),
                defineField({name: 'sc', type: 'number', title: 'SC'}),
                defineField({name: 'st', type: 'number', title: 'ST'}),
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'importantDates',
      title: 'Important Dates',
      type: 'object',
      fields: [
        defineField({name: 'notification', type: 'date', title: 'Notification Date'}),
        defineField({name: 'applyStart', type: 'date', title: 'Apply Start Date'}),
        defineField({name: 'applyEnd', type: 'date', title: 'Apply End Date'}),
        defineField({name: 'feeLastDate', type: 'date', title: 'Fee Last Date'}),
        defineField({name: 'correctionWindow', type: 'string', title: 'Correction Window'}),
        defineField({name: 'exam', type: 'string', title: 'Exam Date/Status'}),
        defineField({name: 'admitCard', type: 'string', title: 'Admit Card/Status'}),
        defineField({name: 'result', type: 'string', title: 'Result/Status'}),
      ],
    }),

    defineField({
      name: 'eligibility',
      title: 'Eligibility Criteria',
      type: 'object',
      fields: [
        defineField({name: 'ageMin', type: 'number', title: 'Minimum Age'}),
        defineField({name: 'ageMax', type: 'number', title: 'Maximum Age'}),
        defineField({name: 'ageAsOn', type: 'date', title: 'Age As On'}),
        defineField({name: 'education', type: 'text', title: 'Educational Qualification'}),
        defineField({name: 'experience', type: 'text', title: 'Experience (Optional)'}),
        defineField({
          name: 'physicalStandards',
          type: 'text',
          title: 'Physical Standards (If Any)',
        }),
      ],
    }),

    defineField({
      name: 'postWiseEligibility',
      title: 'Post-wise Eligibility',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Post Eligibility',
          fields: [
            defineField({
              name: 'post',
              type: 'string',
              title: 'Post Name (e.g. gd, teacher)',
            }),
            defineField({
              name: 'criteria',
              type: 'array',
              title: 'Eligibility Criteria',
              of: [{type: 'string'}],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'applicationFee',
      title: 'Application Fee',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'category',
              type: 'string',
              title: 'Category (e.g. General, SC/ST)',
            }),
            defineField({name: 'amount', type: 'number', title: 'Fee (INR)'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'selectionProcess',
      title: 'Selection Process',
      type: 'array',
      of: [{type: 'string'}],
    }),

    defineField({
      name: 'documentsRequired',
      title: 'Required Documents',
      type: 'array',
      of: [{type: 'string'}],
    }),

    defineField({
      name: 'applicationInstructions',
      title: 'Application Instructions',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'officialLinks',
      title: 'Important Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Link Label (e.g. Apply Online)'}),
            defineField({name: 'url', type: 'url', title: 'URL'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', type: 'string', title: 'Question'}),
            defineField({name: 'answer', type: 'text', title: 'Answer'}),
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
    },
  },
})
