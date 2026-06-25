import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await sql`UPDATE education SET degree=${body.degree},institution=${body.institution},field=${body.field||null},start_date=${body.startDate},end_date=${body.endDate||null},description=${body.description||null},location=${body.location||null},"order"=${body.order||0} WHERE id=${parseInt(id)}`;
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await sql`DELETE FROM education WHERE id=${parseInt(id)}`;
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}