'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  category: string | null
  stock: number
  seasonalTag?: string | null
  images?: ProductImage[]
}

export default function ProductAdminList({ products }: { products: Product[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | number | null>(null)

  const handleDelete = async (productId: string | number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setDeleting(productId)
    try {
      const res = await fetch(`/api/admin/products/${String(productId)}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-rose-50 to-pink-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Seasonal Tag
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                      <i className="fas fa-box-open text-2xl text-rose-400"></i>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No products found</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="group hover:bg-rose-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group-hover:shadow-md transition-shadow">
                      {(() => {
                        // Get the cover image (isCover=true) or first image from images array, or fall back to product.image
                        const displayImage = product.images && product.images.length > 0 
                          ? (product.images.find(img => img.isCover)?.url || product.images[0].url)
                          : product.image
                        
                        return displayImage ? (
                          <Image
                            src={displayImage}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                            sizes="100px"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 group-hover:text-rose-600 transition-colors">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category ? (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                        {product.category}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {product.price.toFixed(2)} EGP
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.seasonalTag ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                        <i className="fas fa-leaf"></i>
                        <span>{product.seasonalTag}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${String(product.id)}`}
                        className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 hover:scale-110 transition-transform duration-200"
                      >
                        <i className="fas fa-edit"></i>
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting === product.id ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-trash"></i>
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

