'use client'

import { useState, useEffect } from 'react'
import StarRating from './StarRating'
import { useSession } from 'next-auth/react'

interface Review {
  id: string
  rating: number
  comment: string | null
  verifiedPurchase: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface ReviewListProps {
  productId: number | string
  onRefresh?: () => void
}

export default function ReviewList({ productId, onRefresh }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchReviews()
    
    // Listen for refresh events
    const handleRefresh = () => {
      fetchReviews()
    }
    window.addEventListener('reviewSubmitted', handleRefresh)
    
    return () => {
      window.removeEventListener('reviewSubmitted', handleRefresh)
    }
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/product/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        if (onRefresh) {
          onRefresh()
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId))
        if (onRefresh) {
          onRefresh()
        }
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getUserInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
        <i className="fas fa-comments text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = session?.user?.id === review.user.id
        const isAdmin = session?.user?.role === 'ADMIN'

        return (
          <div
            key={review.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* User Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {review.user.image ? (
                    <img
                      src={review.user.image}
                      alt={review.user.name || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getUserInitials(review.user.name, review.user.email)
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-semibold text-gray-800">
                      {review.user.name || 'Anonymous'}
                    </div>
                    {review.verifiedPurchase && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                        <i className="fas fa-check-circle"></i>
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <StarRating rating={review.rating} size="sm" />
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {review.comment}
                    </p>
                  )}

                  <div className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              {(isOwner || isAdmin) && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  title="Delete review"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

