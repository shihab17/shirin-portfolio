// Backfills slug.current for existing project docs (derived from title).
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'xr2t6hgu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const docs = await client.fetch(`*[_type == "project" && !defined(slug.current)]{_id, title}`);
for (const d of docs) {
  const slug = slugify(d.title);
  await client.patch(d._id).set({ slug: { _type: 'slug', current: slug } }).commit();
  console.log(`✓ ${d._id} → ${slug}`);
}
console.log('Done.');
