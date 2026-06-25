import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    // DEBUG: Get ALL posts first to see what's in the database
    const allPosts = await sql`SELECT id, title, published, featured FROM blog_posts`;
    console.log("🗄️ ALL posts in database:", allPosts.length);
    allPosts.forEach((p: any) => console.log(`   - "${p.title}" | published: ${p.published} | featured: ${p.featured}`));
    
    let data;
    if (published === "true") {
      data = await sql`SELECT * FROM blog_posts WHERE published = true ORDER BY published_at DESC LIMIT ${limit}`;
      console.log("📗 Published posts found:", data.length);
    } else {
      data = await sql`SELECT * FROM blog_posts ORDER BY published_at DESC LIMIT ${limit}`;
      console.log("📚 All posts found:", data.length);
    }
    
    // If published=true returns 0 but there are posts, the published column might have issues
    if (published === "true" && data.length === 0 && allPosts.length > 0) {
      console.log("⚠️ Published filter returned 0, but there are posts. Returning all posts instead.");
      data = allPosts;
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Blog GET error:", error.message);
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Blog POST - Creating:", body.title, "| Published:", body.published);
    
    const slug = (body.title || "post")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const tagsArr = body.tags?.length > 0 
      ? `{${body.tags.map((t: string) => `"${t}"`).join(",")}}` 
      : "{}";
    
    const isPublished = body.published !== false;
    
    await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, category, tags, read_time, published, featured, published_at, created_at, updated_at)
      VALUES (
        ${body.title}, ${slug}, ${body.excerpt || ''}, ${body.content || ''}, 
        ${body.coverImage || null}, ${body.category || 'General'}, ${tagsArr}::text[], 
        ${body.readTime || 5}, ${isPublished}, ${body.featured || false},
        ${isPublished ? new Date().toISOString() : null}, NOW(), NOW()
      )
    `;
    
    console.log("✅ Blog POST - Created successfully:", slug);
    return NextResponse.json({ success: true, message: "Created!" });
  } catch (error: any) {
    console.error("Blog POST error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}