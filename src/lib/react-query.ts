import { Reminder } from "@/lib/models";

export const fetchReminders = async () => {
  const response = await fetch("/api/reminders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as unknown as Reminder[];
};

export const deleteReminder = async (id: number) => {
  const response = await fetch("/api/reminders", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete reminder");
  }
  return id;
};
