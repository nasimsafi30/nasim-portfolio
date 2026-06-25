import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    
    let data;
    if (featured === "true") {
      data = await sql`SELECT * FROM testimonials WHERE featured = true ORDER BY "order" DESC`;
    } else {
      data = await sql`SELECT * FROM testimonials ORDER BY "order" DESC`;
    }
    
    console.log("Testimonials GET - Found:", data.length);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Testimonials GET error:", error.message);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Testimonials POST - Creating:", body.name, "| Featured:", body.featured);
    
    // DEFAULT to TRUE - show on main page immediately
    const isFeatured = body.featured !== false;
    
    await sql`
      INSERT INTO testimonials (name, position, company, content, avatar, rating, featured, "order", created_at, updated_at)
      VALUES (
        ${body.name}, ${body.position || null}, ${body.company || null}, 
        ${body.content}, ${body.avatar || null}, ${body.rating || 5}, 
        ${isFeatured}, ${body.order || 0}, NOW(), NOW()
      )
    `;
    
    console.log("Testimonials POST - Created successfully");
    return NextResponse.json({ success: true, message: "Created!" });
  } catch (error: any) {
    console.error("Testimonials POST error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}