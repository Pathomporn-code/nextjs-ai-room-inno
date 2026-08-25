/* eslint-disable react-hooks/set-state-in-effect, react-hooks/incompatible-library */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { formatTHB } from "@/lib/format";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiRefreshLine,
} from "@remixicon/react";

type Category = { id: number; name: string | null };
type Product = {
  id: number;
  name: string | null;
  description: string | null;
  price: number;
  categoryId: number | null;
  category: Category | null;
};

type ProductsResponse = {
  data: Product[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg =
      typeof body.error === "string"
        ? body.error
        : body.error
          ? JSON.stringify(body.error)
          : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

function ErrorRetry({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground">
      <p>{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RiRefreshLine className="size-4" />
        ลองใหม่
      </Button>
    </div>
  );
}

// Simple toast — ponytail: global state via DOM, no lib
function useSimpleToast() {
  const [msg, setMsg] = useState<{ title: string; desc?: string; variant?: "default" | "destructive" } | null>(null);
  const toast = useCallback((t: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    setMsg({ title: t.title, desc: t.description, variant: t.variant });
    setTimeout(() => setMsg(null), 3000);
  }, []);
  const node = msg ? (
    <div className="fixed right-4 top-4 z-[100] max-w-sm rounded-lg border bg-background px-4 py-3 shadow-lg">
      <p className={`text-sm font-medium ${msg.variant === "destructive" ? "text-destructive" : ""}`}>{msg.title}</p>
      {msg.desc && <p className="text-sm text-muted-foreground">{msg.desc}</p>}
    </div>
  ) : null;
  return { toast, node };
}

function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
  loading,
}: {
  product: Product | null;
  categories: Category[];
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name ?? "",
          description: product.description ?? "",
          price: product.price,
          categoryId: product.categoryId ?? undefined as unknown as number,
        }
      : { name: "", description: "", price: 0, categoryId: undefined as unknown as number },
  });

  useEffect(() => {
    form.reset(
      product
        ? {
            name: product.name ?? "",
            description: product.description ?? "",
            price: product.price,
            categoryId: product.categoryId ?? undefined as unknown as number,
          }
        : { name: "", description: "", price: 0, categoryId: undefined as unknown as number }
    );
  }, [product, form]);

  return (
    <form onSubmit={form.handleSubmit((d) => onSubmit(d))} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">ชื่อสินค้า *</Label>
        <Input id="name" placeholder="ชื่อสินค้า" {...form.register("name")} disabled={loading} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">รายละเอียด</Label>
        <Textarea id="description" placeholder="รายละเอียดสินค้า" rows={3} {...form.register("description")} disabled={loading} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price">ราคา *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...form.register("price", { valueAsNumber: true })}
          disabled={loading}
        />
        {form.formState.errors.price && (
          <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>หมวดหมู่ *</Label>
        <Select
          value={form.watch("categoryId") ? String(form.watch("categoryId")) : ""}
          onValueChange={(v: string) => form.setValue("categoryId", Number(v), { shouldValidate: true })}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="เลือกหมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name ?? `Category #${c.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.categoryId && (
          <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading && <Spinner className="size-4" />}
          {product ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
          ยกเลิก
        </Button>
      </div>
    </form>
  );
}

export default function ProductsClient() {
  const { toast, node: toastNode } = useSimpleToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductsResponse["meta"]>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // debounce search 300ms
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  // reset to page 1 when debounced search changes
  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "10" });
      if (debounced) qs.set("search", debounced);
      const res = await fetchJSON<ProductsResponse>(`/api/admin/products?${qs.toString()}`);
      setProducts(res.data);
      setMeta(res.meta);
    } catch {
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
    } finally {
      setLoading(false);
    }
  }, [page, debounced]);

  const loadCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const res = await fetchJSON<{ data: Category[] }>("/api/admin/categories");
      setCategories(res.data);
    } catch {
      toast({ title: "โหลดหมวดหมู่ไม่สำเร็จ", variant: "destructive" });
    } finally {
      setCatLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: ProductFormData) => {
    setFormLoading(true);
    try {
      if (editing) {
        await fetchJSON(`/api/admin/products/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        toast({ title: "แก้ไขสินค้าสำเร็จ" });
      } else {
        await fetchJSON("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        toast({ title: "เพิ่มสินค้าสำเร็จ" });
      }
      closeForm();
      loadProducts();
    } catch (e) {
      toast({ title: editing ? "แก้ไขไม่สำเร็จ" : "เพิ่มสินค้าไม่สำเร็จ", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (p: Product) => {
    try {
      await fetchJSON(`/api/admin/products/${p.id}`, { method: "DELETE" });
      toast({ title: "ลบสินค้าสำเร็จ" });
      loadProducts();
    } catch (e) {
      toast({ title: "ลบไม่สำเร็จ", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {toastNode}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="ค้นหาสินค้า..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openCreate} disabled={catLoading}>
          <RiAddLine className="size-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <Spinner className="size-6" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent>
            <ErrorRetry message={error} onRetry={loadProducts} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead className="text-right">ราคา</TableHead>
                    <TableHead className="w-[100px]">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        ไม่พบสินค้า
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">#{p.id}</TableCell>
                        <TableCell>{p.name ?? "-"}</TableCell>
                        <TableCell>{p.category?.name ?? "-"}</TableCell>
                        <TableCell className="text-right">{formatTHB(p.price)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)} aria-label={`edit-${p.id}`}>
                              <RiEditLine className="size-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon-sm" aria-label={`delete-${p.id}`}>
                                  <RiDeleteBinLine className="size-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    คุณต้องการลบสินค้า <span className="font-semibold text-foreground">{p.name}</span> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(p)}>ลบ</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            หน้า {meta.page} / {meta.totalPages} — ทั้งหมด {meta.total} รายการ
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              ก่อนหน้า
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
            >
              ถัดไป
            </Button>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <CardHeader>
              <CardTitle>{editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                product={editing}
                categories={categories}
                onSubmit={handleSubmit}
                onCancel={closeForm}
                loading={formLoading || catLoading}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
