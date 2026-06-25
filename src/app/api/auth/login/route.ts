import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db-server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Look up user in database
    const users = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1`;
    
    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const user = users[0];

    // Check if user has a password (might be social login only)
    if (!user.password) {
      return NextResponse.json({ success: false, error: "This account uses social login" }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    // Set secure session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ 
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return NextResponse.json({ authenticated: session?.value === "true" });
}