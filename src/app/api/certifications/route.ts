import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM certifications ORDER BY date DESC`;
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const skills = body.skills?.length > 0 ? `{${body.skills.map((s:string)=>`"${s}"`).join(",")}}` : "{}";
    await sql`INSERT INTO certifications(title,issuer,date,expiry_date,credential_id,credential_url,category,skills,"order") VALUES(${body.title},${body.issuer},${body.date},${body.expiryDate||null},${body.credentialId||null},${body.credentialUrl||null},${body.category},${skills}::text[],${body.order||0})`;
    return NextResponse.json({ success: true, message: "Added" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}