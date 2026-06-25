import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

async function checkUser() {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@nasimsafi.com"))
    .limit(1);
  
  if (result.length > 0) {
    console.log("✅ Admin user exists:");
    console.log("   Name:", result[0].name);
    console.log("   Email:", result[0].email);
    console.log("   Role:", result[0].role);
    console.log("   Has password:", !!result[0].password);
  } else {
    console.log("❌ Admin user NOT found!");
  }
  process.exit(0);
}

checkUser().catch(console.error);