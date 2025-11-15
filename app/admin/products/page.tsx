import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProductAdminList from '@/components/ProductAdminList'

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
      } as any,
    })
    if (!products) products = []
  } catch (error: any) {
    // If images relation fails, fetch without images
    const errorMessage = error?.message?.toLowerCase() || '';
    if (
      errorMessage.includes('productimage') ||
      errorMessage.includes('does not exist') ||
      errorMessage.includes('unknown argument') ||
      errorMessage.includes('relation') ||
      error?.code === 'P2009' ||
      error?.code === 'P2014'
    ) {
      console.log("Images relation not available, fetching products without images");
      products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      })
      if (!products) products = []
    } else {
      console.error("Error fetching admin products:", error);
      // Last resort fallback
      try {
        products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
        })
        if (!products) products = []
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        products = []
      }
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-rose-50/30 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Manage Products
            </h1>
            <p className="text-gray-600">Add, edit, and manage your product catalog</p>
          </div>
          <Link href="/admin/products/new" className="group relative inline-flex items-center gap-2 btn btn-primary overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              <i className="fas fa-plus"></i>
              <span>Add New Product</span>
              <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>
        </div>

        <ProductAdminList products={products} />
      </div>
    </div>
  )
}

