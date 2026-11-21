import { defineConfig, defineType, defineField } from 'sanity';
import { structureTool } from 'sanity/structure';

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
  fields: [
    defineField({
      name: 'id',
      title: 'Display number',
      type: 'string',
      description: 'Shown on the card, e.g. "01"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'kind', title: 'Kind', type: 'string' }),
    defineField({
      name: 'chips',
      title: 'Chips',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "Vertical 9:16", "1:22"',
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: categories, layout: 'radio' },
    }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'durationIso',
      title: 'Duration (ISO-8601)',
      type: 'string',
      description: 'e.g. PT1M22S — used in video schema',
    }),
    defineField({ name: 'uploadDate', title: 'Upload date', type: 'date' }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'video',
      title: 'Video file',
      type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'featured',
      title: 'Featured in hero',
      type: 'boolean',
      description: 'Tick on ONE project — its poster is used behind the hero',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'kind', media: 'poster' },
  },
  orderings: [
    { title: 'Sort order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
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
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    { title: 'Sort order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
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
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  preview: { select: { title: 'caption', media: 'image' } },
  orderings: [
    { title: 'Sort order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
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
  plugins: [structureTool()],
  schema: { types: [project, brand, concept, siteSettings] },
});
