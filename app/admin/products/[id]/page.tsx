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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}

