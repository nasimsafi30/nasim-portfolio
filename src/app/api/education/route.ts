import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM education ORDER BY "order" ASC`;
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await sql`INSERT INTO education(degree,institution,field,start_date,end_date,description,location,"order") VALUES(${body.degree},${body.institution},${body.field||null},${body.startDate},${body.endDate||null},${body.description||null},${body.location||null},${body.order||0})`;
    return NextResponse.json({ success: true, message: "Added" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}