'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'

interface ReviewFormProps {
  productId: number | string
  onReviewSubmitted?: () => void
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      router.push('/login')
      return
    }

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit review')
        setIsSubmitting(false)
        return
      }

      // Reset form
      setRating(0)
      setComment('')
      setError('')

      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }

      // Show success message
      alert('Review submitted successfully!')
    } catch (error) {
      console.error('Error submitting review:', error)
      setError('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
        <p className="text-gray-600 mb-4">Please log in to write a review</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-500 hover:to-pink-500 transition-all"
        >
          Log In
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-rose-400 transition-colors resize-none"
            placeholder="Share your experience with this product..."
            maxLength={1000}
          />
          <div className="text-sm text-gray-500 mt-1 text-right">
            {comment.length}/1000
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Submitting...
            </span>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  )
}

