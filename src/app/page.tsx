"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Reminder } from "@/lib/models";
import { deleteReminder, fetchReminders } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import ListItem from "@/components/list-item";
import { Plus } from "lucide-react";

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
                alert(`Reminder clicked: ${reminder.name}`);
              }}
              onDeleteClick={() => {
                deleteMutation.mutate(reminder.id);
              }}
            />
          ))}
        </div>
      )}
      <Button
        variant="outline"
        className="absolute right-4 bottom-4 rounded-full size-12 cursor-pointer"
      >
        <Plus className="size-12" />
      </Button>
    </>
  );
}
