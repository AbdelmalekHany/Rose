'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useState } from 'react'
import StarRating from './StarRating'

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
  reviews?: { rating: number }[]
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [imageError, setImageError] = useState(false)
  const [isAddingThis, setIsAddingThis] = useState(false)

  // Get the cover image (isCover=true) or first image from images array, or fall back to product.image
  const displayImage = product.images && product.images.length > 0 
    ? (product.images.find(img => img.isCover)?.url || product.images[0].url)
    : product.image

  // Calculate average rating
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock === 0) {
      alert('This product is out of stock')
      return
    }

    setIsAddingThis(true)
    const success = await addToCart(String(product.id), 1)
    setIsAddingThis(false)
    
    if (success) {
      alert('Added to cart!')
    }
  }

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group relative block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 hover:border-rose-200"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-pink-500/0 to-rose-600/0 group-hover:from-rose-500/5 group-hover:via-pink-500/5 group-hover:to-rose-600/5 transition-all duration-500 z-10 pointer-events-none"></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {displayImage && !imageError ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : displayImage && imageError ? (
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-rose-500 transition-colors">
            <i className="fas fa-image text-4xl"></i>
          </div>
        )}
        
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-white font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-lg">
            Quick View
          </span>
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3 z-30">
          {product.stock > 0 ? (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
              In Stock
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5 relative z-10 bg-white">
        <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-rose-600 transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {product.description}
          </p>
        )}
        {/* Rating */}
        {averageRating > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <StarRating rating={averageRating} size="sm" />
            <span className="text-xs text-gray-500">
              ({product.reviews?.length || 0})
            </span>
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent group-hover:from-rose-500 group-hover:to-pink-500 transition-all duration-300">
            {product.price.toFixed(2)} EGP
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingThis}
          className="w-full relative overflow-hidden px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-rose-500/50 active:scale-95"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isAddingThis ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : product.stock === 0 ? (
              <>
                <i className="fas fa-times-circle"></i>
                <span>Out of Stock</span>
              </>
            ) : (
              <>
                <i className="fas fa-shopping-cart"></i>
                <span>Add to Cart</span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>
      </div>
    </Link>
  )
}

