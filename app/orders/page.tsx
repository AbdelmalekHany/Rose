// A comment to refresh the file
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CancelOrderButton from '@/components/CancelOrderButton'

async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { refresh?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login?redirect=/orders')
  }

  const orders = await getUserOrders(session.user.id)
  
  // Log for debugging
  console.log('Orders fetched:', orders.length, 'orders for user:', session.user.id)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-rose-50/30 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 mb-6">
              <i className="fas fa-box-open text-4xl text-rose-400"></i>
            </div>
            <p className="text-gray-500 text-xl mb-6 font-medium">You haven't placed any orders yet.</p>
            <Link href="/" className="inline-flex items-center gap-2 btn btn-primary group">
              <span>Start Shopping</span>
              <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group relative block bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-rose-200 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-pink-500/0 group-hover:from-rose-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>
                <div className="relative flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center">
                        <i className="fas fa-receipt"></i>
                      </div>
                      <h3 className="font-bold text-xl">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <i className="fas fa-calendar text-rose-400"></i>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {order.total.toFixed(2)} EGP
                    </p>
                    <span
                      className={`inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="relative border-t-2 border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-3 font-semibold flex items-center gap-2">
                    <i className="fas fa-shopping-bag text-rose-400"></i>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="text-sm bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 px-3 py-1.5 rounded-lg font-medium text-gray-700"
                      >
                        {item.product.name} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-sm text-gray-500 font-medium px-3 py-1.5">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                  {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                    <div className="mt-4">
                      <CancelOrderButton orderId={order.id} />
                    </div>
                  )}
                </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}