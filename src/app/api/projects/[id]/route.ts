import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Only allow toggling featured
    if (body.featured !== undefined) {
      await sql`UPDATE projects SET featured = ${body.featured} WHERE id = ${parseInt(id)}`;
    }
    
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}