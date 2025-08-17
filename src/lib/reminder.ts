import { Reminder } from "@/lib/models";

export const getDueReminders = async (db: D1Database, now: Date) => {
  const sql = `SELECT * FROM reminders WHERE remind_at <= ?`;
  const result = await db.prepare(sql).bind(now.toISOString()).all();

  return result.results as Reminder[];
};

export const getRemindersByUserId = async (db: D1Database, userId: number) => {
  const sql = `SELECT * FROM reminders WHERE user_id = ? ORDER BY remind_at`;
  const result = await db.prepare(sql).bind(userId).all();

  return result.results as Reminder[];
};

export const getReminderById = async (db: D1Database, id: number) => {
  const sql = `SELECT * FROM reminders WHERE id = ?`;
  const result = await db.prepare(sql).bind(id).first();

  return result as Reminder;
};

export const createReminder = async (db: D1Database, reminder: Reminder) => {
  const { user_id, name, period, remind_at } = reminder;
  const sql = `INSERT INTO reminders (user_id, name, period, remind_at) VALUES (?, ?, ?, ?)`;

  const result = await db
    .prepare(sql)
    .bind(user_id, name, period, remind_at)
    .run();

  const id = result.meta.last_row_id;

  return { id, user_id, name, period, remind_at } as Reminder;
};

export const updateReminder = async (db: D1Database, reminder: Reminder) => {
  const { id, name, period, remind_at } = reminder;
  const sql = `UPDATE reminders SET name = ?, period = ?, remind_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  await db.prepare(sql).bind(name, period, remind_at, id).run();

  return { id, name, period, remind_at } as Reminder;
};

export const deleteReminder = async (db: D1Database, id: number) => {
  const sql = `DELETE FROM reminders WHERE id = ?`;
  await db.prepare(sql).bind(id).run();
};
