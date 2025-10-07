import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { User } from "@/lib/models";
import { users } from "@/lib/schema";

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

  await db
    .update(users)
    .set({ api_token: tokenHash })
    .where(eq(users.id, userId));

  return token;
}

export async function getUserByAPIToken(apiToken: string) {
  const tokenHash = await hashToken(apiToken);

  const result = await db
    .select()
    .from(users)
    .where(eq(users.api_token, tokenHash));

  return result[0] as User;
}
