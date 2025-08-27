import { neon } from "@neondatabase/serverless";
import { Reminder, ReminderDTO } from "@/lib/models";

const sql = neon(`${process.env.DATABASE_URL}`);

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
  const result = await sql`SELECT * FROM reminders WHERE remind_at <= ${now}`;

  return result as unknown as Reminder[];
};

export const getRemindersByUserId = async (userId: number) => {
  const result = await sql`
    SELECT * FROM reminders WHERE user_id = ${userId} ORDER BY remind_at
  `;

  return result as unknown as Reminder[];
};

export const getReminderById = async (id: number) => {
  const result = await sql`SELECT * FROM reminders WHERE id = ${id}`;

  return result[0] as Reminder;
};

export const createReminder = async (reminder: Reminder) => {
  const { user_id, name, period, remind_at } = reminder;
  const result = await sql`
    INSERT INTO reminders (user_id, name, period, remind_at)
    VALUES (${user_id}, ${name}, ${period}, ${remind_at})
    RETURNING id
  `;

  return result[0].id as number;
};

export const updateReminder = async (reminder: Reminder) => {
  const { id, name, period, remind_at } = reminder;
  await sql`
    UPDATE reminders 
    SET name = ${name}, period = ${period}, remind_at = ${remind_at}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${id}
  `;
};

export const deleteReminder = async (id: number) => {
  await sql`DELETE FROM reminders WHERE id = ${id}`;
};
