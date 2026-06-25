import { NextResponse } from "next/server";
import { seed } from "@/lib/db/seed";

export async function POST() {
  try {
    await seed();
    return NextResponse.json({ success: true, message: "Database seeded" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 }
    );
  }
}