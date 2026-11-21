# Shirin Akter Nupur — Portfolio

Astro static site. Same design as the original single-file `index.html` (kept in the repo root as a reference — its `img/`/`videos/` paths have moved, so it no longer renders standalone).

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the built site
npm run gen:og    # regenerate public/og-image.jpg (1200×630 social card)
```

## Update content (no HTML editing needed)

- **Add/remove a video:** drop the `.mp4` into `public/videos/`, the poster `.jpg` into `src/assets/` as `poster-XX.jpg`, then add/edit an entry in `src/data/projects.ts`. The grid, video schema (JSON-LD), and sitemap all update automatically.
- **Site info (name, description, social links):** `src/site.ts`
- **Styling:** `src/styles/global.css` · **Animations/motion:** `src/scripts/main.ts`

## Deploy — Cloudflare Pages (free)

1. Push this folder to a GitHub repo.
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Framework preset: **Astro** · Build command: `npm run build` · Output dir: `dist`.
4. Deploy → you get `https://<project>.pages.dev`.

Canonical URL / sitemap / OG URLs resolve automatically: at build time Cloudflare injects `CF_PAGES_URL`; for a custom domain later, set env `SITE=https://yourdomain.com` in Pages settings.

`public/_headers` already sets long-lived caching for `/videos/` and `/_astro/`.

## SEO included

- Title, meta description, canonical, robots, author, theme-color, `lang="en"`
- Open Graph + Twitter card with generated `og-image.jpg`
- JSON-LD `@graph`: `Person`, `WebSite`, `ItemList` of 10 `VideoObject`s (video-search eligible)
- `sitemap-index.xml` (auto, includes video namespace) + dynamic `robots.txt`
- `favicon.svg` + `site.webmanifest`
- Posters/images optimized to WebP at build; videos `preload="none"`; curtain ~1.5s and skipped on repeat visits (LCP-friendly)
