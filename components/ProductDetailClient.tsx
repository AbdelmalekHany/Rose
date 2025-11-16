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
  const { addToCart, isAdding } = useCart();
  const [quantity, setQuantity] = useState(1);
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

    const success = await addToCart(String(product.id), quantity);

    if (success) {
      const goToCart = confirm("Added to cart! Would you like to go to cart?");
      if (goToCart) {
        router.push("/cart");
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h22v2H0v-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg">
              {displayImage && !imageError ? (
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : displayImage && imageError ? (
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="fas fa-image text-3xl"></i>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === safeIndex ? "border-rose-400" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {product.price.toFixed(2)} EGP
              </span>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full border-2 ${
                  product.stock > 0
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-red-50 text-red-700 border-red-300"
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-center font-bold text-gray-600 hover:text-rose-600"
                >
                  <i className="fas fa-minus text-xs"></i>
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 1, q + 1))
                  }
                  disabled={quantity >= (product.stock || 1)}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-center font-bold text-gray-600 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Adding to Cart...</span>
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
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>

            {product.category && (
              <div className="text-sm text-gray-500">Category: {product.category}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
