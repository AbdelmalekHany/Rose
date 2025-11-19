import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deactivateAllCampaigns } from '@/lib/seasonal'
import { revalidatePath } from 'next/cache'

function revalidateSeasonalPages() {
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/seasonal')
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaigns = await prisma.seasonalCampaign.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ campaigns })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      slug,
      badge,
      title,
      subtitle,
      description,
      heroImage,
      heroHeadline,
      heroSubheadline,
      accent,
      accentLight,
      accentDark,
      ctaPrimaryLabel,
      ctaPrimaryHref,
      ctaSecondaryLabel,
      ctaSecondaryHref,
      isActive,
    } = body

    if (!slug || !badge || !title) {
      return NextResponse.json(
        { error: 'Slug, badge, and title are required.' },
        { status: 400 }
      )
    }

    const created = await prisma.$transaction(async (tx) => {
      if (isActive) {
        await deactivateAllCampaigns(tx)
      }

      return tx.seasonalCampaign.create({
        data: {
          slug: slug.trim().toLowerCase(),
          badge,
          title,
          subtitle,
          description,
          heroImage,
          heroHeadline,
          heroSubheadline,
          accent,
          accentLight,
          accentDark,
          ctaPrimaryLabel,
          ctaPrimaryHref,
          ctaSecondaryLabel,
          ctaSecondaryHref,
          isActive: Boolean(isActive),
        },
      })
    })

    revalidateSeasonalPages()
    return NextResponse.json({ campaign: created })
  } catch (error) {
    console.error('Error creating seasonal campaign:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}

