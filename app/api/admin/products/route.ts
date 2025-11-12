import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
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

    const imageUrls: string[] | null =
      Array.isArray(images) && images.length > 0
        ? images.filter((u: unknown) => typeof u === 'string' && u.trim().length > 0)
        : image
        ? [image]
        : null

    const chosenCoverIndex =
      typeof coverIndex === 'number' && imageUrls && imageUrls[coverIndex] ? coverIndex : 0

    const result = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
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

      if (imageUrls && imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map((url, idx) => ({
            productId: created.id,
            url,
            isCover: idx === chosenCoverIndex,
            position: idx,
          })),
        })
      }

      return created
    })

    return NextResponse.json({ product: result })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

