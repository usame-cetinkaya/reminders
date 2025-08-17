"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Reminder } from "@/lib/models";
import { deleteReminder, fetchReminders } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import ListItem from "@/components/list-item";
import { Plus } from "lucide-react";
import { ReminderSheet } from "@/components/reminder-sheet";

export default function Home() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryFn: fetchReminders,
    queryKey: ["reminders"],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [reminder, setReminder] = useState<Reminder | null>(null);

  return (
    <>
      {query.isLoading && <div>Loading...</div>}
      {query.isError && <div>Error: {query.error.message}</div>}
      {query.isSuccess && (
        <div className="flex flex-col gap-4">
          {query.data.map((reminder: Reminder) => (
            <ListItem
              key={reminder.id}
              reminder={reminder}
              onItemClick={() => {
                setReminder(reminder);
                setIsSheetOpen(true);
              }}
              onDeleteClick={() => {
                deleteMutation.mutate(reminder.id);
              }}
            />
          ))}
        </div>
      )}
      <Button
        onClick={() => {
          setReminder(null);
          setIsSheetOpen(true);
        }}
        variant="outline"
        className="absolute right-4 bottom-4 rounded-full size-12 cursor-pointer"
      >
        <Plus className="size-12" />
      </Button>
      <ReminderSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        reminder={reminder}
      />
    </>
  );
}
