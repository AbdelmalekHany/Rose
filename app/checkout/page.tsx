'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import Image from 'next/image'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { cartItems, refreshCart } = useCart()
  const [shippingAddress, setShippingAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/login?redirect=/checkout')
    }
  }, [session, router])

  useEffect(() => {
    // Only redirect if cart is empty AND we're not in the middle of submitting
    // Add a small delay to allow cartItems to load
    if (cartItems.length === 0 && session && !loading && !success) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0) {
          router.push('/cart')
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [cartItems, session, router, loading, success])

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Loading...</p>
      </div>
    )
  }

  // Show loading state while cart is being fetched
  if (cartItems.length === 0 && session) {
    // Don't show empty cart message immediately - wait a bit for cart to load
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600 mb-4">Loading checkout...</p>
      </div>
    )
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal >= 50 ? 0 : 5
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!shippingAddress.trim()) {
      setError('Please enter a shipping address')
      setLoading(false)
      return
    }

    if (!phoneNumber.trim()) {
      setError('Please enter a phone number')
      setLoading(false)
      return
    }

    // Basic phone number validation
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress,
          phoneNumber,
          notes: notes.trim() || undefined,
          cartItems: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Order creation failed:', data)
        const errorMessage = data.error || data.details || 'Failed to create order. Please check the console for details.'
        setError(errorMessage)
        setLoading(false)
        // Don't clear cart if order failed
        return
      }

      console.log('Order created successfully:', data)

      // Show success message first
      setSuccess(true)
      
      // Clear cart after showing success
      await refreshCart()
      
      // Redirect immediately to orders page and force refresh
      setTimeout(() => {
        router.push('/orders?refresh=' + Date.now())
        // Force a hard refresh after navigation
        setTimeout(() => {
          window.location.href = '/orders'
        }, 100)
      }, 2000)
    } catch (error: any) {
      console.error('Network error creating order:', error)
      setError(`Network error: ${error.message || 'Failed to connect to server. Please check your connection and try again.'}`)
      setLoading(false)
      // Don't clear cart if there was a network error
    }
  }

  if (success) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 via-emerald-50/50 to-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-2xl mx-auto w-full">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-green-100/50">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-zoom-bounce">
                <i className="fas fa-check text-3xl text-white"></i>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Order Sent Successfully!</h2>
              <p className="text-lg text-gray-600 mb-2">
                We will contact you soon to confirm your order.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to your orders page...
              </p>
            </div>
            <button
              onClick={() => router.push('/orders')}
              className="group relative inline-flex items-center gap-2 btn btn-primary overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <i className="fas fa-list"></i>
                <span>View My Orders</span>
                <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </div>
    )
  }

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
            Checkout
          </h1>
          <p className="text-gray-600">Complete your order details</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Shipping Information</h2>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-slide-bounce">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="group">
              <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-rose-600 transition-colors">
                <i className="fas fa-phone mr-2 text-rose-500"></i>Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="input pl-10 w-full transition-all duration-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="e.g., +20 123 456 7890"
                />
                <i className="fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <i className="fas fa-info-circle"></i>
                We'll use this number to contact you about your order
              </p>
            </div>

            <div className="group">
              <label htmlFor="address" className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-rose-600 transition-colors">
                <i className="fas fa-map-marker-alt mr-2 text-rose-500"></i>House Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                className="input min-h-[100px] w-full transition-all duration-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter your full house address including street, building, floor, apartment number, etc."
              />
            </div>

            <div className="group">
              <label htmlFor="notes" className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-rose-600 transition-colors">
                <i className="fas fa-sticky-note mr-2 text-rose-500"></i>Special Instructions (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input min-h-[80px] w-full transition-all duration-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Any special delivery instructions or notes for your order..."
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <i className="fas fa-info-circle"></i>
                Add any special requests or delivery instructions
              </p>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <i className="fas fa-shopping-bag text-rose-500"></i>
                Order Items
              </h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-20 h-20 relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold text-rose-600">{item.product.price.toFixed(2)} EGP</span> × {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold text-lg bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {(item.product.price * item.quantity).toFixed(2)} EGP
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="group relative w-full btn btn-primary disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Sending Order...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>Send Order</span>
                    <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-20">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? (
                    <span className="flex items-center gap-1">
                      <i className="fas fa-check-circle"></i>
                      <span>Free</span>
                    </span>
                  ) : (
                    `${shipping.toFixed(2)} EGP`
                  )}
                </span>
              </div>
              <div className="border-t-2 border-gray-200 pt-4 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  {total.toFixed(2)} EGP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

