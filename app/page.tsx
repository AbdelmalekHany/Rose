import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import ProductsSection from "@/components/ProductsSection";
import ScrollAnimation from "@/components/ScrollAnimation";

export const dynamic = "force-dynamic"; // correct position

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { sort?: string; search?: string };
}) {
  const featuredProducts = await getFeaturedProducts();
  const allProducts = await getAllProducts();

  // Filter out featured products from all products
  const featuredIds = new Set(featuredProducts.map((p) => p.id));
  const otherProducts = allProducts.filter((p) => !featuredIds.has(p.id));

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white py-24 md:py-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation type="zoom-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
              Welcome to The Big Rose
            </h1>
          </ScrollAnimation>
          <ScrollAnimation type="fade-up" delay={150}>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-rose-50 font-light">
              Discover premium products curated just for you!
            </p>
          </ScrollAnimation>
          <ScrollAnimation type="scale" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#featured"
                className="inline-block px-8 py-4 bg-white text-rose-600 font-semibold rounded-full hover:bg-rose-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Shop Featured
              </a>
              <a
                href="#products"
                className="inline-block px-8 py-4 bg-rose-700/80 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-rose-800/90 transform hover:scale-105 transition-all duration-200 border-2 border-white/30"
              >
                Browse All
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="featured"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <ScrollAnimation type="fade-left">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-gray-600">Handpicked favorites just for you</p>
          </div>
        </ScrollAnimation>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No featured products available.
            </p>
          </div>
        )}
      </section>

      {/* All Products Section */}
      <ProductsSection products={otherProducts} searchParams={searchParams} />

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScrollAnimation type="rotate" delay={0}>
              <div className="group text-center p-8 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-2 border border-gray-100 hover:border-rose-200">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <i className="fas fa-lock"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-rose-600 transition-colors">
                  Secure Payment
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700">
                  100% secure checkout
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation type="rotate" delay={150}>
              <div className="group text-center p-8 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-2 border border-gray-100 hover:border-rose-200">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <i className="fas fa-undo"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-rose-600 transition-colors">
                  Easy Returns
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700">
                  30-day return policy
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  );
}
