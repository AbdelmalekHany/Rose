import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Test endpoint to check if orders exist in database
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all orders for this user
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Also check total orders in database
    const totalOrders = await prisma.order.count()
    const userOrdersCount = await prisma.order.count({
      where: { userId: session.user.id },
    })

    return NextResponse.json({
      success: true,
      userOrders: orders,
      userOrdersCount,
      totalOrdersInDB: totalOrders,
      userId: session.user.id,
      ordersWithDetails: orders.map(order => ({
        id: order.id,
        total: order.total,
        status: order.status,
        phoneNumber: order.phoneNumber,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
      })),
    })
  } catch (error: any) {
    console.error('Error in test endpoint:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: error.stack,
      },
      { status: 500 }
    )
  }
}

