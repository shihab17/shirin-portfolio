// Generates public/og-image.jpg (1200×630) — dark emerald backdrop, name +
// title text on the left, two work posters on the right. Run: npm run gen:og
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const asset = (n) => join(root, 'src/assets', n);
const out = join(root, 'public/og-image.jpg');

const W = 1200, H = 630;

const backdrop = await sharp(asset('poster-08.jpg'))
  .resize(W, H, { fit: 'cover' })
  .blur(30)
  .modulate({ brightness: 0.5, saturation: 1.15 })
  .composite([
    { input: Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#06100c" fill-opacity="0.6"/></svg>`) },
  ])
  .toBuffer();

const textSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="80" y="180" width="84" height="2" fill="#e3c995" opacity="0.9"/>
  <text x="80" y="262" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="66" fill="#f7f0e1">Shirin Akter</text>
  <text x="80" y="338" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="66" fill="#e3c995">Nupur</text>
  <text x="82" y="404" font-family="Arial, Helvetica, sans-serif" font-size="21" letter-spacing="6" fill="#9db4a7">PROMOTIONAL VIDEO EDITOR</text>
  <text x="82" y="452" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="24" fill="#eab9a8">Reels · Ads · Brand Stories</text>
</svg>`;

const cardW = 250, cardH = 312;
const cards = [];
const cardDefs = [
  { id: 'poster-02.jpg', x: 660 },
  { id: 'poster-01.jpg', x: 946 },
];
for (const c of cardDefs) {
  const img = await sharp(asset(c.id)).resize(cardW, cardH, { fit: 'cover' }).toBuffer();
  const y = (H - cardH) / 2;
  cards.push(
    { input: Buffer.from(`<svg width="${cardW + 14}" height="${cardH + 14}"><rect x="1" y="1" width="${cardW + 12}" height="${cardH + 12}" fill="none" stroke="#e3c995" stroke-opacity="0.55"/></svg>`), left: c.x - 7, top: y - 7 },
    { input: img, left: c.x, top: y }
  );
}

await sharp(backdrop)
  .composite([{ input: Buffer.from(textSvg) }, ...cards])
  .jpeg({ quality: 82 })
  .toFile(out);

console.log('og-image.jpg written');
