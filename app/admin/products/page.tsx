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

  let products
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
      },
    })
  } catch (error: any) {
    // If images table doesn't exist yet, fetch without images
    if (error?.message?.includes('productimage') || error?.message?.includes('does not exist')) {
      products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      })
    } else {
      throw error
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

