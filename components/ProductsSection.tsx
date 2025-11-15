'use client'

import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import ScrollAnimation from './ScrollAnimation'

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
  createdAt: Date
  images?: ProductImage[]
}

interface ProductsSectionProps {
  products: Product[]
  searchParams?: { sort?: string; search?: string }
}

export default function ProductsSection({ products, searchParams }: ProductsSectionProps) {
  const [sortBy, setSortBy] = useState(searchParams?.sort || 'newest')
  const [searchQuery, setSearchQuery] = useState(searchParams?.search || '')

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description ?? '').toLowerCase().includes(query)
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return sorted
  }, [products, sortBy, searchQuery])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('sort', e.target.value)
    window.history.pushState({}, '', url.toString())
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const url = new URL(window.location.href)
    if (searchQuery) {
      url.searchParams.set('search', searchQuery)
    } else {
      url.searchParams.delete('search')
    }
    window.history.pushState({}, '', url.toString())
  }

  return (
    <section id="products" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <ScrollAnimation type="slide-bounce">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">All Products</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 md:flex-initial">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input flex-1"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
            
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="input"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </ScrollAnimation>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12 relative z-10">
          <p className="text-gray-500 text-lg mb-4">
            {searchQuery ? 'No products found matching your search.' : 'No products available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 relative z-10">
            <p className="text-gray-600 font-medium">
              Showing {filteredAndSortedProducts.length} product
              {filteredAndSortedProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

