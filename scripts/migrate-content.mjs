// Seeds concepts + site settings + marks project-03 featured.
// Run: SANITY_TOKEN=... node scripts/migrate-content.mjs
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

const concepts = [
  {
    _id: 'concept-1',
    file: 'concept-1.jpg',
    caption: 'Darjeeling pouch concept',
    alt: 'Green and gold Darjeeling tea pouch packaging artwork',
    order: 1,
  },
  {
    _id: 'concept-2',
    file: 'concept-2.jpg',
    caption: 'Framed label concept',
    alt: 'Green and gold tea packaging artwork, framed label version',
    order: 2,
  },
];

for (const c of concepts) {
  const img = await client.assets.upload('image', createReadStream(join(root, 'src/assets', c.file)), {
    filename: c.file,
  });
  await client.createOrReplace({
    _id: c._id,
    _type: 'concept',
    caption: c.caption,
    alt: c.alt,
    order: c.order,
    image: { _type: 'image', asset: { _type: 'reference', _ref: img._id } },
  });
  console.log(`✓ ${c._id}`);
}

await client.createOrReplace({
  _id: 'siteSettings',
  _type: 'siteSettings',
  tagline: 'Promotional Video Editor',
  description:
    'Shirin Akter Nupur is a promotional video editor with a psychology background. Story-led reels, ads, brand films and YouTube edits that make people stop scrolling.',
  whatsapp: 'https://wa.me/8801880131455',
  whatsappLabel: 'WhatsApp · 01880131455',
  facebook: 'https://www.facebook.com/share/1En81SgCwC/',
  facebookPage: 'https://www.facebook.com/share/1JxU52z4sE/',
});
console.log('✓ siteSettings');

await client.patch('project-03').set({ featured: true }).commit();
console.log('✓ project-03 featured');

console.log('Done.');
