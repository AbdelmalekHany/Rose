import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import ProductsSection from "@/components/ProductsSection";
import ScrollAnimation from "@/components/ScrollAnimation";
import { seasonalTheme } from "@/config/seasonalTheme";

// Enable ISR (Incremental Static Regeneration) for better performance
export const revalidate = 60; // Revalidate every 60 seconds

// Optimized: Single query to fetch all products, then filter in memory
// This reduces database round trips and improves performance
async function getAllProductsOptimized() {
  try {
    // Try to get products with images first
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          stock: true,
          seasonalTag: true,
          createdAt: true,
          images: {
            select: {
              id: true,
              url: true,
              position: true,
              isCover: true,
            },
            orderBy: { position: "asc" },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return products || [];
    } catch (error: any) {
      // If images relation fails, get products without images
      const errorMessage = error?.message?.toLowerCase() || "";
      if (
        errorMessage.includes("productimage") ||
        errorMessage.includes("does not exist") ||
        errorMessage.includes("unknown argument") ||
        errorMessage.includes("relation") ||
        error?.code === "P2009" ||
        error?.code === "P2014"
      ) {
        const products = await prisma.product.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            stock: true,
            seasonalTag: true,
            createdAt: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        return products || [];
      }
      console.error("Error fetching products with images:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    // Last resort: try to get products without any includes
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          stock: true,
          seasonalTag: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return products || [];
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      return [];
    }
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { sort?: string; search?: string };
}) {
  // Optimized: Single database query instead of two
  const allProducts = await getAllProductsOptimized();

  // Group products by current seasonal campaign
  const seasonalProducts = allProducts.filter(
    (p) => p.seasonalTag && p.seasonalTag === seasonalTheme.slug
  );
  const seasonalIds = new Set(seasonalProducts.map((p) => p.id));
  const otherProducts = allProducts.filter((p) => !seasonalIds.has(p.id));

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden text-white py-20 md:py-28"
        style={{ background: seasonalTheme.accent }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: seasonalTheme.backgroundPattern }}
        ></div>
        <div className="absolute inset-x-0 -top-20 h-64 bg-white/10 blur-[120px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-14">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-sm uppercase tracking-[0.25em] font-semibold shadow-lg">
              <i className="fas fa-sparkles"></i>
              {seasonalTheme.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {seasonalTheme.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              {seasonalTheme.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <a
                href={seasonalTheme.ctaPrimary.href}
                className="group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-xl hover:-translate-y-1 transition-transform"
              >
                {seasonalTheme.ctaPrimary.label}
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </a>
              <a
                href={seasonalTheme.ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {seasonalTheme.ctaSecondary.label}
              </a>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-md">
            <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: seasonalTheme.accentLight }}></div>
            <div className="relative rounded-[28px] overflow-hidden border border-white/30 shadow-2xl bg-white/10 backdrop-blur">
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                      Seasonal mood
                    </p>
                    <p className="text-2xl font-bold">{seasonalTheme.subtitle}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-white/20">
                    {seasonalTheme.slug}
                  </span>
                </div>
                <div className="relative h-60 rounded-2xl overflow-hidden shadow-lg border border-white/10">
                  <Image
                    src={seasonalTheme.heroImage}
                    alt={seasonalTheme.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-xs uppercase tracking-widest text-white/80">
                      Limited drop
                    </div>
                    <div className="text-lg font-semibold">
                      {seasonalProducts.length} curated pieces
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-left text-sm text-white/80">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Accent
                    </p>
                    <p className="font-semibold">{seasonalTheme.accent}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Mood
                    </p>
                    <p className="font-semibold">Fresh & Elevated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Products */}
      <section
        id="seasonal"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: seasonalTheme.backgroundPattern }}></div>
        <div className="relative z-10">
          <ScrollAnimation type="slide-bounce">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-50 text-rose-500 font-semibold text-sm">
                <i className="fas fa-leaf"></i>
                Seasonal drop
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-3">
                {seasonalTheme.title}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {seasonalTheme.subtitle}
              </p>
            </div>
          </ScrollAnimation>
          {seasonalProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {seasonalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No seasonal products are live right now. Add the slug{" "}
                <span className="font-semibold">{seasonalTheme.slug}</span> to products you want to spotlight.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* All Products Section */}
      <ProductsSection products={otherProducts} searchParams={searchParams} />

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ScrollAnimation type="bounce-in" delay={0}>
              <div className="text-center group">
                <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  10K+
                </div>
                <div className="text-rose-100 text-lg font-medium">Happy Customers</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation type="zoom-bounce" delay={100}>
              <div className="text-center group">
                <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  500+
                </div>
                <div className="text-rose-100 text-lg font-medium">Products</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation type="elastic" delay={200}>
              <div className="text-center group">
                <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-rose-100 text-lg font-medium">Support</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation type="rotate-scale" delay={300}>
              <div className="text-center group">
                <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  100%
                </div>
                <div className="text-rose-100 text-lg font-medium">Satisfaction</div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-white via-rose-50/20 to-gray-50 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation type="float-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Why Choose Us
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Experience the difference with our premium service and quality products
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollAnimation type="flip-x" delay={0}>
              <div className="group relative text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-3 border border-gray-100 hover:border-rose-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-pink-500/0 group-hover:from-rose-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-rose-500/50">
                    <i className="fas fa-lock"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-rose-600 transition-colors">
                    Secure Payment
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700">
                    100% secure checkout with encrypted transactions
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation type="flip-y" delay={150}>
              <div className="group relative text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-3 border border-gray-100 hover:border-rose-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-pink-500/0 group-hover:from-rose-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-rose-500/50">
                    <i className="fas fa-undo"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-rose-600 transition-colors">
                    Easy Returns
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700">
                    30-day hassle-free return policy
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation type="slide-rotate" delay={300}>
              <div className="group relative text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-3 border border-gray-100 hover:border-rose-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-pink-500/0 group-hover:from-rose-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-rose-500/50">
                    <i className="fas fa-shipping-fast"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-rose-600 transition-colors">
                    Fast Shipping
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700">
                    Quick and reliable delivery to your doorstep
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation type="swing" delay={450}>
              <div className="group relative text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-3 border border-gray-100 hover:border-rose-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-pink-500/0 group-hover:from-rose-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-rose-500/50">
                    <i className="fas fa-headset"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-rose-600 transition-colors">
                    24/7 Support
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700">
                    Round-the-clock customer service assistance
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation type="slide-scale">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                What Our Customers Say
              </h2>
              <p className="text-gray-600 text-lg">Don't just take our word for it</p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation type="bounce-in" delay={0}>
              <div className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-rose-200">
                <div className="absolute top-4 right-4 text-rose-200 text-5xl opacity-50 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-quote-right"></i>
                </div>
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "Amazing quality products and excellent customer service! The shipping was super fast and everything arrived perfectly packaged."
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg mr-4">
                    SM
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Sarah Mohamed</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation type="zoom-bounce" delay={150}>
              <div className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-rose-200">
                <div className="absolute top-4 right-4 text-rose-200 text-5xl opacity-50 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-quote-right"></i>
                </div>
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "I've been shopping here for months and I'm always impressed. Great prices, quality products, and the return policy gives me peace of mind."
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg mr-4">
                    AK
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Ahmed Khaled</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation type="float-up" delay={300}>
              <div className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-rose-200">
                <div className="absolute top-4 right-4 text-rose-200 text-5xl opacity-50 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-quote-right"></i>
                </div>
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "The best online shopping experience I've had! Beautiful website, easy checkout, and my order arrived exactly as described. Highly recommend!"
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg mr-4">
                    NO
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Nour Osman</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-20 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation type="zoom-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers!
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-rose-600 font-bold rounded-xl hover:bg-rose-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
