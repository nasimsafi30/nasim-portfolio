import { NextResponse } from "next/server";
import { sql } from "@/lib/db-server";

export async function GET() {
  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        site_name TEXT DEFAULT 'Mohammad Nasim Safi - Portfolio',
        site_description TEXT DEFAULT 'Full Stack Developer & IT/Networking Engineer',
        site_url TEXT DEFAULT '',
        google_analytics_id TEXT DEFAULT '',
        email_notifications BOOLEAN DEFAULT true,
        auto_sync_projects BOOLEAN DEFAULT true,
        maintenance_mode BOOLEAN DEFAULT false,
        custom_css TEXT DEFAULT '',
        custom_js TEXT DEFAULT '',
        footer_text TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    let data = await sql`SELECT * FROM site_settings LIMIT 1`;
    
    // Insert defaults if empty
    if (data.length === 0) {
      await sql`
        INSERT INTO site_settings (site_name, site_description, email_notifications, auto_sync_projects, maintenance_mode)
        VALUES ('Mohammad Nasim Safi - Portfolio', 'Full Stack Developer & IT/Networking Engineer', true, true, false)
      `;
      data = await sql`SELECT * FROM site_settings LIMIT 1`;
    }

    const row = data[0];
    return NextResponse.json({
      success: true,
      data: {
        siteName: row.site_name,
        siteDescription: row.site_description,
        siteUrl: row.site_url,
        googleAnalyticsId: row.google_analytics_id,
        emailNotifications: row.email_notifications,
        autoSyncProjects: row.auto_sync_projects,
        maintenanceMode: row.maintenance_mode,
        customCss: row.custom_css,
        customJs: row.custom_js,
        footerText: row.footer_text,
      },
    });
  } catch (error: any) {
    console.error("Settings GET error:", error.message);
    return NextResponse.json({
      success: true,
      data: {
        siteName: "Mohammad Nasim Safi - Portfolio",
        emailNotifications: true,
        autoSyncProjects: true,
        maintenanceMode: false,
      },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Saving settings:", body);

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        site_name TEXT DEFAULT 'My Portfolio',
        site_description TEXT DEFAULT '',
        site_url TEXT DEFAULT '',
        google_analytics_id TEXT DEFAULT '',
        email_notifications BOOLEAN DEFAULT true,
        auto_sync_projects BOOLEAN DEFAULT true,
        maintenance_mode BOOLEAN DEFAULT false,
        custom_css TEXT DEFAULT '',
        custom_js TEXT DEFAULT '',
        footer_text TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    const existing = await sql`SELECT id FROM site_settings LIMIT 1`;

    if (existing.length > 0) {
      await sql`
        UPDATE site_settings SET
          site_name = ${body.siteName || 'My Portfolio'},
          site_description = ${body.siteDescription || ''},
          site_url = ${body.siteUrl || ''},
          google_analytics_id = ${body.googleAnalyticsId || ''},
          email_notifications = ${body.emailNotifications ?? true},
          auto_sync_projects = ${body.autoSyncProjects ?? true},
          maintenance_mode = ${body.maintenanceMode ?? false},
          custom_css = ${body.customCss || ''},
          custom_js = ${body.customJs || ''},
          footer_text = ${body.footerText || ''},
          updated_at = NOW()
        WHERE id = ${existing[0].id}
      `;
    } else {
      await sql`
        INSERT INTO site_settings (site_name, site_description, site_url, google_analytics_id, email_notifications, auto_sync_projects, maintenance_mode, custom_css, custom_js, footer_text)
        VALUES (
          ${body.siteName || 'My Portfolio'},
          ${body.siteDescription || ''},
          ${body.siteUrl || ''},
          ${body.googleAnalyticsId || ''},
          ${body.emailNotifications ?? true},
          ${body.autoSyncProjects ?? true},
          ${body.maintenanceMode ?? false},
          ${body.customCss || ''},
          ${body.customJs || ''},
          ${body.footerText || ''}
        )
      `;
    }

    return NextResponse.json({ success: true, message: "Settings saved!" });
  } catch (error: any) {
    console.error("Settings PUT error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}