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
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
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

