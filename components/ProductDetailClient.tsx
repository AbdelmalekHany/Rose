'use client'

import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: number | string
  name: string
  description: string | null
  price: number
  image?: string | null
  category: string | null
  stock: number
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      alert('This product is out of stock')
      return
    }

    setAdding(true)
    const success = await addToCart(String(product.id), quantity)
    setAdding(false)
    
    if (success) {
      const goToCart = confirm('Added to cart! Would you like to go to cart?')
      if (goToCart) {
        router.push('/cart')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
          {product.image && !imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : product.image && imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="text-rose-600 font-semibold">{product.category}</span>
          )}
          <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>
          {product.description && (
            <p className="text-gray-600 text-lg mb-6">{product.description}</p>
          )}
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-rose-600">
              {product.price.toFixed(2)} EGP
            </span>
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 font-semibold">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                ✗ Out of Stock
              </span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="w-full btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2 text-gray-600">
              {product.category && <li>Category: {product.category}</li>}
              <li>Stock: {product.stock} units</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

