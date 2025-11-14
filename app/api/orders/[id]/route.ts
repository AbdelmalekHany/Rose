import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    // Only allow canceling orders (users can only cancel their own orders)
    if (status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'You can only cancel orders' },
        { status: 400 }
      )
    }

    // Verify the order belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Only allow canceling if order is still pending or processing
    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      return NextResponse.json(
        { error: `Cannot cancel order with status: ${order.status}` },
        { status: 400 }
      )
    }

    // Update order status and restore stock
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const order = await tx.order.update({
        where: { id: params.id },
        data: { status: 'CANCELLED' },
        include: {
          items: true,
        },
      })

      // Restore product stock
      await Promise.all(
        order.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        )
      )

      return order
    })

    revalidatePath('/orders')
    revalidatePath('/admin/orders')

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error('Error canceling order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

