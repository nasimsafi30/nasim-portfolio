import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",  // Neon uses PostgreSQL dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // Neon provides a PostgreSQL connection string
  },
} satisfies Config;