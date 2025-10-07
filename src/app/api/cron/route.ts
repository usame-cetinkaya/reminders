import { NextResponse } from "next/server";
import { Reminder } from "@/lib/models";
import { notify } from "@/lib/notification";
import {
  deleteReminder,
  getDueReminders,
  updateReminder,
} from "@/lib/reminder";
import { getUserById } from "@/lib/user";

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("Authorization");

  if (!cronSecret || !authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  console.log(`Cron job started at ${now.toISOString()}`);

  const dueReminders = await getDueReminders(now);

  for (const reminder of dueReminders) {
    const user = await getUserById(reminder.user_id);
    await notify(user, reminder);
    // wait for 1 second to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await handleReminderPeriod(reminder);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

const handleReminderPeriod = async (reminder: Reminder) => {
  const nextRemindAt = new Date(reminder.remind_at);

  switch (reminder.period) {
    case "daily":
      nextRemindAt.setDate(nextRemindAt.getDate() + 1);
      break;
    case "weekly":
      nextRemindAt.setDate(nextRemindAt.getDate() + 7);
      break;
    case "monthly":
      nextRemindAt.setMonth(nextRemindAt.getMonth() + 1);
      break;
    case "yearly":
      nextRemindAt.setFullYear(nextRemindAt.getFullYear() + 1);
      break;
    default:
      await deleteReminder(reminder.id);
      return;
  }

  reminder.remind_at = nextRemindAt.toISOString();

  await updateReminder(reminder);
};
