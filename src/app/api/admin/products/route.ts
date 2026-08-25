import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { productSearchSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = productSearchSchema.safeParse({
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { search, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: {
            contains: search,
          },
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      categoryId: p.categoryId,
      category: p.category
        ? { id: p.category.id, name: p.category.name }
        : null,
    }));

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { productSchema } = await import("@/lib/validations");
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: parsed.data,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        categoryId: product.categoryId,
        category: product.category
          ? { id: product.category.id, name: product.category.name }
          : null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}