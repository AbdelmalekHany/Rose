'use client'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= Math.round(rating)
          const isHalf = !isFilled && starValue - 0.5 <= rating

          return (
            <span
              key={i}
              onClick={() => handleClick(starValue)}
              className={`${sizeClasses[size]} ${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
              } ${
                isFilled
                  ? 'text-yellow-400'
                  : isHalf
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            >
              {isFilled ? (
                <i className="fas fa-star"></i>
              ) : isHalf ? (
                <i className="fas fa-star-half-alt"></i>
              ) : (
                <i className="far fa-star"></i>
              )}
            </span>
          )
        })}
      </div>
      {showNumber && (
        <span className="text-gray-600 font-semibold">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

