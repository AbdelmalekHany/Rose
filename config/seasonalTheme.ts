// Update this config whenever you launch a new seasonal or event-based campaign.
// Change the slug to match the products you want to highlight (set product.seasonalTag).
export type SeasonalThemeConfig = {
  slug: string
  badge: string
  title: string
  subtitle?: string
  description?: string
  heroImage?: string
  heroHeadline?: string
  heroSubheadline?: string
  accent: string
  accentDark: string
  accentLight: string
  backgroundPattern: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
}

export const seasonalTheme: SeasonalThemeConfig = {
  slug: 'evergreen-collection',
  badge: 'Editor’s pick',
  title: 'Evergreen Collection',
  subtitle: 'A flexible curation that works year round',
  description:
    'Blend expressive palettes, textural stems, and elevated keepsakes that feel special no matter the season. Adjust a single file to refresh headlines, imagery, and colors whenever you launch something new.',
  heroImage: '/The Big Rose.png',
  heroHeadline: 'Bring joyful gifting to life',
  heroSubheadline: 'Soft glows, modern silhouettes, and lasting pieces crafted to feel custom.',
  accent: '#f43f5e',
  accentDark: '#be185d',
  accentLight: '#fecdd3',
  backgroundPattern:
    "url('data:image/svg+xml,%3Csvg width=\\'140\\' height=\\'140\\' viewBox=\\'0 0 140 140\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%23fef2f2\\' fill-opacity=\\'0.7\\'%3E%3Ccircle cx=\\'35\\' cy=\\'35\\' r=\\'6\\'/%3E%3Ccircle cx=\\'105\\' cy=\\'105\\' r=\\'6\\'/%3E%3C/g%3E%3C/svg%3E')",
  ctaPrimary: { label: 'Shop featured', href: '#seasonal' },
  ctaSecondary: { label: 'Browse catalog', href: '#products' },
}
