import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { Reminder } from "@/lib/models";
import {
  createReminder,
  deleteReminder,
  getReminderById,
  getRemindersByUserId,
  updateReminder,
} from "@/lib/reminder";
import { getUserByEmail } from "@/lib/user";

const getDbAndUser = async (req: NextAuthRequest) => {
  if (!req.auth) throw new Error("Unauthorized");

  const db = getCloudflareContext().env.DB;
  const email = req?.auth?.user?.email as string;
  const user = await getUserByEmail(db, email);

  return { db, user };
};

export const GET = auth(async function (req) {
  const { db, user } = await getDbAndUser(req);
  const reminders = await getRemindersByUserId(db, user.id);

  return NextResponse.json(reminders, { status: 200 });
});

export const POST = auth(async function (req) {
  const { db, user } = await getDbAndUser(req);
  const reminder = (await req.json()) as Reminder & { minutes: number };

  if (reminder.minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + reminder.minutes);
    reminder.remind_at = now.toISOString();
    reminder.period = "once";
  }

  if (!reminder.name || !reminder.remind_at || !reminder.period) {
    return NextResponse.json("Bad Request", { status: 400 });
  }

  reminder.user_id = user.id;

  const result = await createReminder(db, reminder);

  return NextResponse.json(result, { status: 201 });
});

export const PUT = auth(async function (req) {
  const { db, user } = await getDbAndUser(req);
  const reminder = (await req.json()) as Reminder;
  const existingReminder = await getReminderById(db, reminder.id);
  const isOwner = existingReminder && existingReminder.user_id === user.id;

  if (!isOwner) return NextResponse.json("Unauthorized", { status: 401 });

  reminder.user_id = user.id;

  const updatedReminder = await updateReminder(db, reminder);

  return NextResponse.json(updatedReminder, { status: 200 });
});

export const DELETE = auth(async function (req) {
  const { db, user } = await getDbAndUser(req);
  const { id } = (await req.json()) as { id: number };
  const reminder = await getReminderById(db, id);
  const isOwner = reminder && reminder.user_id === user.id;

  if (!isOwner) return NextResponse.json("Unauthorized", { status: 401 });

  await deleteReminder(db, id);

  return NextResponse.json(null, { status: 200 });
});
