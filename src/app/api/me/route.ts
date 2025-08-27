import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/auth";
import { rotateApiToken } from "@/lib/api-token";
import { getUserByEmail } from "@/lib/user";

const getUser = async (req: NextAuthRequest) => {
  if (!req.auth) throw new Error("Unauthorized");

  const email = req?.auth?.user?.email as string;

  return await getUserByEmail(email);
};

export const GET = auth(async function (req) {
  const user = await getUser(req);
  const { pb_token } = user;

  return NextResponse.json(
    { pb_token, has_api_token: !!user.api_token },
    { status: 200 },
  );
});

export const POST = auth(async function (req) {
  const user = await getUser(req);

  const token = await rotateApiToken(user.id);

  return NextResponse.json({ token }, { status: 200 });
});

export const PUT = auth(async function (req) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const user = await getUser(req);
  const { pb_token } = (await req.json()) as { pb_token: string };

  await sql`UPDATE users SET pb_token = ${pb_token} WHERE id = ${user.id}`;

  return NextResponse.json(null, { status: 200 });
});
