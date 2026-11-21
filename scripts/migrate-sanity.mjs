// One-time migration: uploads posters + videos to Sanity and creates
// `project` documents matching src/data/projects.ts.
// Run: SANITY_TOKEN=... node scripts/migrate-sanity.mjs
// (token is read from .env automatically via --env-file or export it)
import { createClient } from '@sanity/client';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const client = createClient({
  projectId: 'xr2t6hgu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

if (!process.env.SANITY_TOKEN) {
  console.error('SANITY_TOKEN missing — put it in .env or export it');
  process.exit(1);
}

const projects = [
  { id: '01', title: 'Shopkeeper App — Bengali Promo', kind: 'App Promo', chips: ['Vertical 9:16', '1:22'], category: 'motion', description: 'Bengali promo for a shop-management app — dues, stock, sales and accounting in one place.', durationIso: 'PT1M22S' },
  { id: '02', title: 'Chonk — Testimonial Ad', kind: 'Social Ad', chips: ['Vertical 9:16', '0:44'], category: 'motion', description: 'Customer-testimonial style social ad for Chonk cat food.', durationIso: 'PT44S' },
  { id: '03', title: 'Tea Garden — Brand Film', kind: 'Brand Film', chips: ['Vertical 9:16', '0:29'], category: 'cinematic', description: 'Cinematic vertical brand film shot in a tea garden.', durationIso: 'PT29S' },
  { id: '04', title: 'Brand Film — Landscape Edit', kind: 'Promo Edit', chips: ['Landscape 16:9', '1:14'], category: 'motion', description: 'Landscape promotional brand film edit.', durationIso: 'PT1M14S' },
  { id: '05', title: 'Village Story — 2D Animation', kind: 'Animated Story', chips: ['Landscape 16:9', '1:54'], category: 'animation', description: '2D animated story set in a riverside village — YouTube edit.', durationIso: 'PT1M54S' },
  { id: '06', title: 'Baby Food — Emotional Ad', kind: 'Social Ad', chips: ['Vertical 9:16', '1:28'], category: 'motion', description: 'Emotional Bengali ad for a home-made baby food brand.', durationIso: 'PT1M28S' },
  { id: '07', title: 'Saved Up — Storytelling Edit', kind: 'Storytelling', chips: ['Square 1:1', '6:28'], category: 'story', description: 'Subtitled narrative storytelling edit — square format.', durationIso: 'PT6M28S' },
  { id: '08', title: 'Ai Adcraft — Agency Promo', kind: 'Agency Ad', chips: ['Vertical 9:16', '2:10'], category: 'ai', description: 'Bengali promo for Ai Adcraft — AI-powered video advertising.', durationIso: 'PT2M10S' },
  { id: '09', title: 'Village Morning — Cinematic Reel', kind: 'Cinematic Cut', chips: ['Vertical 9:16', '1:01'], category: 'ai', description: 'Cinematic vertical reel of a misty riverside village morning.', durationIso: 'PT1M1S' },
  { id: '10', title: 'Shop Talk — Docu Promo', kind: 'Promo Edit', chips: ['Vertical 9:16', '0:27'], category: 'motion', description: 'Documentary-style promo scene at a village grocery shop.', durationIso: 'PT27S' },
];

for (const p of projects) {
  const posterPath = join(root, 'src/assets', `poster-${p.id}.jpg`);
  const videoPath = join(root, 'public/videos', `${p.id}.mp4`);

  console.log(`Uploading ${p.id}: poster…`);
  const poster = await client.assets.upload('image', createReadStream(posterPath), {
    filename: `poster-${p.id}.jpg`,
  });
  console.log(`  poster ${poster._id}`);

  console.log(`  video…`);
  const video = await client.assets.upload('file', createReadStream(videoPath), {
    filename: `${p.id}.mp4`,
  });
  console.log(`  video ${video._id}`);

  const doc = {
    _id: `project-${p.id}`,
    _type: 'project',
    id: p.id,
    order: Number(p.id),
    title: p.title,
    kind: p.kind,
    chips: p.chips,
    category: p.category,
    description: p.description,
    durationIso: p.durationIso,
    uploadDate: '2026-11-21',
    poster: { _type: 'image', asset: { _type: 'reference', _ref: poster._id } },
    video: { _type: 'file', asset: { _type: 'reference', _ref: video._id } },
  };
  await client.createOrReplace(doc);
  console.log(`  ✓ project-${p.id}`);
}

console.log('Done — 10 projects migrated.');
