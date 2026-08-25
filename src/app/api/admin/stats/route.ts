import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [revenueResult, orderCount, customerCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.order.count(),
      prisma.customer.count(),
    ]);

    const totalRevenue = revenueResult._sum.totalAmount ?? 0;
    const totalOrders = orderCount;
    const totalCustomers = customerCount;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
