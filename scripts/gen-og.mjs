// Generates public/og-image.jpg (1200×630) — dark emerald canvas, blurred
// poster backdrop, and a row of three work posters with a gold hairline.
// Run: npm run gen:og  (uses sharp, already installed via astro)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const asset = (n) => join(root, 'src/assets', n);
const out = join(root, 'public/og-image.jpg');

const W = 1200, H = 630;
const cardW = 250, cardH = 312, gap = 36;

const backdrop = await sharp(asset('poster-08.jpg'))
  .resize(W, H, { fit: 'cover' })
  .blur(30)
  .modulate({ brightness: 0.45, saturation: 1.15 })
  .composite([
    { input: Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#06100c" fill-opacity="0.55"/></svg>`) },
  ])
  .toBuffer();

const ids = ['poster-02.jpg', 'poster-01.jpg', 'poster-06.jpg'];
const cards = await Promise.all(
  ids.map(async (id, i) => {
    const img = await sharp(asset(id)).resize(cardW, cardH, { fit: 'cover' }).toBuffer();
    const x = (W - (cardW * 3 + gap * 2)) / 2 + i * (cardW + gap);
    const y = (H - cardH) / 2;
    const border = Buffer.from(
      `<svg width="${cardW + 14}" height="${cardH + 14}"><rect x="1" y="1" width="${cardW + 12}" height="${cardH + 12}" fill="none" stroke="#e3c995" stroke-opacity="0.55"/></svg>`
    );
    return [
      { input: border, left: x - 7, top: y - 7 },
      { input: img, left: x, top: y },
    ];
  })
);

await sharp(backdrop)
  .composite(cards.flat())
  .jpeg({ quality: 82 })
  .toFile(out);

console.log('og-image.jpg written');
