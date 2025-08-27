import { neon } from "@neondatabase/serverless";
import { User } from "@/lib/models";

const sql = neon(`${process.env.DATABASE_URL}`);

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashToken(token: string): Promise<string> {
  const enc = new TextEncoder().encode(token);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function rotateApiToken(userId: number) {
  const token = generateToken();
  const tokenHash = await hashToken(token);

  await sql`UPDATE users SET api_token = ${tokenHash} WHERE id = ${userId}`;

  return token; // return raw token to user ONCE
}

export const getUserByAPIToken = async (apiToken: string) => {
  const tokenHash = await hashToken(apiToken);
  const result = await sql`SELECT * FROM users WHERE api_token = ${tokenHash}`;

  return result[0] as unknown as User;
};
