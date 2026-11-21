import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical site URL. Set SITE env var to override (e.g. a custom domain).
// Cloudflare Pages injects CF_PAGES_URL; Workers builds do not.
const site =
  process.env.SITE ||
  process.env.CF_PAGES_URL ||
  'https://shirin-portfolio.shihabahmed620.workers.dev';

export default defineConfig({
  site,
  integrations: [sitemap()],
});
