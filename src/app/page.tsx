"use client";

import { useState } from "react";
import { ReminderDTO } from "@/lib/models";
import { useRemindersQuery } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import ListItem from "@/components/list-item";
import { Plus } from "lucide-react";
import { ReminderSheet } from "@/components/reminder-sheet";

export default function Home() {
  const { query, createMutation, updateMutation, deleteMutation } =
    useRemindersQuery();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<ReminderDTO | null>(
    null,
  );

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
              onDeleteClick={() => {
                deleteMutation.mutate(reminder.id);
              }}
            />
          ))}
        </div>
      )}
      <ReminderSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        reminder={reminderToEdit}
        createMutation={createMutation}
        updateMutation={updateMutation}
      />
    </>
  );
}
