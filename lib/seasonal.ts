import { cache } from 'react'
import { prisma } from './prisma'
import { seasonalTheme as defaultTheme, SeasonalThemeConfig } from '@/config/seasonalTheme'

export type SeasonalTheme = SeasonalThemeConfig & {
  id?: number
  description?: string
}

function mapCampaignToTheme(campaign: any | null): SeasonalTheme {
  if (!campaign) {
    return defaultTheme
  }

  return {
    slug: campaign.slug ?? defaultTheme.slug,
    badge: campaign.badge ?? defaultTheme.badge,
    title: campaign.title ?? defaultTheme.title,
    subtitle: campaign.subtitle ?? defaultTheme.subtitle,
    description: campaign.description ?? defaultTheme.description,
    heroImage: campaign.heroImage ?? defaultTheme.heroImage,
    heroHeadline: campaign.heroHeadline ?? defaultTheme.heroHeadline,
    heroSubheadline: campaign.heroSubheadline ?? defaultTheme.heroSubheadline,
    accent: campaign.accent ?? defaultTheme.accent,
    accentDark: campaign.accentDark ?? defaultTheme.accentDark,
    accentLight: campaign.accentLight ?? defaultTheme.accentLight,
    backgroundPattern: defaultTheme.backgroundPattern,
    ctaPrimary: {
      label: campaign.ctaPrimaryLabel ?? defaultTheme.ctaPrimary.label,
      href: campaign.ctaPrimaryHref ?? defaultTheme.ctaPrimary.href,
    },
    ctaSecondary: {
      label: campaign.ctaSecondaryLabel ?? defaultTheme.ctaSecondary.label,
      href: campaign.ctaSecondaryHref ?? defaultTheme.ctaSecondary.href,
    },
  }
}

export const getActiveSeasonalTheme = cache(async (): Promise<SeasonalTheme> => {
  const campaign = await prisma.seasonalCampaign.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
  })

  return mapCampaignToTheme(campaign)
})

export async function listSeasonalCampaigns() {
  return prisma.seasonalCampaign.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function deactivateAllCampaigns(tx = prisma) {
  await tx.seasonalCampaign.updateMany({
    data: { isActive: false },
    where: { isActive: true },
  })
}

export { defaultTheme as defaultSeasonalTheme }

