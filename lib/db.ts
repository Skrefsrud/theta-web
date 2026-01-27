import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL/POSTGRES_URL");
}

export const pool = new Pool({
  connectionString,
  // Neon/Vercel serverless: pooled connection string is best.
  // If you see SSL errors, uncomment:
  // ssl: { rejectUnauthorized: false },
});
