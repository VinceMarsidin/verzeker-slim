import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "@/db"; // Jouw Drizzle instantie

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // Of "mysql" / "sqlite" afhankelijk van je DB
  }),
  plugins: [
    admin({
      defaultRole: "user", // Standaard account is 'user'
      adminRole: "admin",  // Admin rol
    }),
  ],
});