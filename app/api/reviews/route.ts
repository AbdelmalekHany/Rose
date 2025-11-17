import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Create a new review
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, rating, comment } = body

    // Validate input
    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      )
    }

    const productIdNum = parseInt(productId)
    if (isNaN(productIdNum)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productIdNum },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productIdNum,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Check if user has purchased this product (for verified purchase badge)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: productIdNum,
        order: {
          userId: session.user.id,
          status: {
            in: ['COMPLETED', 'DELIVERED'], // Only count completed/delivered orders
          },
        },
      },
    })

    // Create the review
    const review = await prisma.review.create({
      data: {
        productId: productIdNum,
        userId: session.user.id,
        rating,
        comment: comment || null,
        verifiedPurchase: !!hasPurchased,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

