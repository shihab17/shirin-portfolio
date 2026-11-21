// Central site config — edit here and every meta tag / schema updates.
export const site = {
  name: 'Shirin Akter Nupur',
  title: 'Shirin Akter Nupur — Promotional Video Editor | Reels, Ads & Brand Videos',
  description:
    'Shirin Akter Nupur is a promotional video editor with a psychology background. Story-led reels, ads, brand films and YouTube edits that make people stop scrolling.',
  tagline: 'Promotional Video Editor',
  url: (import.meta.env.SITE as string) || 'https://shirin-nupur.pages.dev',
  whatsapp: 'https://wa.me/8801880131455',
  whatsappLabel: 'WhatsApp · 01880131455',
  facebook: 'https://www.facebook.com/share/1En81SgCwC/',
  facebookPage: 'https://www.facebook.com/share/1JxU52z4sE/',
  locale: 'en_US',
  themeColor: '#06100c',
} as const;
