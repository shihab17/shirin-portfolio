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
  ],
  preview: {
    select: { title: 'title', subtitle: 'kind', media: 'poster' },
  },
  orderings: [
    { title: 'Sort order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
});

export default defineConfig({
  name: 'shirin-portfolio',
  title: 'Shirin Portfolio',
  projectId: 'xr2t6hgu',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: [project] },
});
