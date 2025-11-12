import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Verify all items are still in stock and get products
    const products = await Promise.all(
      cartItems.map(async (item: any) => {
        const productId = typeof item.productId === 'string' ? parseInt(item.productId) : item.productId
        if (isNaN(productId)) {
          throw new Error(`Invalid product ID: ${item.productId}`)
        }
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })
        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for ${product.name}`)
        }
        return { product, item: { ...item, productId } }
      })
    )

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          total,
          shippingAddress,
          status: 'PENDING',
          paymentStatus: 'PENDING',
        },
      })

      // Create order items and update stock
      const orderItems = await Promise.all(
        products.map(async ({ product, item }) => {
          const productId = typeof item.productId === 'string' ? parseInt(item.productId) : item.productId
          const orderItem = await tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: productId,
              quantity: item.quantity,
              price: item.price,
            },
          })

          // Update product stock
          await tx.product.update({
            where: { id: productId },
            data: { stock: { decrement: item.quantity } },
          })

          return orderItem
        })
      )

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id },
      })

      return newOrder
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
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

