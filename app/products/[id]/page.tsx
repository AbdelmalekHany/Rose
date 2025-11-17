import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ProductDetailClient from '@/components/ProductDetailClient'

async function getProduct(id: string) {
  try {
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return null
    }
    
    // Try to get product with images and reviews first
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: {
            orderBy: { position: "asc" },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
            },
          },
        } as any,
      })
      return product
    } catch (error: any) {
      // If images relation fails, get product without images
      const errorMessage = error?.message?.toLowerCase() || '';
      if (
        errorMessage.includes('productimage') ||
        errorMessage.includes('does not exist') ||
        errorMessage.includes('unknown argument') ||
        errorMessage.includes('relation') ||
        error?.code === 'P2009' ||
        error?.code === 'P2014'
      ) {
        console.log("Images relation not available, fetching product without images");
        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: {
            reviews: {
              select: {
                id: true,
                rating: true,
              },
            },
          },
        })
        return product
      }
      // For other errors, log and rethrow
      console.error('Error fetching product with images:', error)
      throw error
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    // Last resort: try without any includes
    try {
      const productId = parseInt(id)
      if (!isNaN(productId)) {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })
        return product
      }
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError)
    }
    return null
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}

