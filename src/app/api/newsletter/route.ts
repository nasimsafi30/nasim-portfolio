import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC`;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if already subscribed
    const existing = await sql`SELECT id FROM newsletter_subscribers WHERE email = ${body.email} LIMIT 1`;

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: "Already subscribed!" });
    }

    await sql`
      INSERT INTO newsletter_subscribers (email, name, active, subscribed_at)
      VALUES (${body.email}, ${body.name || null}, true, NOW())
    `;

    return NextResponse.json({ success: true, message: "Subscribed successfully!" });
  } catch (error: any) {
    console.error("Newsletter error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (email) {
      await sql`UPDATE newsletter_subscribers SET active = false WHERE email = ${email}`;
    }

    return NextResponse.json({ success: true, message: "Unsubscribed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}