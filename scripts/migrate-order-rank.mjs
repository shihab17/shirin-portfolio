// One-time migration: assigns `orderRank` (lexorank) values to existing
// project/brand/concept docs, preserving the current `order` sequence.
// Run once after adding @sanity/orderable-document-list:
//   SANITY_TOKEN=... node scripts/migrate-order-rank.mjs
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

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

// Equal `order` values: newest doc wins, matching "new uploads go first".
const TYPES = ['project', 'brand', 'concept'];

for (const type of TYPES) {
  const docs = await client.fetch(
    `*[_type == $type && !defined(orderRank)] | order(coalesce(order, 999999) asc, _createdAt desc) { _id }`,
    { type },
  );
  if (!docs.length) {
    console.log(`${type}: nothing to migrate`);
    continue;
  }
  let rank = LexoRank.min();
  const trx = client.transaction();
  for (const doc of docs) {
    rank = rank.genNext().genNext();
    trx.patch(doc._id, { set: { orderRank: rank.toString() } });
  }
  await trx.commit();
  console.log(`${type}: ranked ${docs.length} docs`);
}
