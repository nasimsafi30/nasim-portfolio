import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM about LIMIT 1`;
    if (data.length > 0) return NextResponse.json({ success: true, data: data[0] });
    return NextResponse.json({ success: true, data: null });
  } catch (e: any) {
    return NextResponse.json({ success: true, data: null });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = await sql`SELECT id FROM about LIMIT 1`;
    if (existing.length > 0) {
      await sql`UPDATE about SET name=${body.name}, title=${body.title}, bio=${body.bio}, long_bio=${body.longBio||null}, dob=${body.dob||null}, place_of_birth=${body.placeOfBirth||null}, gender=${body.gender||null}, email=${body.email}, phone=${body.phone||null}, location=${body.location||null}, github=${body.github||null}, linkedin=${body.linkedin||null}, twitter=${body.twitter||null}, website=${body.website||null}, avatar=${body.avatar||null}, resume=${body.resume||null}, updated_at=NOW() WHERE id=${existing[0].id}`;
    } else {
      await sql`INSERT INTO about(name,title,bio,email) VALUES(${body.name},${body.title},${body.bio},${body.email})`;
    }
    return NextResponse.json({ success: true, message: "Saved" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ success: false, error: "No file" }, { status: 400 });
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `profile-${Date.now()}.${file.name.split(".").pop()}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);
    
    const avatarUrl = `/uploads/${filename}`;
    const existing = await sql`SELECT id FROM about LIMIT 1`;
    if (existing.length > 0) await sql`UPDATE about SET avatar=${avatarUrl} WHERE id=${existing[0].id}`;
    else await sql`INSERT INTO about(name,title,bio,email,avatar) VALUES('Admin','Dev','Bio','a@a.com',${avatarUrl})`;
    
    return NextResponse.json({ success: true, data: { avatar: avatarUrl } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}