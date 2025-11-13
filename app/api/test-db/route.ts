import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test User table
    const userCount = await prisma.user.count()
    
    // Test Product table
    const productCount = await prisma.product.count()
    
    return NextResponse.json({
      success: true,
      userTableExists: true,
      userCount,
      productTableExists: true,
      productCount,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message,
      code: error?.code,
      userTableExists: !error?.message?.toLowerCase().includes('user'),
      productTableExists: !error?.message?.toLowerCase().includes('product'),
    }, { status: 500 })
  }
}

