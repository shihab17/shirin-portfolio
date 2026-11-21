// Fallback for the "Trusted By" section — used only when Sanity is
// unreachable or has no brand documents. Edit brands in the Sanity
// Studio instead; they appear here after the next build.
export interface Brand {
  name: string;
  monogram: string;
  service?: string;
  link?: string;
  logoUrl?: string;
}

export const brands: Brand[] = [
  { name: 'Chonk', monogram: 'C', service: 'Social Ads' },
  { name: 'Home-made Baby Food by Jafrin', monogram: 'J', service: 'Emotional Ad' },
  { name: 'USA-based Website Client', monogram: 'W', service: 'Web Promo' },
];
