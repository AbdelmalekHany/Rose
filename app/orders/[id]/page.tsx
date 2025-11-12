import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Image from 'next/image'

async function getOrder(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    if (!order || order.userId !== userId) {
      return null
    }

    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export default async function OrderPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const order = await getOrder(params.id, session.user.id)

  if (!order) {
    redirect('/orders')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Order Confirmation</h1>
          <p className="text-gray-600">
            Thank you for your order! Your order ID is: <strong>{order.id}</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="font-semibold capitalize">{order.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Payment Status</p>
            <p className="font-semibold capitalize">{order.paymentStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Order Date</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="font-semibold text-rose-600 text-xl">
              {order.total.toFixed(2)} EGP
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <p className="text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-24 h-24 relative bg-white rounded-lg flex-shrink-0">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600">
                    Quantity: {item.quantity} × {item.price.toFixed(2)} EGP
                  </p>
                </div>
                <div className="font-semibold text-lg">
                  {(item.price * item.quantity).toFixed(2)} EGP
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-2xl font-bold text-rose-600">
              {order.total.toFixed(2)} EGP
            </span>
          </div>
        </div>

        <div className="mt-8">
          <a href="/" className="btn btn-primary">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  )
}

