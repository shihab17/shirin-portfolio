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
  posterOgUrl?: string;
  videoUrl?: string;
  featured?: boolean;
  slug?: string;
}

const QUERY = `*[_type == "project"] | order(order asc, _createdAt asc) {
  id, order, title, kind, chips, category, description, durationIso, uploadDate,
  featured, poster, "videoUrl": video.asset->url, "slug": slug.current
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
      featured: !!d.featured,
      slug: d.slug || undefined,
      posterUrl: d.poster
        ? builder.image(d.poster).width(720).auto('format').url()
        : undefined,
      posterOgUrl: d.poster
        ? builder.image(d.poster).width(1200).height(630).fit('crop').auto('format').url()
        : undefined,
      videoUrl: d.videoUrl || undefined,
    }));
  } catch (e) {
    console.warn('[sanity] fetchProjects failed, using local data:', e);
    return [];
  }
}

export interface CmsBrand {
  name: string;
  monogram: string;
  service?: string;
  link?: string;
  logoUrl?: string;
}

const BRANDS_QUERY = `*[_type == "brand"] | order(order asc, _createdAt asc) {
  name, monogram, service, link, logo
}`;

export async function fetchBrands(): Promise<CmsBrand[]> {
  try {
    const docs = await sanityClient.fetch(BRANDS_QUERY);
    if (!Array.isArray(docs) || docs.length === 0) return [];
    return docs.map((d: any) => ({
      name: d.name || '',
      monogram: (d.monogram || (d.name || '?')[0]).toUpperCase(),
      service: d.service || undefined,
      link: d.link || undefined,
      logoUrl: d.logo
        ? builder.image(d.logo).height(96).auto('format').url()
        : undefined,
    }));
  } catch (e) {
    console.warn('[sanity] fetchBrands failed, using local data:', e);
    return [];
  }
}

export interface CmsConcept {
  caption: string;
  alt: string;
  imageUrl: string;
}

const CONCEPTS_QUERY = `*[_type == "concept"] | order(order asc, _createdAt asc) {
  caption, alt, image
}`;

export async function fetchConcepts(): Promise<CmsConcept[]> {
  try {
    const docs = await sanityClient.fetch(CONCEPTS_QUERY);
    if (!Array.isArray(docs) || docs.length === 0) return [];
    return docs
      .filter((d: any) => d.image)
      .map((d: any) => ({
        caption: d.caption || '',
        alt: d.alt || d.caption || 'Visual concept artwork',
        imageUrl: builder.image(d.image).width(840).auto('format').url(),
      }));
  } catch (e) {
    console.warn('[sanity] fetchConcepts failed, using local data:', e);
    return [];
  }
}

export interface CmsSettings {
  tagline?: string;
  description?: string;
  whatsapp?: string;
  whatsappLabel?: string;
  facebook?: string;
  facebookPage?: string;
}

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  tagline, description, whatsapp, whatsappLabel, facebook, facebookPage
}`;

export async function fetchSiteSettings(): Promise<CmsSettings | null> {
  try {
    return (await sanityClient.fetch(SETTINGS_QUERY)) || null;
  } catch (e) {
    console.warn('[sanity] fetchSiteSettings failed, using local data:', e);
    return null;
  }
}
