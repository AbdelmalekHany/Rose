import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE - Delete a review (admin or own review)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check if user is admin or owns the review
    const isAdmin = session.user.role === 'ADMIN'
    const isOwner = review.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      )
    }

    await prisma.review.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}

