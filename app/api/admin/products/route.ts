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

    // Handle both formats: string array or object array
    let imageUrls: string[] | null = null
    let chosenCoverIndex = 0

    if (Array.isArray(images) && images.length > 0) {
      // Check if it's an array of strings or objects
      if (typeof images[0] === 'string') {
        imageUrls = images.filter((u: unknown) => typeof u === 'string' && u.trim().length > 0)
        chosenCoverIndex = typeof coverIndex === 'number' && imageUrls.length > 0 
          ? Math.min(coverIndex, imageUrls.length - 1) 
          : 0
      } else {
        // Array of objects with url, isCover, position
        imageUrls = images
          .filter((img: any) => img.url && typeof img.url === 'string' && img.url.trim().length > 0)
          .map((img: any) => img.url.trim())
        const coverImg = images.find((img: any) => img.isCover)
        chosenCoverIndex = coverImg ? images.indexOf(coverImg) : 0
      }
    } else if (image && typeof image === 'string' && image.trim().length > 0) {
      imageUrls = [image.trim()]
      chosenCoverIndex = 0
    }

    let result
    try {
      result = await prisma.$transaction(async (tx) => {
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
    } catch (error: any) {
      // If images table doesn't exist, create product without images
      if (error?.message?.includes('productimage') || error?.message?.includes('does not exist')) {
        result = await prisma.product.create({
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
      } else {
        throw error
      }
    }

    return NextResponse.json({ product: result })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

