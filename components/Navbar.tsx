"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/The Big Rose.png"
                alt="The Big Rose"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#featured"
              className="relative text-gray-700 hover:text-rose-600 transition-all duration-300 font-medium group"
            >
              Featured
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#products"
              className="relative text-gray-700 hover:text-rose-600 transition-all duration-300 font-medium group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {session && (
              <Link
                href="/orders"
                className="relative text-gray-700 hover:text-rose-600 transition-all duration-300 font-medium group"
              >
                Orders
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="relative text-gray-700 hover:text-rose-600 transition-all duration-300 font-medium group"
              >
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-all duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="btn btn-outline text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn btn-outline text-sm">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
