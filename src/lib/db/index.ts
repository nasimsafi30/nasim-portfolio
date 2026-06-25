import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const DATABASE_URL = "postgresql://neondb_owner:npg_HanIfq63SsEN@ep-odd-darkness-atflkg1q-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const databaseUrl = process.env.DATABASE_URL || DATABASE_URL;

console.log("🔌 Connecting to database...");

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export { schema };