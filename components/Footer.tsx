import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-20 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-rose-900/10 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                The Big Rose
              </span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your premium destination for quality products. Discover elegance and style in every purchase.
            </p>
            <div className="flex gap-4">
              <a href="#" className="group relative w-12 h-12 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 overflow-hidden">
                <i className="fab fa-facebook-f text-sm relative z-10 transform group-hover:scale-110 transition-transform"></i>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a href="#" className="group relative w-12 h-12 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-pink-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50 overflow-hidden">
                <i className="fab fa-instagram text-sm relative z-10 transform group-hover:scale-110 transition-transform"></i>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a href="#" className="group relative w-12 h-12 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-sky-500 hover:to-sky-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/50 overflow-hidden">
                <i className="fab fa-twitter text-sm relative z-10 transform group-hover:scale-110 transition-transform"></i>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a href="#" className="group relative w-12 h-12 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 overflow-hidden">
                <i className="fab fa-youtube text-sm relative z-10 transform group-hover:scale-110 transition-transform"></i>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#featured" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Featured Products
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Returns
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Account</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/login" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Register
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  My Orders
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} The Big Rose. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="relative hover:text-rose-400 transition-colors duration-300 group">
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="relative hover:text-rose-400 transition-colors duration-300 group">
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="relative hover:text-rose-400 transition-colors duration-300 group">
                Cookie Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

