'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show loading when pathname changes
    setIsLoading(true)
    
    // Hide loading after a short delay to allow page to render
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <>
      {/* Top loading bar - always visible during navigation */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-rose-100">
        <div className="h-full bg-gradient-to-r from-rose-600 to-pink-600 animate-loading-bar"></div>
      </div>
      
      {/* Light loading overlay - only shows briefly */}
      <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] z-[99] flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
          </div>
        </div>
      </div>
    </>
  )
}

