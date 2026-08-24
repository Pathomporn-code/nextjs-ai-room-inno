/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import CartButton from "@/app/(front)/components/CartButton";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

type Props = {
  products: any[];
  categories: any[];
};

type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "ใหม่ล่าสุด" },
  { value: "price-asc", label: "ราคาต่ำ → สูง" },
  { value: "price-desc", label: "ราคาสูง → ต่ำ" },
  { value: "name-asc", label: "ชื่อ ก → ฮ" },
  { value: "name-desc", label: "ชื่อ ฮ → ก" },
];

const FeaturesProduct = ({ products, categories }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== null) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name-asc":
        result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        break;
      case "name-desc":
        result.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        break;
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  const activeCategoryName =
    selectedCategory !== null
      ? categories.find((c) => c.id === selectedCategory)?.name
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          สินค้าทั้งหมด
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          ค้นหาสินค้าคุณภาพจากร้านของเรา
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-10 text-sm outline-none ring-offset-background focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle filter (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-lg border bg-background px-3 py-2.5 text-sm sm:hidden"
          >
            ตัวกรอง
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div
        className={`mt-5 flex flex-wrap gap-2 ${showFilters ? "" : "hidden sm:flex"}`}
      >
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          ทั้งหมด ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Active filter indicator */}
      {(search || selectedCategory !== null) && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            พบ {filteredProducts.length} รายการ
            {activeCategoryName && ` ในหมวด "${activeCategoryName}"`}
          </span>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
            className="text-primary hover:underline"
          >
            ล้างตัวกรอง
          </button>
        </div>
      )}

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-lg text-muted-foreground">ไม่พบสินค้าที่ค้นหา</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
            className="mt-4 text-primary hover:underline"
          >
            ล้างตัวกรอง
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              {/* Image */}
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                  <Image
                    alt={product.name ?? "product"}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={400}
                    height={500}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    src={`/product-image/${product.images?.[0]?.imageName || "placeholder.jpg"}`}
                  />
                  {product.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-5">
                <Link href={`/product/${product.id}`}>
                  <h3 className="line-clamp-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                </Link>
                {product.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    ฿{product.price?.toLocaleString() ?? "0"}
                  </span>
                </div>
                <CartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturesProduct;
