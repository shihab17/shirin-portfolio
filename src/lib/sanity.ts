import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Project } from '../data/projects';

export const sanityClient = createClient({
  projectId: 'xr2t6hgu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

// A Project as consumed by index.astro — poster/video may be remote (Sanity CDN).
export interface CmsProject extends Project {
  uploadDate?: string;
  posterUrl?: string;
  videoUrl?: string;
}

const QUERY = `*[_type == "project"] | order(order asc, _createdAt asc) {
  id, order, title, kind, chips, category, description, durationIso, uploadDate,
  poster, "videoUrl": video.asset->url
}`;

export async function fetchProjects(): Promise<CmsProject[]> {
  try {
    const docs = await sanityClient.fetch(QUERY);
    if (!Array.isArray(docs) || docs.length === 0) return [];
    return docs.map((d: any, i: number) => ({
      id: d.id || String(i + 1).padStart(2, '0'),
      title: d.title || 'Untitled',
      kind: d.kind || '',
      chips: Array.isArray(d.chips) ? d.chips : [],
      category: d.category || 'motion',
      description: d.description || '',
      durationIso: d.durationIso || '',
      uploadDate: d.uploadDate,
      posterUrl: d.poster
        ? builder.image(d.poster).width(720).auto('format').url()
        : undefined,
      videoUrl: d.videoUrl || undefined,
    }));
  } catch (e) {
    console.warn('[sanity] fetchProjects failed, using local data:', e);
    return [];
  }
}
