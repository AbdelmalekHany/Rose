'use client'

import { useState, useEffect } from 'react'
import StarRating from './StarRating'

interface ReviewSummaryProps {
  productId: number | string
}

interface ReviewData {
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
}

export default function ReviewSummary({ productId }: ReviewSummaryProps) {
  const [data, setData] = useState<ReviewData>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {},
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
    
    // Listen for refresh events
    const handleRefresh = () => {
      fetchSummary()
    }
    window.addEventListener('reviewRefresh', handleRefresh)
    window.addEventListener('reviewSubmitted', handleRefresh)
    
    return () => {
      window.removeEventListener('reviewRefresh', handleRefresh)
      window.removeEventListener('reviewSubmitted', handleRefresh)
    }
  }, [productId])

  const fetchSummary = async () => {
    try {
      const response = await fetch(`/api/reviews/${productId}`)
      if (response.ok) {
        const result = await response.json()
        const reviews = result.reviews || []
        
        // Calculate rating distribution
        const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        reviews.forEach((review: { rating: number }) => {
          distribution[review.rating] = (distribution[review.rating] || 0) + 1
        })

        setData({
          averageRating: result.averageRating || 0,
          totalReviews: result.totalReviews || 0,
          ratingDistribution: distribution,
        })
      }
    } catch (error) {
      console.error('Error fetching review summary:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const { averageRating, totalReviews, ratingDistribution } = data
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Average Rating */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-5xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={averageRating} size="lg" />
          <div className="text-gray-600 text-sm mt-2">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Rating Distribution */}
        {ratingDistribution && totalReviews > 0 && (
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-semibold text-gray-700">{star}</span>
                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

