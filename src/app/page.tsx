"use client";

import { useState } from "react";
import { ReminderDTO } from "@/lib/models";
import { useRemindersQuery } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import ListItem from "@/components/list-item";
import { Plus } from "lucide-react";
import { ReminderForm } from "@/components/reminder-form";

export default function Home() {
  const { query, createMutation, updateMutation, deleteMutation } =
    useRemindersQuery();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<ReminderDTO | null>(
    null,
  );
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  return (
    <>
      <div className="flex mb-4">
        <Button
          onClick={() => {
            setReminderToEdit(null);
            setIsSheetOpen(true);
          }}
          className="cursor-pointer ml-auto"
        >
          <Plus /> Add Reminder
        </Button>
      </div>
      {query.isLoading && <div>Loading...</div>}
      {query.isError && <div>Error: {query.error.message}</div>}
      {query.isSuccess && (
        <div className="flex flex-col gap-4">
          {query.data.map((reminder: ReminderDTO) => (
            <ListItem
              key={reminder.id}
              reminder={reminder}
              onItemClick={() => {
                setReminderToEdit(reminder);
                setIsSheetOpen(true);
              }}
              onDeleteClick={async () => {
                setDeletingIds((prev) => [...prev, reminder.id]);
                await deleteMutation.mutateAsync(reminder.id);
                setDeletingIds((prev) =>
                  prev.filter((id) => id !== reminder.id),
                );
              }}
              isDeleting={deletingIds.includes(reminder.id)}
            />
          ))}
        </div>
      )}
      <ReminderForm
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        reminder={reminderToEdit}
        createMutation={createMutation}
        updateMutation={updateMutation}
      />
    </>
  );
}
