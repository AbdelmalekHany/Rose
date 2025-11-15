import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import CancelOrderButton from '@/components/CancelOrderButton'

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

      <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-rose-50/30 to-white">

        {/* Background pattern */}

        <div className="absolute inset-0 opacity-[0.02]">

          <div className="absolute inset-0" style={{

            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,

          }}></div>

        </div>

  

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">

            <div className="mb-8">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center">

                  <i className="fas fa-receipt"></i>

                </div>

                <div>

                  <h1 className="text-3xl md:text-4xl font-extrabold mb-1 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">

                    Order Confirmation

                  </h1>

                  <p className="text-gray-600">

                    Thank you for your order! Order ID: <strong className="text-rose-600">{order.id.slice(0, 8)}</strong>

                  </p>

                </div>

              </div>

            </div>

  

            <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">

              <div>

                <p className="text-sm text-gray-600 mb-1 font-semibold">Status</p>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${

                  order.status === 'DELIVERED'

                    ? 'bg-green-100 text-green-800 border-2 border-green-300'

                    : order.status === 'CANCELLED'

                    ? 'bg-red-100 text-red-800 border-2 border-red-300'

                    : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'

                }`}>

                  {order.status}

                </span>

              </div>

              <div>

                <p className="text-sm text-gray-600 mb-1 font-semibold">Payment Status</p>

                <p className="font-semibold capitalize text-gray-800">{order.paymentStatus}</p>

              </div>

              <div>

                <p className="text-sm text-gray-600 mb-1 font-semibold">Order Date</p>

                <p className="font-semibold text-gray-800">

                  {new Date(order.createdAt).toLocaleDateString()}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-600 mb-1 font-semibold">Total</p>

                <p className="font-extrabold text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">

                  {order.total.toFixed(2)} EGP

                </p>

              </div>

            </div>

  

            <div className="mb-8">

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

                <i className="fas fa-address-card text-rose-500"></i>

                Contact Information

              </h2>

              <div className="space-y-4">

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">

                  <p className="text-sm text-gray-600 mb-1 font-semibold flex items-center gap-2">

                    <i className="fas fa-phone text-rose-400"></i>Phone Number

                  </p>

  .              <p className="text-gray-800">

                    <a href={`tel:${order.phoneNumber}`} className="text-rose-600 hover:text-rose-700 font-semibold transition-colors">

                      {order.phoneNumber}

                    </a>

                  </p>

                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">

                  <p className="text-sm text-gray-600 mb-1 font-semibold flex items-center gap-2">

                    <i className="fas fa-map-marker-alt text-rose-400"></i>Shipping Address

                  </p>

                  <p className="text-gray-800 whitespace-pre-line">{order.shippingAddress}</p>

                </div>

                {order.notes && (

                  <div className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">

                    <p className="text-sm text-gray-600 mb-2 font-semibold flex items-center gap-2">

                      <i className="fas fa-sticky-note text-yellow-600"></i>Special Instructions

                    </p>

                    <p className="text-gray-700 whitespace-pre-line">{order.notes}</p>

                  </div>

                )}

              </div>

            </div>

  

            <div>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

                <i className="fas fa-shopping-bag text-rose-500"></i>

                Order Items

              </h2>

              <div className="space-y-3">

                {order.items.map((item) => (

                  <div key={item.id} className="group flex gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-rose-200 transition-all duration-300 hover:shadow-md">

                    <div className="w-24 h-24 relative bg-white rounded-xl flex-shrink-0 overflow-hidden">

                      {item.product.image ? (

                        <Image

                          src={item.product.image}

                          alt={item.product.name}

                          fill

                          className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"

                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-gray-400">

                          <i className="fas fa-image text-2xl"></i>

                        </div>

                      )}

                    </div>

                    <div className="flex-1">

                      <h3 className="font-bold text-lg text-gray-800 mb-1">{item.product.name}</h3>

                      <p className="text-gray-600">

                        Quantity: <strong>{item.quantity}</strong> × <span className="font-semibold text-rose-600">{item.price.toFixed(2)} EGP</span>

                      </p>

                    </div>

                    <div className="font-extrabold text-xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">

                      {(item.price * item.quantity).toFixed(2)} EGP

                    </div>

                  </div>

                ))}

              </div>

            </div>

  

            <div className="mt-8 pt-6 border-t-2 border-gray-200">

              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">

                <span className="text-xl font-bold text-gray-800">Total</span>

                <span className="text-3xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">

                  {order.total.toFixed(2)} EGP

                </span>

              </div>

            </div>

  

            <div className="mt-8 flex flex-col sm:flex-row gap-4">

              {(order.status === 'PENDING' || order.status === 'PROCESSING') && (

                <CancelOrderButton orderId={order.id} />

              )}

              <a href="/" className="group relative inline-flex items-center justify-center gap-2 btn btn-primary overflow-hidden">

                <span className="relative z-10 flex items-center gap-2">

                  <i className="fas fa-arrow-left transform group-hover:-translate-x-1 transition-transform"></i>

                  <span>Continue Shopping</span>

                </span>

                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

              </a>

            </div>

        </div>

      </div>

    )