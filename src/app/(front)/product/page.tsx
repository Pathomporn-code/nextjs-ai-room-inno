import FeaturesProduct from "@/components/features-product";
import prisma from "@/lib/prisma";
import { connection } from "next/server";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

// http://localhost:3000/product
export default async function ProductPage() {
  await connection(); // signals this is a dynamic route
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
    }),
    prisma.category.findMany(),
  ]);

  // แปลง Decimal → number ก่อนส่งให้ Client Component
  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <main>
      {products.length > 0 && (
        <FeaturesProduct products={serializedProducts} categories={categories} />
      )}
    </main>
  );
}
