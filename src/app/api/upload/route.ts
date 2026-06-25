import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file" }, { status: 400 });
    }

    const blob = await put(`portfolio/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      data: { url: blob.url }
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json({ success: false, error: "No url" }, { status: 400 });
    }

    await del(url);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}