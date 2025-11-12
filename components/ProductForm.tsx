'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: number | string
  name: string
  description: string | null
  price: number
  image?: string | null
  category: string | null
  stock: number
  featured: boolean
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
  const [images, setImages] = useState<string[]>(
    product?.image ? [product.image] : []
  )
  const [coverIndex, setCoverIndex] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
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
          images,
          coverIndex,
          // keep legacy image set to selected cover for compatibility
          image:
            images && images.length > 0
              ? images[Math.min(coverIndex, images.length - 1)]
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
          Images and Cover
        </label>
        <div className="space-y-3">
          {images.map((url, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="radio"
                name="cover-image"
                checked={coverIndex === idx}
                onChange={() => setCoverIndex(idx)}
                className="w-4 h-4"
                title="Set as cover"
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
                className="btn btn-secondary"
                onClick={() => {
                  const next = images.filter((_, i) => i !== idx)
                  setImages(next)
                  if (coverIndex === idx) {
                    setCoverIndex(0)
                  } else if (coverIndex > idx) {
                    setCoverIndex(coverIndex - 1)
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setImages([...images, ''])}
            >
              Add image
            </button>
            {images.length === 0 && (
              <span className="text-sm text-gray-500">
                Optional. Add one or more image URLs, then choose a cover.
              </span>
            )}
          </div>
        </div>
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

