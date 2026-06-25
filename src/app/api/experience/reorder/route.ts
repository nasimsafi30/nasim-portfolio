import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { experience } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  try {
    const { orders } = await request.json();

    for (const { id, order } of orders) {
      await db
        .update(experience)
        .set({ order, updatedAt: new Date() })
        .where(eq(experience.id, id));
    }

    return NextResponse.json({ success: true, message: "Reordered" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to reorder" }, { status: 500 });
  }
}