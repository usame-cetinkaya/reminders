import { User } from "@/lib/models";

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

export async function rotateApiToken(db: D1Database, userId: number) {
  const token = generateToken();
  const tokenHash = await hashToken(token);
  const sql = `UPDATE users SET api_token = ? WHERE id = ?`;

  await db.prepare(sql).bind(tokenHash, userId).run();

  return token; // return raw token to user ONCE
}

export const getUserByAPIToken = async (db: D1Database, apiToken: string) => {
  const tokenHash = await hashToken(apiToken);
  const sql = `SELECT * FROM users WHERE api_token = ?`;
  const result = await db.prepare(sql).bind(tokenHash).first();

  return result as unknown as User;
};
