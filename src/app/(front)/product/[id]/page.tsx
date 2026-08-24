import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { connection } from "next/server";
import { ChevronLeft } from "lucide-react";
import ProductDetailClient from "./product-detail-client";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

// http://localhost:3000/product/[id]
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      images: true,
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const serializedProduct = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/product" className="flex items-center gap-1 hover:text-primary">
          <ChevronLeft className="h-4 w-4" />
          สินค้าทั้งหมด
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image
              alt={product.name ?? "product"}
              className="size-full object-cover"
              width={600}
              height={600}
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={`/product-image/${product.images?.[0]?.imageName || "placeholder.jpg"}`}
              priority
            />
            {product.category && (
              <span className="absolute left-4 top-4 rounded-full bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative h-20 w-20 overflow-hidden rounded-lg border-2 border-border bg-muted transition-colors hover:border-primary"
                >
                  <Image
                    alt={`${product.name} ${idx + 1}`}
                    className="size-full object-cover"
                    width={80}
                    height={80}
                    src={`/product-image/${img.imageName}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          {product.category && (
            <span className="mt-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {product.category.name}
            </span>
          )}

          <div className="mt-6">
            <span className="text-3xl font-bold text-primary sm:text-4xl">
              ฿{product.price?.toLocaleString() ?? "0"}
            </span>
          </div>

          {product.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">รายละเอียดสินค้า</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {/* Product meta */}
          <div className="mt-6 rounded-xl border bg-muted/50 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">รหัสสินค้า</span>
                <p className="mt-1 font-medium text-foreground">#{product.id}</p>
              </div>
              {product.category && (
                <div>
                  <span className="text-muted-foreground">หมวดหมู่</span>
                  <p className="mt-1 font-medium text-foreground">{product.category.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Add to cart */}
          <ProductDetailClient product={serializedProduct} />
        </div>
      </div>
    </div>
  );
}
