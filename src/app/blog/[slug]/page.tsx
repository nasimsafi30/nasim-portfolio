import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const tagsArray = body.tags?.length > 0 
      ? `{${body.tags.map((t: string) => `"${t}"`).join(",")}}` 
      : null;

    await sql`
      UPDATE blog_posts SET 
        title = ${body.title}, 
        excerpt = ${body.excerpt}, 
        content = ${body.content},
        cover_image = ${body.coverImage || null}, 
        category = ${body.category},
        tags = COALESCE(${tagsArray}::text[], tags), 
        published = ${body.published},
        featured = ${body.featured || false}, 
        updated_at = NOW()
      WHERE slug = ${slug}
    `;
    
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await sql`DELETE FROM blog_posts WHERE slug = ${slug}`;
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete" },
      { status: 500 }
    );
  }
}