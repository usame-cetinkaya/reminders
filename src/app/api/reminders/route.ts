import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { getUserByAPIToken } from "@/lib/api-token";
import { Reminder, ReminderDTO } from "@/lib/models";
import {
  createReminder,
  deleteReminder,
  getReminderById,
  getRemindersByUserId,
  toReminderDTO,
  updateReminder,
  updateReminderWithDTO,
} from "@/lib/reminder";
import { getUserByEmail } from "@/lib/user";

const getDbAndUser = async (req: NextAuthRequest) => {
  const db = getCloudflareContext().env.DB;

  const authHeader = req.headers.get("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();

    if (token) {
      const user = await getUserByAPIToken(db, token);

      return { db, user };
    }
  }

  if (!req.auth) throw new Error("Unauthorized");

  const email = req?.auth?.user?.email as string;
  const user = await getUserByEmail(db, email);

  return { db, user };
};

export const GET = auth(async function (req) {
  const { db, user } = await getDbAndUser(req);
  const reminders = await getRemindersByUserId(db, user.id);
  const result = reminders.map(toReminderDTO);

  return NextResponse.json(result, { status: 200 });
});

export const POST = auth(async function (req) {
  const { db, user } = await getDbAndUser(req);
  const reminderDTO = (await req.json()) as ReminderDTO & { minutes: number };

  if (reminderDTO.minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + reminderDTO.minutes);
    reminderDTO.remind_at = now.toISOString();
    reminderDTO.period = "once";
  }

  if (!reminderDTO.name || !reminderDTO.remind_at || !reminderDTO.period) {
    return NextResponse.json("Bad Request", { status: 400 });
  }

  const reminder: Reminder = updateReminderWithDTO(
    { user_id: user.id } as Reminder,
    reminderDTO,
  );

  await createReminder(db, reminder);

  const reminders = await getRemindersByUserId(db, user.id);
  const result = reminders.map(toReminderDTO);

  return NextResponse.json(result, { status: 201 });
});

export const PUT = auth(async function (req) {
  const { db, user } = await getDbAndUser(req);
  const reminderDTO = (await req.json()) as ReminderDTO;
  const reminder = await getReminderById(db, reminderDTO.id);
  const isOwner = reminder && reminder.user_id === user.id;

  if (!isOwner) return NextResponse.json("Unauthorized", { status: 401 });

  if (!reminderDTO.name || !reminderDTO.remind_at || !reminderDTO.period) {
    return NextResponse.json("Bad Request", { status: 400 });
  }

  const patchedReminder = updateReminderWithDTO(reminder, reminderDTO);

  await updateReminder(db, patchedReminder);

  return NextResponse.json(null, { status: 200 });
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
