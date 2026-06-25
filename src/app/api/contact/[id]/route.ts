import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contact } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(contact).where(eq(contact.id, parseInt(id)));
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 }
    );
  }
}