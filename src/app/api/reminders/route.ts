import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
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

const getUser = async (req: NextAuthRequest) => {
  const authHeader = req.headers.get("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();

    if (token) {
      return await getUserByAPIToken(token);
    }
  }

  if (!req.auth) throw new Error("Unauthorized");

  const email = req?.auth?.user?.email as string;

  return await getUserByEmail(email);
};

export const GET = auth(async function (req) {
  const user = await getUser(req);
  const reminders = await getRemindersByUserId(user.id);
  const result = reminders.map(toReminderDTO);

  return NextResponse.json(result, { status: 200 });
});

export const POST = auth(async function (req) {
  const user = await getUser(req);
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

  const id = await createReminder(reminder);

  return NextResponse.json({ id }, { status: 201 });
});

export const PUT = auth(async function (req) {
  const user = await getUser(req);
  const reminderDTO = (await req.json()) as ReminderDTO;
  const reminder = await getReminderById(reminderDTO.id);
  const isOwner = reminder && reminder.user_id === user.id;

  if (!isOwner) return NextResponse.json("Unauthorized", { status: 401 });

  if (!reminderDTO.name || !reminderDTO.remind_at || !reminderDTO.period) {
    return NextResponse.json("Bad Request", { status: 400 });
  }

  const patchedReminder = updateReminderWithDTO(reminder, reminderDTO);

  await updateReminder(patchedReminder);

  return NextResponse.json(null, { status: 200 });
});

export const DELETE = auth(async function (req) {
  const user = await getUser(req);
  const { id } = (await req.json()) as { id: number };
  const reminder = await getReminderById(id);
  const isOwner = reminder && reminder.user_id === user.id;

  if (!isOwner) return NextResponse.json("Unauthorized", { status: 401 });

  await deleteReminder(id);

  return NextResponse.json(null, { status: 200 });
});
