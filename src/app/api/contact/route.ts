// src/app/api/about/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { about } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(about).limit(1);
    return NextResponse.json({ success: true, data: data[0] || null });
  } catch {
    return NextResponse.json({ success: true, data: null });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await db.select().from(about).limit(1);
    
    if (existing.length > 0) {
      await db.update(about).set({
        name: body.name,
        title: body.title,
        bio: body.bio,
        longBio: body.longBio || null,
        dob: body.dob || null,
        placeOfBirth: body.placeOfBirth || null,
        gender: body.gender || null,
        email: body.email,
        phone: body.phone || null,
        location: body.location || null,
        github: body.github || null,
        linkedin: body.linkedin || null,
        twitter: body.twitter || null,
        website: body.website || null,
        avatar: body.avatar || null,
        resume: body.resume || null,
        updatedAt: new Date(),
      }).where(eq(about.id, existing[0].id));
    } else {
      await db.insert(about).values({
        name: body.name,
        title: body.title,
        bio: body.bio,
        email: body.email,
        avatar: body.avatar || null,
        resume: body.resume || null,
      });
    }
    
    return NextResponse.json({ success: true, message: "Saved" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}