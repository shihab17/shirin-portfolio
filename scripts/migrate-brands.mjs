// Seeds the three existing "Trusted By" brands into Sanity.
// Run: SANITY_TOKEN=... node scripts/migrate-brands.mjs
import { createClient } from '@sanity/client';

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

const brands = [
  { _id: 'brand-chonk', name: 'Chonk', monogram: 'C', service: 'Social Ads', order: 1 },
  { _id: 'brand-jafrin', name: 'Home-made Baby Food by Jafrin', monogram: 'J', service: 'Emotional Ad', order: 2 },
  { _id: 'brand-usa-client', name: 'USA-based Website Client', monogram: 'W', service: 'Web Promo', order: 3 },
];

for (const b of brands) {
  await client.createOrReplace({ _type: 'brand', ...b });
  console.log(`✓ ${b._id}`);
}
console.log('Done — 3 brands migrated.');
