export type User = {
  id: number;
  email: string;
  created_at: string;
};

export type Reminder = {
  id: number;
  user_id: number;
  name: string;
  period: "once" | "daily" | "weekly" | "monthly" | "yearly";
  remind_at: string;
  created_at: string;
  updated_at: string;
};
