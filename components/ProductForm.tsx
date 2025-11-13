'use client'

import { useState, FormEvent } from 'react'
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
  featured: boolean
  images?: ProductImage[]
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    image: product?.image || '',
    category: product?.category || '',
    stock: product?.stock.toString() || '0',
    featured: product?.featured || false,
  })
  
  // Initialize images from product images array or fallback to single image
  const [images, setImages] = useState<string[]>(() => {
    if (product?.images && product.images.length > 0) {
      return product.images
        .sort((a, b) => a.position - b.position)
        .map(img => img.url)
    }
    // Always have at least one empty field for new products
    return product?.image ? [product.image] : ['']
  })
  const [coverIndex, setCoverIndex] = useState<number>(() => {
    if (product?.images && product.images.length > 0) {
      const coverIdx = product.images.findIndex(img => img.isCover)
      return coverIdx >= 0 ? coverIdx : 0
    }
    return 0
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Filter out empty image URLs
      const validImages = images.filter(url => url.trim() !== '')
      
      const url = product
        ? `/api/admin/products/${String(product.id)}`
        : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: validImages,
          coverIndex: validImages.length > 0 ? Math.min(coverIndex, validImages.length - 1) : 0,
          // keep legacy image set to selected cover for compatibility
          image: validImages.length > 0
            ? validImages[Math.min(coverIndex, validImages.length - 1)]
            : formData.image || '',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to save product')
        setLoading(false)
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Product Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="input"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          className="input min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price (EGP) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            className="input"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium mb-2">
            Stock *
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
            className="input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2">
          Category *
        </label>
        <input
          id="category"
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="input"
          placeholder="e.g., Electronics, Clothing, Books"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Product Images
        </label>
        <div className="space-y-3">
          {images.map((url, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <input
                type="radio"
                name="cover-image"
                checked={coverIndex === idx}
                onChange={() => setCoverIndex(idx)}
                className="w-4 h-4 text-rose-600"
                title="Set as cover image"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const next = [...images]
                  next[idx] = e.target.value
                  setImages(next)
                }}
                className="input flex-1"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                onClick={() => {
                  const next = images.filter((_, i) => i !== idx)
                  setImages(next)
                  if (coverIndex === idx && next.length > 0) {
                    setCoverIndex(0)
                  } else if (coverIndex > idx) {
                    setCoverIndex(coverIndex - 1)
                  }
                }}
                disabled={images.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-rose-400 hover:text-rose-600 transition-colors"
            onClick={() => setImages([...images, ''])}
          >
            + Add Another Image
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Add multiple images for your product. Select one as the cover image (radio button) to use it as the main product image.
        </p>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-2">
          Legacy Image URL (Optional - for backward compatibility)
        </label>
        <input
          id="image"
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="input"
          placeholder="https://example.com/image.jpg"
        />
        <p className="mt-1 text-xs text-gray-500">
          This field is kept for backward compatibility. Use the Product Images section above for multiple images.
        </p>
      </div>

      <div className="flex items-center">
        <input
          id="featured"
          type="checkbox"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
        />
        <label htmlFor="featured" className="ml-2 text-sm font-medium">
          Featured Product
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary disabled:opacity-50"
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

