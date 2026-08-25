"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiRefreshLine } from "@remixicon/react";
import { formatTHB, formatDateTime } from "@/lib/format";

const RevenueChart = dynamic(() => import("./revenue-chart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center">
      <Spinner className="size-6" />
    </div>
  ),
});

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
};

type RevenuePoint = { date: string; revenue: number };
type Order = { id: number; date: string; customerName: string; status: string; totalAmount: number };
type Period = "7d" | "30d" | "90d";
type Loadable<T> = { data: T; loading: boolean; error: string | null };

const PERIOD_LABELS: Record<Period, string> = { "7d": "7 วัน", "30d": "30 วัน", "90d": "90 วัน" };

function badgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") return "default";
  if (status === "cancelled") return "destructive";
  if (status === "processing") return "outline";
  return "secondary";
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

function StatsCards({ stats }: { stats: Loadable<Stats | null> }) {
  if (stats.loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="flex h-24 items-center justify-center"><Spinner className="size-5" /></CardContent></Card>
        ))}
      </div>
    );
  }
  if (stats.error || !stats.data) {
    return <Card><CardContent><ErrorRetry message={stats.error ?? "ไม่สามารถโหลดข้อมูลได้"} onRetry={() => {}} /></CardContent></Card>;
  }
  const d = stats.data;
  const items = [
    { label: "รายได้ทั้งหมด", value: formatTHB(d.totalRevenue) },
    { label: "คำสั่งซื้อทั้งหมด", value: d.totalOrders.toLocaleString("th-TH") },
    { label: "ลูกค้าทั้งหมด", value: d.totalCustomers.toLocaleString("th-TH") },
    { label: "มูลค่าเฉลี่ย/คำสั่งซื้อ", value: formatTHB(d.averageOrderValue) },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle></CardHeader>
          <CardContent><p className="font-heading text-2xl font-bold">{item.value}</p></CardContent>
        </Card>
      ))}
    </div>
  );
}

function RevenueSection({ data, period, loading, error, onPeriodChange }: {
  data: RevenuePoint[]; period: Period; loading: boolean; error: string | null; onPeriodChange: (p: Period) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>รายได้</CardTitle>
          <div className="flex gap-1">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <Button key={p} variant={period === p ? "default" : "outline"} size="xs" onClick={() => onPeriodChange(p)}>
                {PERIOD_LABELS[p]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <div className="flex h-[300px] items-center justify-center"><Spinner className="size-6" /></div>
          : error ? <ErrorRetry message={error} onRetry={() => {}} />
          : <RevenueChart data={data} />}
      </CardContent>
    </Card>
  );
}

function RecentOrders({ orders }: { orders: Loadable<Order[]> }) {
  return (
    <Card>
      <CardHeader><CardTitle>คำสั่งซื้อล่าสุด</CardTitle></CardHeader>
      <CardContent>
        {orders.loading ? <div className="flex h-32 items-center justify-center"><Spinner className="size-5" /></div>
          : orders.error ? <ErrorRetry message={orders.error} onRetry={() => {}} />
          : orders.data.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">ไม่มีคำสั่งซื้อ</p>
          : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขที่</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>วันที่</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">มูลค่า</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id}</TableCell>
                    <TableCell>{o.customerName}</TableCell>
                    <TableCell>{formatDateTime(o.date)}</TableCell>
                    <TableCell><Badge variant={badgeVariant(o.status)}>{o.status}</Badge></TableCell>
                    <TableCell className="text-right">{formatTHB(o.totalAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
      </CardContent>
    </Card>
  );
}

export default function DashboardClient() {
  const [stats, setStats] = useState<Loadable<Stats | null>>({ data: null, loading: true, error: null });
  const [revenue, setRevenue] = useState<Loadable<RevenuePoint[]>>({ data: [], loading: true, error: null });
  const [orders, setOrders] = useState<Loadable<Order[]>>({ data: [], loading: true, error: null });
  const [period, setPeriod] = useState<Period>("30d");

  const loadStats = useCallback(async () => {
    setStats((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetchJSON<Stats>("/api/admin/stats");
      setStats({ data, loading: false, error: null });
    } catch {
      setStats((s) => ({ ...s, loading: false, error: "ไม่สามารถโหลดข้อมูลสถิติได้" }));
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setOrders((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await fetchJSON<{ data: Order[] }>("/api/admin/orders?limit=5");
      setOrders({ data, loading: false, error: null });
    } catch {
      setOrders((s) => ({ ...s, loading: false, error: "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้" }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStats((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await fetchJSON<Stats>("/api/admin/stats");
        if (!cancelled) setStats({ data, loading: false, error: null });
      } catch {
        if (!cancelled) setStats((s) => ({ ...s, loading: false, error: "ไม่สามารถโหลดข้อมูลสถิติได้" }));
      }
      setOrders((s) => ({ ...s, loading: true, error: null }));
      try {
        const { data } = await fetchJSON<{ data: Order[] }>("/api/admin/orders?limit=5");
        if (!cancelled) setOrders({ data, loading: false, error: null });
      } catch {
        if (!cancelled) setOrders((s) => ({ ...s, loading: false, error: "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้" }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setRevenue((s) => ({ ...s, loading: true, error: null }));
      try {
        const { data } = await fetchJSON<{ data: RevenuePoint[] }>(`/api/admin/revenue?period=${period}`);
        if (!cancelled) setRevenue({ data, loading: false, error: null });
      } catch {
        if (!cancelled) setRevenue((s) => ({ ...s, loading: false, error: "ไม่สามารถโหลดข้อมูลรายได้ได้" }));
      }
    })();
    return () => { cancelled = true; };
  }, [period]);

  useEffect(() => {
    const id = setInterval(() => { loadStats(); loadOrders(); }, 30_000);
    return () => clearInterval(id);
  }, [loadStats, loadOrders]);

  return (
    <div className="flex flex-col gap-6">
      <StatsCards stats={stats} />
      <RevenueSection data={revenue.data} period={period} loading={revenue.loading} error={revenue.error} onPeriodChange={setPeriod} />
      <RecentOrders orders={orders} />
    </div>
  );
}
