import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    await sql`UPDATE blog_posts SET title=${body.title},excerpt=${body.excerpt},content=${body.content},cover_image=${body.coverImage||null},category=${body.category},published=${body.published},featured=${body.featured||false},updated_at=NOW() WHERE slug=${slug}`;
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await sql`DELETE FROM blog_posts WHERE slug=${slug}`;
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}