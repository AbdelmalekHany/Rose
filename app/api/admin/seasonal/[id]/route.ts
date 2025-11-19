import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deactivateAllCampaigns } from '@/lib/seasonal'
import { revalidatePath } from 'next/cache'

async function ensureAdmin() {
function revalidateSeasonalPages() {
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/seasonal')
}
  const session = await getServerSession(authOptions)

  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return null
  }

  return session
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
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

    const updated = await prisma.$transaction(async (tx) => {
      if (isActive) {
        await deactivateAllCampaigns(tx)
      }

      return tx.seasonalCampaign.update({
        where: { id },
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
    return NextResponse.json({ campaign: updated })
  } catch (error) {
    console.error('Error updating seasonal campaign:', error)
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    const body = await request.json()
    const { isActive } = body

    const updated = await prisma.$transaction(async (tx) => {
      if (isActive) {
        await deactivateAllCampaigns(tx)
      }

      return tx.seasonalCampaign.update({
        where: { id },
        data: { isActive: Boolean(isActive) },
      })
    })

    revalidateSeasonalPages()
    return NextResponse.json({ campaign: updated })
  } catch (error) {
    console.error('Error toggling seasonal campaign:', error)
    return NextResponse.json({ error: 'Failed to update campaign status' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    await prisma.seasonalCampaign.delete({
      where: { id },
    })

    revalidateSeasonalPages()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting seasonal campaign:', error)
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
  }
}

