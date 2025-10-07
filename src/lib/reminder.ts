import { eq, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { Reminder, ReminderDTO } from "@/lib/models";
import { reminders } from "@/lib/schema";

export const toReminderDTO = (reminder: Reminder) => ({
  id: reminder.id,
  name: reminder.name,
  period: reminder.period,
  remind_at: reminder.remind_at,
});

export const updateReminderWithDTO = (
  reminder: Reminder,
  dto: ReminderDTO,
): Reminder => ({
  ...reminder,
  name: dto.name || reminder.name,
  period: dto.period || reminder.period,
  remind_at: dto.remind_at || reminder.remind_at,
});

export const getDueReminders = async (now: Date) => {
  return db
    .select()
    .from(reminders)
    .where(
      lte(reminders.remind_at, now.toISOString()),
    ) as unknown as Reminder[];
};

export const getRemindersByUserId = async (userId: number) => {
  return db
    .select()
    .from(reminders)
    .where(eq(reminders.user_id, userId))
    .orderBy(reminders.remind_at);
};

export const getReminderById = async (id: number) => {
  const result = await db.select().from(reminders).where(eq(reminders.id, id));
  return result[0] as Reminder;
};

export const createReminder = async (reminder: Reminder) => {
  const result = await db.insert(reminders).values(reminder).returning();
  return result[0]?.id;
};

export const updateReminder = async (reminder: Reminder) => {
  if (!reminder.id) throw new Error("Missing reminder ID");
  return db
    .update(reminders)
    .set(reminder)
    .where(eq(reminders.id, reminder.id));
};

export const deleteReminder = async (id: number) => {
  return db.delete(reminders).where(eq(reminders.id, id));
};
