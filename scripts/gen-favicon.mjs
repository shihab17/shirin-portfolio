// Rasterizes public/favicon.svg into PNG fallbacks used by platforms that
// ignore SVG icons (iOS home screen, older browsers). Run: node scripts/gen-favicon.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = join(root, 'public/favicon.svg');

await sharp(svg, { density: 512 })
  .resize(180, 180)
  .png()
  .toFile(join(root, 'public/apple-touch-icon.png'));

await sharp(svg, { density: 512 })
  .resize(32, 32)
  .png()
  .toFile(join(root, 'public/favicon-32.png'));

console.log('favicon PNGs written');
