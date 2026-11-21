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

## Content management — Sanity CMS

Projects (title, category, description, poster, video) are edited in the hosted Sanity Studio:

- **Studio URL:** https://shirin-nupur.sanity.studio/ (login with a Sanity account added to project `xr2t6hgu`)
- **Schema:** `sanity.config.ts` → `project` document
- **Data layer:** `src/lib/sanity.ts` fetches published projects at build time; `src/data/projects.ts` is the fallback if the API is unreachable or returns nothing.
- To redeploy the studio after schema changes: `SANITY_AUTH_TOKEN=<token> npx sanity deploy`

**Auto-republish on content change:** create a Cloudflare Pages *Deploy Hook* (project → Settings → Builds & deployments → Deploy hooks), then in sanity.io/manage → project → API → Webhooks, add a webhook that POSTs to the deploy-hook URL on document create/update/delete. Publishing in the Studio then triggers a fresh static build.
