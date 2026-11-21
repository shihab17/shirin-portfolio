import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical site URL. On Cloudflare Pages, CF_PAGES_URL is injected at build
// time. Once a custom domain exists, set SITE=https://yourdomain.com.
const site =
  process.env.SITE ||
  process.env.CF_PAGES_URL ||
  'https://shirin-nupur.pages.dev';

export default defineConfig({
  site,
  integrations: [sitemap()],
});
