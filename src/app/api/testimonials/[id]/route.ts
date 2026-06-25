import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await sql`UPDATE testimonials SET name=${body.name},position=${body.position||null},company=${body.company||null},content=${body.content},avatar=${body.avatar||null},rating=${body.rating||5},featured=${body.featured||false},"order"=${body.order||0} WHERE id=${parseInt(id)}`;
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await sql`DELETE FROM testimonials WHERE id=${parseInt(id)}`;
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}