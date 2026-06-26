import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_HX3NU0ebgzFY@ep-odd-darkness-atflkg1q-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const sql = neon(DATABASE_URL);