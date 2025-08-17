"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reminder } from "@/lib/models";

export default function Home() {
  const fetchReminders = async () => {
    const response = await fetch("/api/reminders");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json() as unknown as Reminder[];
  };

  const query = useQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
  });

  return (
    <>
      {query.isLoading && <div>Loading...</div>}
      {query.isError && <div>Error: {query.error.message}</div>}
      {query.isSuccess && (
        <div className="flex flex-col gap-4">
          {query.data.map((reminder: Reminder) => (
            <div
              key={reminder.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold">{reminder.name}</h3>
              <p className="text-sm text-gray-600">{reminder.period}</p>
            </div>
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
