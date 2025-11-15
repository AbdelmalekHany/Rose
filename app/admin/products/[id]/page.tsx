import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/ProductForm'
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  try {
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return null
    }
    
    // Try to get product with images first
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: {
            orderBy: { position: 'asc' },
          },
        } as any,
      })
      return product
    } catch (error: any) {
      // If images table doesn't exist, get product without images
      if (error?.message?.includes('productimage') || error?.message?.includes('does not exist')) {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })
        return product
      }
      throw error
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-rose-50/30 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Edit Product
          </h1>
          <p className="text-gray-600">Update product information</p>
        </div>
        <ProductForm product={product} />
      </div>
    </div>
  )
}

