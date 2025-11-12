import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: "Red Rose", price: 10.5, description: "A lovely red rose" },
    {
      name: "White Lily",
      price: 8,
      description: "Pure and elegant white lily",
    },
    {
      name: "Sunflower",
      price: 5.25,
      description: "Bright and sunny sunflower",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: { description: p.description, price: p.price },
      create: p,
    });
  }

  console.log("Seeded/upserted products with descriptions!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
