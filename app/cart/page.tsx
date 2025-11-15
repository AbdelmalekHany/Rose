'use client'

import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

export default function CartPage() {
  const { data: session } = useSession()
  const { cartItems, updateQuantity, removeFromCart, refreshCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/login?redirect=/cart')
    }
  }, [session, router])

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-600 mb-4">Please login to view your cart.</p>
        <Link href="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    )
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

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
            Shopping Cart
          </h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 mb-6">
              <i className="fas fa-shopping-cart text-4xl text-rose-400"></i>
            </div>
            <p className="text-gray-500 text-xl mb-6 font-medium">Your cart is empty.</p>
            <Link href="/" className="inline-flex items-center gap-2 btn btn-primary group">
              <span>Continue Shopping</span>
              <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-rose-200 overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-pink-500/0 group-hover:from-rose-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>
                    
                    <div className="relative flex gap-6">
                      <Link href={`/products/${item.product.id}`} className="w-28 h-28 relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex-shrink-0 overflow-hidden group/image">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-xl transition-transform duration-500 group-hover/image:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="fas fa-image text-2xl"></i>
                          </div>
                        )}
                      </Link>
                      
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-bold text-lg mb-1 hover:text-rose-600 transition-colors block"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-gray-600 text-sm mb-4">
                          <span className="font-semibold text-rose-600">{item.product.price.toFixed(2)} EGP</span> each
                        </p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 flex items-center justify-center font-bold text-gray-600 hover:text-rose-600"
                            >
                              <i className="fas fa-minus text-xs"></i>
                            </button>
                            <span className="w-16 text-center font-bold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 flex items-center justify-center font-bold text-gray-600 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <i className="fas fa-plus text-xs"></i>
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <span className="font-extrabold text-xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                              {(item.product.price * item.quantity).toFixed(2)} EGP
                            </span>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-2 hover:scale-110 transition-transform duration-300"
                            >
                              <i className="fas fa-trash"></i>
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-20">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{total.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className={`font-semibold ${total >= 50 ? 'text-green-600' : ''}`}>
                      {total >= 50 ? (
                        <span className="flex items-center gap-1">
                          <i className="fas fa-check-circle"></i>
                          <span>Free</span>
                        </span>
                      ) : (
                        '5.00 EGP'
                      )}
                    </span>
                  </div>
                  {total < 50 && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      Add {(50 - total).toFixed(2)} EGP more for free shipping!
                    </div>
                  )}
                  <div className="border-t-2 border-gray-200 pt-4 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {(total + (total >= 50 ? 0 : 5)).toFixed(2)} EGP
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="group relative w-full btn btn-primary block text-center mb-4 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <i className="fas fa-paper-plane"></i>
                    <span>Proceed to Checkout</span>
                    <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
                
                <Link
                  href="/"
                  className="w-full btn btn-outline block text-center group"
                >
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-arrow-left transform group-hover:-translate-x-1 transition-transform"></i>
                    <span>Continue Shopping</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

