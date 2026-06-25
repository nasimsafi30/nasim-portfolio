import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM contact ORDER BY created_at DESC`;
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save message to database
    await sql`
      INSERT INTO contact (name, email, subject, message, read, replied, created_at)
      VALUES (${body.name}, ${body.email}, ${body.subject || null}, ${body.message}, false, false, NOW())
    `;

    // Check if email notifications are enabled in settings
    const settings = await sql`SELECT email_notifications FROM site_settings LIMIT 1`;
    const notificationsEnabled = settings[0]?.email_notifications ?? true;
    
    if (notificationsEnabled) {
      console.log("📧 Email notification enabled - would send email to admin");
      console.log(`   From: ${body.name} <${body.email}>`);
      console.log(`   Subject: ${body.subject || 'No subject'}`);
      // Here you can integrate with SendGrid, Resend, Nodemailer, etc.
    } else {
      console.log("🔕 Email notifications are disabled in settings");
    }

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully!",
      notificationSent: notificationsEnabled 
    });
  } catch (e: any) {
    console.error("Contact POST error:", e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await sql`
      UPDATE contact 
      SET read = ${body.read ?? false}, replied = ${body.replied ?? false}
      WHERE id = ${body.id}
    `;
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}