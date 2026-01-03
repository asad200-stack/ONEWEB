import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: await hashPassword("demo123456"),
    },
  });

  console.log("Created demo user:", demoUser.email);

  // Create demo store
  const demoStore = await prisma.store.upsert({
    where: { slug: "demo-store" },
    update: {},
    create: {
      name: "Demo Store",
      slug: "demo-store",
      description: "A demo store to showcase the platform",
      ownerId: demoUser.id,
      settings: {
        create: {
          primaryColor: "#4F46E5",
          secondaryColor: "#FFFFFF",
          language: "en",
        },
      },
    },
  });

  console.log("Created demo store:", demoStore.name);

  // Create demo category
  const demoCategory = await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: demoStore.id,
        slug: "electronics",
      },
    },
    update: {},
    create: {
      storeId: demoStore.id,
      name: "Electronics",
      slug: "electronics",
      description: "Electronic products and gadgets",
    },
  });

  console.log("Created demo category:", demoCategory.name);

  // Create demo products
  const product1 = await prisma.product.create({
    data: {
      storeId: demoStore.id,
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 99.99,
      discountedPrice: 79.99,
      discountActive: true,
      currency: "USD",
      stock: 50,
      categoryId: demoCategory.id,
      isActive: true,
      images: {
        create: {
          url: "/placeholder-product.jpg",
          order: 0,
        },
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      storeId: demoStore.id,
      name: "Smart Watch",
      slug: "smart-watch",
      description: "Feature-rich smartwatch with fitness tracking",
      price: 199.99,
      currency: "USD",
      stock: 30,
      categoryId: demoCategory.id,
      isActive: true,
      images: {
        create: {
          url: "/placeholder-product.jpg",
          order: 0,
        },
      },
    },
  });

  console.log("Created demo products");

  // Create demo banner
  await prisma.promotionalBanner.create({
    data: {
      storeId: demoStore.id,
      title: "Welcome to Our Store",
      subtitle: "Discover Amazing Products",
      description: "Shop the latest trends and best deals",
      order: 0,
      isActive: true,
    },
  });

  console.log("Created demo banner");

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

