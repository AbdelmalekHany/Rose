'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useState } from 'react'

interface ProductImage {
  id: number
  url: string
  position: number
  isCover?: boolean
}

interface Product {
  id: number | string
  name: string
  description: string | null
  price: number
  image?: string | null
  stock: number
  images?: ProductImage[]
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get the cover image (isCover=true) or first image from images array, or fall back to product.image
  const displayImage = product.images && product.images.length > 0 
    ? (product.images.find(img => img.isCover)?.url || product.images[0].url)
    : product.image

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock === 0) {
      alert('This product is out of stock')
      return
    }

    setAdding(true)
    const success = await addToCart(String(product.id), 1)
    setAdding(false)
    
    if (success) {
      alert('Added to cart!')
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="card hover:shadow-xl transition-shadow">
      <div className="aspect-square relative bg-gray-100">
        {displayImage && !imageError ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : displayImage && imageError ? (
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-rose-600">
            {product.price.toFixed(2)} EGP
          </span>
          {product.stock > 0 ? (
            <span className="text-green-600 text-sm">In Stock</span>
          ) : (
            <span className="text-red-600 text-sm">Out of Stock</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}

