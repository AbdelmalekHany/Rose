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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      <ProductAdminList products={products} />
    </div>
  )
}

