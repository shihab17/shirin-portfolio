// ------------------------------------------------------------------
// Work list — the single source of truth for the video grid AND the
// VideoObject JSON-LD schema. To add a project: drop the mp4 into
// public/videos/, the poster into src/assets/, then add an entry here.
// ------------------------------------------------------------------

export type Category = 'motion' | 'cinematic' | 'animation' | 'ai' | 'story';

export const categoryLabel: Record<Category, string> = {
  motion: 'Motion Graphics',
  cinematic: 'Cinematic',
  animation: '2D Animation',
  ai: 'AI Video',
  story: 'Storytelling',
};

export interface Project {
  id: string;          // matches videos/<id>.mp4
  title: string;
  kind: string;        // shown under the title
  chips: string[];     // e.g. ratio + duration
  category: Category;  // used for the filter chips
  description: string; // used in schema + aria-label
  durationIso: string; // ISO-8601, e.g. "PT1M22S"
}

export const projects: Project[] = [
  {
    id: '01',
    title: 'Shopkeeper App — Bengali Promo',
    kind: 'App Promo',
    chips: ['Vertical 9:16', '1:22'],
    category: 'motion',
    description:
      'Bengali promo for a shop-management app — dues, stock, sales and accounting in one place.',
    durationIso: 'PT1M22S',
  },
  {
    id: '02',
    title: 'Chonk — Testimonial Ad',
    kind: 'Social Ad',
    chips: ['Vertical 9:16', '0:44'],
    category: 'motion',
    description: 'Customer-testimonial style social ad for Chonk cat food.',
    durationIso: 'PT44S',
  },
  {
    id: '03',
    title: 'Tea Garden — Brand Film',
    kind: 'Brand Film',
    chips: ['Vertical 9:16', '0:29'],
    category: 'cinematic',
    description: 'Cinematic vertical brand film shot in a tea garden.',
    durationIso: 'PT29S',
  },
  {
    id: '04',
    title: 'Brand Film — Landscape Edit',
    kind: 'Promo Edit',
    chips: ['Landscape 16:9', '1:14'],
    category: 'motion',
    description: 'Landscape promotional brand film edit.',
    durationIso: 'PT1M14S',
  },
  {
    id: '05',
    title: 'Village Story — 2D Animation',
    kind: 'Animated Story',
    chips: ['Landscape 16:9', '1:54'],
    category: 'animation',
    description: '2D animated story set in a riverside village — YouTube edit.',
    durationIso: 'PT1M54S',
  },
  {
    id: '06',
    title: 'Baby Food — Emotional Ad',
    kind: 'Social Ad',
    chips: ['Vertical 9:16', '1:28'],
    category: 'motion',
    description: 'Emotional Bengali ad for a home-made baby food brand.',
    durationIso: 'PT1M28S',
  },
  {
    id: '07',
    title: 'Saved Up — Storytelling Edit',
    kind: 'Storytelling',
    chips: ['Square 1:1', '6:28'],
    category: 'story',
    description: 'Subtitled narrative storytelling edit — square format.',
    durationIso: 'PT6M28S',
  },
  {
    id: '08',
    title: 'Ai Adcraft — Agency Promo',
    kind: 'Agency Ad',
    chips: ['Vertical 9:16', '2:10'],
    category: 'ai',
    description: 'Bengali promo for Ai Adcraft — AI-powered video advertising.',
    durationIso: 'PT2M10S',
  },
  {
    id: '09',
    title: 'Village Morning — Cinematic Reel',
    kind: 'Cinematic Cut',
    chips: ['Vertical 9:16', '1:01'],
    category: 'ai',
    description: 'Cinematic vertical reel of a misty riverside village morning.',
    durationIso: 'PT1M1S',
  },
  {
    id: '10',
    title: 'Shop Talk — Docu Promo',
    kind: 'Promo Edit',
    chips: ['Vertical 9:16', '0:27'],
    category: 'motion',
    description: 'Documentary-style promo scene at a village grocery shop.',
    durationIso: 'PT27S',
  },
];

export const videoPoster = (id: string) => `poster-${id}`;
export const videoSrc = (id: string) => `/videos/${id}.mp4`;

// Project used for the hero's ambient background clip.
export const featuredId = '03';
