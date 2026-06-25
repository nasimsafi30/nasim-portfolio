import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_HanIfq63SsEN@ep-odd-darkness-atflkg1q-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

export async function getSettings() {
  try {
    const data = await sql`SELECT * FROM site_settings LIMIT 1`;
    if (data.length > 0) {
      return {
        siteName: data[0].site_name || "My Portfolio",
        siteDescription: data[0].site_description || "",
        siteUrl: data[0].site_url || "",
        googleAnalyticsId: data[0].google_analytics_id || "",
        emailNotifications: data[0].email_notifications ?? true,
        autoSyncProjects: data[0].auto_sync_projects ?? true,
        maintenanceMode: data[0].maintenance_mode ?? false,
        customCss: data[0].custom_css || "",
        customJs: data[0].custom_js || "",
        footerText: data[0].footer_text || "",
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting settings:", error);
    return null;
  }
}