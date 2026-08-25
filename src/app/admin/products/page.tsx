import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProductsClient from "./products-client";

export const instant = false;

export default async function AdminProductsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-2xl font-bold">จัดการสินค้า</h1>
      <ProductsClient />
    </div>
  );
}