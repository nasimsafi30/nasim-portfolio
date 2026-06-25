import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM experience ORDER BY "order" ASC`;
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tech = body.technologies?.length > 0 ? `{${body.technologies.map((t:string)=>`"${t}"`).join(",")}}` : "{}";
    await sql`INSERT INTO experience(title,company,location,type,start_date,end_date,current,description,technologies,"order") VALUES(${body.title},${body.company},${body.location||null},${body.type||'Full-time'},${body.startDate},${body.endDate||null},${body.current||false},${body.description||null},${tech}::text[],${body.order||0})`;
    return NextResponse.json({ success: true, message: "Added" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}