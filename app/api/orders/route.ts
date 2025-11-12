import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { shippingAddress, cartItems, total } = body

    if (!shippingAddress || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      )
    }

    const normalizedItems = cartItems.map((item: any) => {
      const productId =
        typeof item.productId === 'string' ? parseInt(item.productId, 10) : item.productId
      if (isNaN(productId)) {
        throw new Error(`Invalid product ID: ${item.productId}`)
      }
      const quantity = Number(item.quantity) || 0
      if (quantity <= 0) {
        throw new Error('Quantity must be at least 1.')
      }
      return { productId, quantity }
    })

    const productIds = normalizedItems.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== normalizedItems.length) {
      return NextResponse.json(
        { error: 'One or more products are unavailable.' },
        { status: 400 }
      )
    }

    let computedSubtotal = 0
    for (const item of normalizedItems) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        return NextResponse.json({ error: 'Product not found.' }, { status: 400 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${product.name}` },
          { status: 400 }
        )
      }
      computedSubtotal += product.price * item.quantity
    }

    const computedShipping = computedSubtotal >= 50 ? 0 : 5
    const computedTotal = computedSubtotal + computedShipping

    if (total && Math.abs(Number(total) - computedTotal) > 0.01) {
      console.warn('Checkout total mismatch. Using server computed total.', {
        provided: total,
        computed: computedTotal,
      })
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          total: computedTotal,
          shippingAddress,
          status: 'PENDING',
          paymentStatus: 'PENDING',
        },
      })

      await tx.orderItem.createMany({
        data: normalizedItems.map((item) => {
          const product = products.find((p) => p.id === item.productId)!
          return {
            orderId: newOrder.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          }
        }),
      })

      await Promise.all(
        normalizedItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      )

      await tx.cartItem.deleteMany({
        where: { userId: session.user.id },
      })

      return newOrder
    })

    revalidatePath('/orders')
    revalidatePath('/admin/orders')

    return NextResponse.json({
      success: true,
      orderId: order.id,
      total: computedTotal,
    })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

