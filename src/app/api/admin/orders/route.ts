import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 5, 100);

    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { date: "desc" },
      include: {
        customer: {
          select: { name: true },
        },
      },
    });

    const data = orders.map((order) => ({
      id: order.id,
      date: order.date?.toISOString() ?? new Date().toISOString(),
      customerName: order.customer?.name ?? "N/A",
      status: order.status ?? "unknown",
      totalAmount: order.totalAmount ?? 0,
    }));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
