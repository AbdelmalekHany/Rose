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
    const {
      name,
      description,
      price,
      image,
      category,
      stock,
      seasonalTag,
      images,
      coverIndex,
    } = body

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const productId = parseInt(params.id)

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

    const normalizedSeasonalTag =
      typeof seasonalTag === 'string' && seasonalTag.trim().length > 0
        ? seasonalTag.trim()
        : null

    let updated
    try {
      updated = await prisma.$transaction(async (tx) => {
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: {
            name,
            description,
            price: parseFloat(price),
            image: imageUrls && imageUrls.length > 0 ? imageUrls[chosenCoverIndex] : null,
            category: category || null,
            stock: parseInt(stock),
            seasonalTag: normalizedSeasonalTag,
          },
        })

        // Delete existing images and create new ones
        try {
          await tx.productImage.deleteMany({ where: { productId } })
        } catch (error: any) {
          // If table doesn't exist, continue
          if (!error?.message?.includes('does not exist') && !error?.message?.includes('productimage')) {
            throw error
          }
        }

        if (imageUrls && imageUrls.length > 0) {
          try {
            await tx.productImage.createMany({
              data: imageUrls.map((url, idx) => ({
                productId,
                url,
                isCover: idx === chosenCoverIndex,
                position: idx,
              })),
            })
          } catch (error: any) {
            // If table doesn't exist, continue without images
            if (!error?.message?.includes('does not exist') && !error?.message?.includes('productimage')) {
              throw error
            }
          }
        }

        return updatedProduct
      })
    } catch (error: any) {
      // If transaction fails due to images table, update product without images
      if (error?.message?.includes('productimage') || error?.message?.includes('does not exist')) {
        updated = await prisma.product.update({
          where: { id: productId },
          data: {
            name,
            description,
            price: parseFloat(price),
            image: imageUrls && imageUrls.length > 0 ? imageUrls[chosenCoverIndex] : null,
            category: category || null,
            stock: parseInt(stock),
            seasonalTag: normalizedSeasonalTag,
          },
        })
      } else {
        throw error
      }
    }

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

