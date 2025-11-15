// ProductDetailClient.tsx
"use client";

import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductImage {
  id: number | string;
  url: string;
  position: number;
  isCover?: boolean;
}

interface Product {
  id: number | string;
  name: string;
  description: string | null;
  price: number;
  image?: string | null;
  category: string | null;
  stock: number;
  images?: ProductImage[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  // Collect all images, prefer product.images over product.image
  const allImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : product.image
      ? [product.image]
      : [];

  // Determine initial cover image if any
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const coverIndex = product.images.findIndex((img) => img.isCover);
      setSelectedImageIndex(coverIndex !== -1 ? coverIndex : 0);
    } else {
      setSelectedImageIndex(0);
    }
  }, [product.images]);

  // Ensure selected index is valid
  const safeIndex =
    allImages.length > 0
      ? Math.min(selectedImageIndex, allImages.length - 1)
      : 0;
  const displayImage = allImages[safeIndex] || null;

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      alert("This product is out of stock");
      return;
    }

    setAdding(true);
    const success = await addToCart(String(product.id), quantity);
    setAdding(false);

    if (success) {
      const goToCart = confirm("Added to cart! Would you like to go to cart?");
      if (goToCart) {
        router.push("/cart");
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-rose-50/30 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="group aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4 shadow-xl border border-gray-200">
            {displayImage && !imageError ? (
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
                onError={() => setImageError(true)}
              />
            ) : displayImage && imageError ? (
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <i className="fas fa-image text-6xl"></i>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setImageError(false);
                  }}
                  className={`group/thumb aspect-square relative rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                    safeIndex === index
                      ? "border-rose-600 ring-4 ring-rose-200 shadow-lg"
                      : "border-gray-200 hover:border-rose-300 hover:shadow-md"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                    unoptimized
                  />
                  {safeIndex === index && (
                    <div className="absolute inset-0 bg-rose-500/10"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
          {product.category && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 font-semibold text-sm mb-4 border border-rose-200">
              <i className="fas fa-tag mr-2"></i>
              {product.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>
          )}

          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">
            <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {product.price.toFixed(2)} EGP
            </span>
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-800 font-semibold border-2 border-green-300">
                <i className="fas fa-check-circle"></i>
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-800 font-semibold border-2 border-red-300">
                <i className="fas fa-times-circle"></i>
                Out of Stock
              </span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                <i className="fas fa-sort-numeric-up mr-2 text-rose-500"></i>Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-gray-300 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 flex items-center justify-center font-bold text-gray-600 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  <i className="fas fa-minus text-sm"></i>
                </button>
                <span className="text-2xl font-bold w-16 text-center bg-gray-50 rounded-xl py-2">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-12 h-12 border-2 border-gray-300 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 flex items-center justify-center font-bold text-gray-600 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= product.stock}
                >
                  <i className="fas fa-plus text-sm"></i>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="group relative w-full btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed mb-6 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {adding ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Adding...</span>
                </>
              ) : product.stock === 0 ? (
                <>
                  <i className="fas fa-times-circle"></i>
                  <span>Out of Stock</span>
                </>
              ) : (
                <>
                  <i className="fas fa-shopping-cart"></i>
                  <span>Add to Cart</span>
                  <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>

          <div className="border-t-2 border-gray-200 pt-6 mt-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <i className="fas fa-info-circle text-rose-500"></i>
              Product Details
            </h3>
            <ul className="space-y-3 text-gray-600">
              {product.category && (
                <li className="flex items-center gap-2">
                  <i className="fas fa-tag text-rose-400 w-5"></i>
                  <span><strong>Category:</strong> {product.category}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <i className="fas fa-box text-rose-400 w-5"></i>
                <span><strong>Stock:</strong> {product.stock} units</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
