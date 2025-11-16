'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Auto-login the user after successful registration
      try {
        const result = await signIn('credentials', {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          // If auto-login fails, redirect to login page
          router.push('/login?registered=true')
        } else {
          // Successfully logged in, redirect to home
          router.push('/')
          router.refresh()
        }
      } catch (loginError) {
        // If auto-login fails, redirect to login page
        router.push('/login?registered=true')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-pink-50 via-rose-50/50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 border border-pink-100/50 transform hover:shadow-pink-500/20 transition-all duration-500">
          {/* Decorative header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-2xl mb-4 shadow-lg">
              <i className="fas fa-user-plus"></i>
            </div>
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600">Join us and start shopping</p>
          </div>
        
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 animate-slide-bounce">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-rose-600 transition-colors">
                <i className="fas fa-user mr-2 text-rose-500"></i>Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input pl-10 w-full transition-all duration-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="John Doe"
                />
                <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-rose-600 transition-colors">
                <i className="fas fa-envelope mr-2 text-rose-500"></i>Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input pl-10 w-full transition-all duration-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="your@email.com"
                />
                <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-rose-600 transition-colors">
                <i className="fas fa-lock mr-2 text-rose-500"></i>Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="input pl-10 w-full transition-all duration-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="••••••••"
                  minLength={6}
                />
                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-rose-600 transition-colors">
                <i className="fas fa-lock mr-2 text-rose-500"></i>Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="input pl-10 w-full transition-all duration-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="••••••••"
                />
                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full btn btn-primary disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="relative text-rose-600 hover:text-rose-700 font-semibold transition-colors group">
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

