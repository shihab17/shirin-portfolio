import { defineConfig, defineType, defineField } from 'sanity';
import { structureTool } from 'sanity/structure';
import {
  orderRankField,
  orderRankOrdering,
  orderableDocumentListDeskItem,
} from '@sanity/orderable-document-list';

const categories = [
  { title: 'Motion Graphics', value: 'motion' },
  { title: 'Cinematic', value: 'cinematic' },
  { title: '2D Animation', value: 'animation' },
  { title: 'AI Video', value: 'ai' },
  { title: 'Storytelling', value: 'story' },
];

const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'details', title: 'Details' },
  ],
  fields: [
    orderRankField({ type: 'project', newItemPosition: 'before' }),
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'kind', title: 'Kind', type: 'string', group: 'content' }),
    defineField({
      name: 'chips',
      title: 'Chips',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'e.g. "Vertical 9:16", "1:22"',
    }),
    defineField({
      name: 'category',
      type: 'string',
      group: 'content',
      options: { list: categories, layout: 'radio' },
    }),
    defineField({ name: 'description', type: 'text', rows: 3, group: 'content' }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'video',
      title: 'Video file',
      type: 'file',
      group: 'media',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'gallery',
      title: 'Stills / frames',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
        },
      ],
      description: 'Shown as a grid under the description on the project page',
    }),
    defineField({
      name: 'featured',
      title: 'Featured in hero',
      type: 'boolean',
      group: 'media',
      description: 'Tick on ONE project — its poster is used behind the hero',
      initialValue: false,
    }),
    defineField({ name: 'client', title: 'Client / brand', type: 'string', group: 'details' }),
    defineField({
      name: 'services',
      title: 'Services provided',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'e.g. "Editing", "Color grade", "Sound design"',
    }),
    defineField({
      name: 'tools',
      title: 'Tools used',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'e.g. "Premiere Pro", "After Effects"',
    }),
    defineField({
      name: 'externalLink',
      title: 'Full video link',
      type: 'url',
      group: 'details',
      description: 'YouTube/Drive link to the full-length version — shown as a button',
    }),
    defineField({
      name: 'durationIso',
      title: 'Duration (ISO-8601)',
      type: 'string',
      group: 'details',
      description: 'e.g. PT1M22S — used in video schema',
    }),
    defineField({ name: 'uploadDate', title: 'Upload date', type: 'date', group: 'details' }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      options: { source: 'title', maxLength: 96 },
      description: 'Used in the project page URL — click Generate',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'kind', media: 'poster' },
  },
  orderings: [orderRankOrdering],
});

const brand = defineType({
  name: 'brand',
  title: 'Trusted By — Brand',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo image',
      type: 'image',
      description: 'Brand logo — PNG/SVG with transparent background works best. Shown instead of the monogram when set.',
    }),
    defineField({
      name: 'monogram',
      title: 'Monogram letters',
      type: 'string',
      description: '1–2 letters shown in the badge, e.g. "C". Fallback when no logo image is set.',
    }),
    defineField({
      name: 'service',
      title: 'Work done',
      type: 'string',
      description: 'Short label, e.g. "Social Ads"',
    }),
    defineField({ name: 'link', title: 'Link (optional)', type: 'url' }),
    orderRankField({ type: 'brand', newItemPosition: 'before' }),
  ],
  orderings: [orderRankOrdering],
});

const concept = defineType({
  name: 'concept',
  title: 'Visual Concept',
  type: 'document',
  fields: [
    defineField({
      name: 'caption',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image — for screen readers and SEO',
    }),
    orderRankField({ type: 'concept', newItemPosition: 'before' }),
  ],
  preview: { select: { title: 'caption', media: 'image' } },
  orderings: [orderRankOrdering],
});

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'tagline', type: 'string', description: 'e.g. "Promotional Video Editor"' }),
    defineField({ name: 'description', title: 'SEO description', type: 'text', rows: 3 }),
    defineField({ name: 'whatsapp', title: 'WhatsApp link', type: 'url' }),
    defineField({ name: 'whatsappLabel', title: 'WhatsApp button label', type: 'string' }),
    defineField({ name: 'facebook', title: 'Facebook profile link', type: 'url' }),
    defineField({ name: 'facebookPage', title: 'Facebook page link', type: 'url' }),
  ],
});

export default defineConfig({
  name: 'shirin-portfolio',
  title: 'Shirin Portfolio',
  projectId: 'xr2t6hgu',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({
              type: 'project',
              title: 'Projects',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: 'brand',
              title: 'Trusted By — Brands',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: 'concept',
              title: 'Visual Concepts',
              S,
              context,
            }),
            S.divider(),
            S.documentTypeListItem('siteSettings').title('Site Settings'),
          ]),
    }),
  ],
  schema: { types: [project, brand, concept, siteSettings] },
});
