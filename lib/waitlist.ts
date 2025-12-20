import { sql } from "@vercel/postgres";

export async function addToWaitlist(email: string) {
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Invalid email");
  }

  await sql`
    insert into waitlist (email) values (${email.toLowerCase()})
    on conflict (email) do nothing;
  `;
}
