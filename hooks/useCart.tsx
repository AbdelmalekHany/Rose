'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useCart() {
  const { data: session } = useSession()
  const [itemCount, setItemCount] = useState(0)
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    if (session?.user?.id) {
      fetchCart()
    }
  }, [session])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setCartItems(data.items || [])
        setItemCount(data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!session?.user?.id) {
      alert('Please login to add items to cart')
      return false
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })

      if (res.ok) {
        await fetchCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add to cart:', error)
      return false
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })

      if (res.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Failed to update cart:', error)
    }
  }

  return {
    cartItems,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    refreshCart: fetchCart,
  }
}

