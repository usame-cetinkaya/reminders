import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import { notifyViaWebPush } from "@/lib/notification";
import { createSubscription, deleteSubscription } from "@/lib/subscriptions";
import { getUserByEmail } from "@/lib/user";

const getUser = async (req: NextAuthRequest) => {
  if (!req.auth) throw new Error("Unauthorized");

  const email = req?.auth?.user?.email as string;

  return await getUserByEmail(email);
};

export const GET = auth(async function (req) {
  const user = await getUser(req);

  await notifyViaWebPush("Reminders", "This is a test notification.", user.id);

  return NextResponse.json(null, { status: 200 });
});

export const POST = auth(async function (req) {
  const user = await getUser(req);
  const subscription = (await req.json()) as PushSubscription;

  await createSubscription(user, subscription);

  return NextResponse.json(null, { status: 201 });
});

export const DELETE = auth(async function (req) {
  if (!req.auth) throw new Error("Unauthorized");

  const subscription = (await req.json()) as PushSubscription;

  await deleteSubscription(subscription);

  return NextResponse.json(null, { status: 200 });
});
