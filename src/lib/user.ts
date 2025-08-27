import { neon } from "@neondatabase/serverless";
import { User } from "@/lib/models";

const sql = neon(`${process.env.DATABASE_URL}`);

export const getUserById = async (id: number) => {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;

  return result[0] as unknown as User;
};

export const getUserByEmail = async (email: string) => {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (email && !result.length) {
    return createUser(email);
  }

  return result[0] as unknown as User;
};

export const createUser = async (email: string) => {
  const result = await sql`
    INSERT INTO users (email)
    VALUES (${email})
    RETURNING id
  `;
  const id = result[0].id;

  return { id, email } as User;
};
