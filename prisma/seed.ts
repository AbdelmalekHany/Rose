import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bigrose.com' },
    update: {},
    create: {
      email: 'admin@bigrose.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@bigrose.com' },
    update: {},
    create: {
      email: 'user@bigrose.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  })
  console.log('Created regular user:', user.email)

  // Create sample products
  const products = [
    {
      name: 'Lorem Ipsum Dolor',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      price: 49.99,
      category: 'Flowers',
      stock: 50,
      seasonalTag: 'spring-blossom',
    },
    {
      name: 'Sit Amet Consectetur',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      price: 24.99,
      category: 'Home Decor',
      stock: 30,
      seasonalTag: 'spring-blossom',
    },
    {
      name: 'Adipiscing Elit Sed',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      price: 129.99,
      category: 'Jewelry',
      stock: 20,
      seasonalTag: 'spring-blossom',
    },
    {
      name: 'Tempor Incididunt Ut',
      description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
      price: 34.99,
      category: 'Personal Care',
      stock: 40,
      seasonalTag: null,
    },
    {
      name: 'Labore Et Dolore',
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      price: 79.99,
      category: 'Home Decor',
      stock: 15,
      seasonalTag: null,
    },
    {
      name: 'Magna Aliqua Ut',
      description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.',
      price: 29.99,
      category: 'Personal Care',
      stock: 25,
      seasonalTag: null,
    },
  ]

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    })
    
    if (!existing) {
      await prisma.product.create({
        data: product,
      })
      console.log(`Created product: ${product.name}`)
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: product,
      })
      console.log(`Updated product: ${product.name}`)
    }
  }

  // Update all existing products that don't match the seed products to use lorem ipsum
  const allProducts = await prisma.product.findMany()
  const seedProductNames = products.map(p => p.name)
  const productsToUpdate = allProducts.filter(p => !seedProductNames.includes(p.name))
  
  for (const product of productsToUpdate) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: `Lorem Ipsum ${String(product.id).slice(0, 8)}`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    })
    console.log(`Updated existing product to lorem ipsum: ${product.id}`)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

