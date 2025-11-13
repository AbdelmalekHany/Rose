import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check if user already exists
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      })
    } catch (dbError: any) {
      console.error('Database error checking existing user:', dbError)
      throw new Error(`Database connection error: ${dbError?.message || 'Unknown error'}`)
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    let user
    try {
      user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
        },
      })
    } catch (dbError: any) {
      console.error('Database error creating user:', dbError)
      // Check for unique constraint violation
      if (dbError?.code === 'P2002') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }
      throw new Error(`Database error: ${dbError?.message || 'Unknown error'}`)
    }

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}

