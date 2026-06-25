import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function resetPassword() {
  const email = "admin@nasimsafi.com";
  const newPassword = "admin123";
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    // Update password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));
    console.log("✅ Password updated for:", email);
  } else {
    // Create new user
    await db.insert(users).values({
      id: crypto.randomUUID(),
      name: "Mohammad Nasim Safi",
      email: email,
      password: hashedPassword,
      role: "admin",
      emailVerified: new Date(),
    });
    console.log("✅ New admin user created:", email);
  }
  
  console.log("🔑 Login with:");
  console.log("   Email:", email);
  console.log("   Password:", newPassword);
  process.exit(0);
}

resetPassword().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});