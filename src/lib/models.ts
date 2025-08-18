export type User = {
  id: number;
  email: string;
  pb_token: string | null;
  api_token: string | null;
  created_at: string;
};

export type Period = "once" | "daily" | "weekly" | "monthly" | "yearly";

export type Reminder = {
  id: number;
  user_id: number;
  name: string;
  period: Period;
  remind_at: string;
  created_at: string;
  updated_at: string;
};

export type ReminderDTO = Omit<
  Reminder,
  "user_id" | "created_at" | "updated_at"
>;
