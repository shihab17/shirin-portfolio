// ------------------------------------------------------------------
// Work list — the single source of truth for the video grid AND the
// VideoObject JSON-LD schema. To add a project: drop the mp4 into
// public/videos/, the poster into src/assets/, then add an entry here.
// ------------------------------------------------------------------

export interface Project {
  id: string;          // matches videos/<id>.mp4
  title: string;
  kind: string;        // shown under the title
  chips: string[];     // e.g. ratio + duration
  description: string; // used in schema + aria-label
  durationIso: string; // ISO-8601, e.g. "PT1M22S"
}

export const projects: Project[] = [
  {
    id: '01',
    title: 'Product Launch Promo',
    kind: 'Promo Edit',
    chips: ['Vertical 9:16', '1:22'],
    description: 'Vertical product launch promo edit — story-led cuts, motion and color grade.',
    durationIso: 'PT1M22S',
  },
  {
    id: '02',
    title: 'Brand Story Reel',
    kind: 'Promo Edit',
    chips: ['Vertical 9:16', '0:44'],
    description: 'Short vertical brand story reel for social media.',
    durationIso: 'PT44S',
  },
  {
    id: '03',
    title: 'Promo Teaser Cut',
    kind: 'Promo Edit',
    chips: ['Vertical 9:16', '0:29'],
    description: 'Fast-paced vertical promo teaser edit.',
    durationIso: 'PT29S',
  },
  {
    id: '04',
    title: 'Landscape Brand Film',
    kind: 'Promo Edit',
    chips: ['Landscape 16:9', '1:14'],
    description: 'Cinematic landscape brand film edit.',
    durationIso: 'PT1M14S',
  },
  {
    id: '05',
    title: 'YouTube Promo Edit',
    kind: 'Promo Edit',
    chips: ['Landscape 16:9', '1:54'],
    description: 'Long-form landscape promotional edit for YouTube.',
    durationIso: 'PT1M54S',
  },
  {
    id: '06',
    title: 'Product Feature Reel',
    kind: 'Promo Edit',
    chips: ['Vertical 9:16', '1:28'],
    description: 'Vertical product feature reel with motion graphics.',
    durationIso: 'PT1M28S',
  },
  {
    id: '07',
    title: 'Square Social Ad',
    kind: 'Promo Edit',
    chips: ['Square 1:1', '6:28'],
    description: 'Square-format social media ad edit.',
    durationIso: 'PT6M28S',
  },
  {
    id: '08',
    title: 'Campaign Promo Edit',
    kind: 'Promo Edit',
    chips: ['Vertical 9:16', '2:10'],
    description: 'Vertical campaign promo — narrative edit with sound design.',
    durationIso: 'PT2M10S',
  },
  {
    id: '09',
    title: 'Event Highlight Reel',
    kind: 'Promo Edit',
    chips: ['Vertical 9:16', '1:01'],
    description: 'Vertical event highlight reel.',
    durationIso: 'PT1M1S',
  },
  {
    id: '10',
    title: 'Short-Form Ad Cut',
    kind: 'Promo Edit',
    chips: ['Vertical 9:16', '0:27'],
    description: 'Punchy short-form vertical ad edit.',
    durationIso: 'PT27S',
  },
];

export const videoPoster = (id: string) => `poster-${id}`;
export const videoSrc = (id: string) => `/videos/${id}.mp4`;
