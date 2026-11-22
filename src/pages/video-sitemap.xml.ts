import type { APIRoute } from 'astro';
import { fetchProjects } from '../lib/sanity';
import {
  projects as localProjects,
  projectSlug,
  videoSrc,
} from '../data/projects';
import { site } from '../site';
import type { CmsProject } from '../lib/sanity';

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const secs = (iso?: string) => {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?/);
  return m ? +(m[1] || 0) * 3600 + +(m[2] || 0) * 60 + Math.round(+(m[3] || 0)) : 0;
};

export const GET: APIRoute = async ({ site: astroSite }) => {
  const base = astroSite?.origin ?? site.url;
  const cms = await fetchProjects();
  const list = (cms.length ? cms : localProjects) as CmsProject[];

  const urls = list
    .map((p) => {
      const loc = `${base}/work/${projectSlug(p)}`;
      const contentLoc = p.videoUrl ? p.videoUrl : `${base}${videoSrc(p.id)}`;
      const thumb = p.posterUrl ? p.posterUrl : `${base}/og-image.jpg`;
      const d = secs(p.durationIso);
      return `  <url>
    <loc>${esc(loc)}</loc>
    <video:video>
      <video:thumbnail_loc>${esc(thumb)}</video:thumbnail_loc>
      <video:title>${esc(`${p.title} — ${p.kind}`)}</video:title>
      <video:description>${esc(p.description)}</video:description>
      <video:content_loc>${esc(contentLoc)}</video:content_loc>
      <video:player_loc>${esc(loc)}</video:player_loc>${d ? `
      <video:duration>${d}</video:duration>` : ''}${p.uploadDate ? `
      <video:publication_date>${p.uploadDate}</video:publication_date>` : ''}
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:uploader info="${esc(base)}">${esc(site.name)}</video:uploader>
      <video:live>no</video:live>
    </video:video>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
