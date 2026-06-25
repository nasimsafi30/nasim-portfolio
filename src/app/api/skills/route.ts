import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM skills ORDER BY "order" ASC`;
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await sql`INSERT INTO skills(name,category,level,color,"order") VALUES(${body.name},${body.category},${body.level||75},${body.color||'blue'},${body.order||0})`;
    return NextResponse.json({ success: true, message: "Added" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}