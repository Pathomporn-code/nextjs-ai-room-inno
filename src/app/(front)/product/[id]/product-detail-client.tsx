/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type Props = {
  product: any;
};

export default function ProductDetailClient({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={added}
        className="flex-1 sm:flex-none"
      >
        {added ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            เพิ่มแล้ว
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            หยิบใส่ตะกร้า
          </>
        )}
      </Button>
      <Button size="lg" variant="outline" asChild className="flex-1 sm:flex-none">
        <Link href="/cart">ดูตะกร้าสินค้า</Link>
      </Button>
    </div>
  );
}
