import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const skills = body.skills?.length > 0 ? `{${body.skills.map((s:string)=>`"${s}"`).join(",")}}` : "{}";
    await sql`UPDATE certifications SET title=${body.title},issuer=${body.issuer},date=${body.date},expiry_date=${body.expiryDate||null},credential_id=${body.credentialId||null},credential_url=${body.credentialUrl||null},category=${body.category},skills=${skills}::text[],"order"=${body.order||0} WHERE id=${parseInt(id)}`;
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await sql`DELETE FROM certifications WHERE id=${parseInt(id)}`;
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}