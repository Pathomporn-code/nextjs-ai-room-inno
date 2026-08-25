import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const PERIOD_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "30d";
    const days = PERIOD_DAYS[period] ?? 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        date: { gte: startDate },
      },
      select: {
        date: true,
        totalAmount: true,
      },
    });

    const revenueByDate = new Map<string, number>();
    for (const order of orders) {
      if (!order.date) continue;
      const dateKey = order.date.toISOString().split("T")[0];
      revenueByDate.set(dateKey, (revenueByDate.get(dateKey) ?? 0) + (order.totalAmount ?? 0));
    }

    const data = Array.from(revenueByDate.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
