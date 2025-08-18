import { ReminderDTO } from "@/lib/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRemindersQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryFn: fetchReminders,
    queryKey: ["reminders"],
  });

  const createMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
const fetchReminders = async () => {
  const response = await fetch("/api/reminders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as unknown as ReminderDTO[];
};

const createReminder = async (reminder: ReminderDTO) => {
  const response = await fetch("/api/reminders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });
  if (!response.ok) {
    throw new Error("Failed to create reminder");
  }
  return (await response.json()) as ReminderDTO;
};

const updateReminder = async (reminder: ReminderDTO) => {
  const response = await fetch("/api/reminders", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });
  if (!response.ok) {
    throw new Error("Failed to update reminder");
  }
  return (await response.json()) as ReminderDTO;
};

const deleteReminder = async (id: number) => {
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
