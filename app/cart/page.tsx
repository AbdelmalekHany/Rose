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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="card p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 relative bg-gray-100 rounded-lg flex-shrink-0">
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
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-semibold text-lg hover:text-rose-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.product.price.toFixed(2)} EGP each
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            {(item.product.price * item.quantity).toFixed(2)} EGP
                          </span>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
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
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={total >= 50 ? 'text-green-600' : ''}>
                    {total >= 50 ? 'Free' : '5.00 EGP'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{(total + (total >= 50 ? 0 : 5)).toFixed(2)} EGP</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full btn btn-primary block text-center mb-4"
              >
                Send Order
              </Link>
              
              <Link
                href="/"
                className="w-full btn btn-outline block text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

