import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: "Red Rose", price: 10.5 },
      { name: "White Lily", price: 8.0 },
      { name: "Sunflower", price: 5.25 },
    ],
  });

  const products = await prisma.product.findMany();
  console.log(products);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
