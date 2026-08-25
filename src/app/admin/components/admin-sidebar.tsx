"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  RiDashboardLine,
  RiShoppingCartLine,
  RiUserLine,
  RiHome4Line,
  RiBox3Line,
} from "@remixicon/react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { href: "/admin/products", label: "Products", icon: RiBox3Line },
  { href: "/admin/orders", label: "Orders", icon: RiShoppingCartLine },
  { href: "/admin/customers", label: "Customers", icon: RiUserLine },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin/dashboard" className="font-heading text-lg font-bold">
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <button
          onClick={() => { router.push("/"); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RiHome4Line className="size-4" />
          กลับสู่หน้าหลัก
        </button>
      </div>
    </aside>
  );
}
