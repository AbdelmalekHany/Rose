'use client'

import { useEffect, useRef, ReactNode } from 'react'

type AnimationType = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'scale' 
  | 'rotate' 
  | 'slide-up' 
  | 'zoom-in'
  | 'bounce-in'
  | 'flip-x'
  | 'flip-y'
  | 'slide-bounce'
  | 'elastic'
  | 'swing'
  | 'float-up'
  | 'slide-rotate'
  | 'zoom-bounce'
  | 'slide-scale'
  | 'rotate-scale'

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  type?: AnimationType
}

export default function ScrollAnimation({ 
  children, 
  className = '', 
  delay = 0,
  type = 'fade-up'
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in')
            }, delay)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  return (
    <div ref={ref} className={`scroll-animate scroll-animate-${type} ${className}`}>
      {children}
    </div>
  )
}

