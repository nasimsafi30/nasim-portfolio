import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contact } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.delete(contact).where(eq(contact.id, parseInt(params.id)));
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}