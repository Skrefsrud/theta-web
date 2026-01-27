import { pool } from "@/lib/db";

export async function addToWaitlist(email: string) {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Invalid email");

  await pool.query(
    `insert into waitlist (email) values ($1)
     on conflict (email) do nothing;`,
    [email.toLowerCase()],
  );
}
