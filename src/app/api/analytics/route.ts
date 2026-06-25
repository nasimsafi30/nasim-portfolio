import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { totalViews: 0, recentViews: 0, uniquePages: 0, viewsByPage: [], viewsByCountry: [], recentPageViews: [] },
  });
}

export async function POST() {
  return NextResponse.json({ success: true });
}