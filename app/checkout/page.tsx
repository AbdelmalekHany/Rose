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
    if (cartItems.length === 0 && session) {
      router.push('/cart')
    }
  }, [cartItems, session, router])

  if (!session) {
    return null
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
        setError(data.error || 'Failed to create order')
        setLoading(false)
        return
      }

      // Show success message first
      setSuccess(true)
      
      // Clear cart after showing success
      await refreshCart()
      
      // Redirect to orders page after 3 seconds
      setTimeout(async () => {
        // Force refresh before navigating
        router.refresh()
        router.push('/orders')
      }, 3000)
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Sent Successfully!</h2>
              <p className="text-lg text-gray-600">
                We will contact you soon to confirm your order.
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to your orders page...
            </p>
            <button
              onClick={() => router.push('/orders')}
              className="btn btn-primary"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Send Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card p-6 space-y-6">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="input"
                placeholder="e.g., +20 123 456 7890"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll use this number to contact you about your order
              </p>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                House Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                className="input min-h-[100px]"
                placeholder="Enter your full house address including street, building, floor, apartment number, etc."
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input min-h-[80px]"
                placeholder="Any special delivery instructions or notes for your order..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Add any special requests or delivery instructions
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 relative bg-gray-100 rounded-lg flex-shrink-0">
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
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-gray-600 text-sm">
                        {item.product.price.toFixed(2)} EGP × {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold">
                      {(item.product.price * item.quantity).toFixed(2)} EGP
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Sending Order...' : 'Send Order'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'Free' : `${shipping.toFixed(2)} EGP`}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

