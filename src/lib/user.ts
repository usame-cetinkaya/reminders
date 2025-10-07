import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { User } from "@/lib/models";
import { users } from "@/lib/schema";

export const getUserById = async (id: number) => {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] as User;
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const result = await db.select().from(users).where(eq(users.email, email));

  if (result.length > 0) {
    return result[0];
  }

  return await createUser(email);
};

export const createUser = async (email: string) => {
  const inserted = await db.insert(users).values({ email }).returning();
  return inserted[0];
};
