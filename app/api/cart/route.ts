import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ items: cartItems })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing productId or quantity' },
        { status: 400 }
      )
    }

    // Check if product exists and is in stock
    const productIdInt = parseInt(productId)
    if (isNaN(productIdInt)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }
    
    const product = await prisma.product.findUnique({
      where: { id: productIdInt },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check or create cart item
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productIdInt,
        },
      },
    })

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: 'Not enough stock available' },
          { status: 400 }
        )
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      })
    } else {
      if (quantity > product.stock) {
        return NextResponse.json(
          { error: 'Not enough stock available' },
          { status: 400 }
        )
      }

      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productIdInt,
          quantity,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid productId or quantity' },
        { status: 400 }
      )
    }

    // Check product stock
    const productIdInt = parseInt(productId)
    if (isNaN(productIdInt)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }
    
    const product = await prisma.product.findUnique({
      where: { id: productIdInt },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        { error: 'Not enough stock available' },
        { status: 400 }
      )
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productIdInt,
        },
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

