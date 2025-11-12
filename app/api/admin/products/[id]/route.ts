import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, image, category, stock, featured, images, coverIndex } = body

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const productId = parseInt(params.id)
    const imageUrls: string[] | null =
      Array.isArray(images) && images.length > 0
        ? images.filter((u: unknown) => typeof u === 'string' && u.trim().length > 0)
        : image
        ? [image]
        : null

    const chosenCoverIndex =
      typeof coverIndex === 'number' && imageUrls && imageUrls[coverIndex] ? coverIndex : 0

    const updated = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price: parseFloat(price),
          image: imageUrls && imageUrls.length > 0 ? imageUrls[chosenCoverIndex] : null,
          category: category || null,
          stock: parseInt(stock),
          featured: featured || false,
        },
      })

      if (imageUrls) {
        await tx.productImage.deleteMany({ where: { productId } })
        if (imageUrls.length > 0) {
          await tx.productImage.createMany({
            data: imageUrls.map((url, idx) => ({
              productId,
              url,
              isCover: idx === chosenCoverIndex,
              position: idx,
            })),
          })
        }
      }

      return updatedProduct
    })

    return NextResponse.json({ product: updated })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

