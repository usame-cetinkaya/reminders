import { FormEvent, useEffect, useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { toDatetimeLocal } from "@/lib/date";
import { useIsMobile } from "@/lib/hooks";
import { Period, ReminderDTO } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ReminderSheetProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ReminderDTO | null;
  createMutation: UseMutationResult<ReminderDTO, Error, ReminderDTO>;
  updateMutation: UseMutationResult<ReminderDTO, Error, ReminderDTO>;
}
export function ReminderSheet({
  isOpen,
  onClose,
  reminder,
  createMutation,
  updateMutation,
}: ReminderSheetProps) {
  const isMobile = useIsMobile();

  const [name, setName] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [period, setPeriod] = useState<Period>("once");

  useEffect(() => {
    if (reminder) {
      setName(reminder.name);
      setRemindAt(toDatetimeLocal(reminder.remind_at));
      setPeriod(reminder.period);
    } else {
      setName("");
      setRemindAt("");
      setPeriod("once");
    }
  }, [reminder, isOpen]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const reminderDTO: ReminderDTO = {
      id: reminder?.id || 0,
      name,
      remind_at: new Date(remindAt).toISOString(),
      period,
    };

    if (reminder) {
      updateMutation.mutate(reminderDTO);
    } else {
      createMutation.mutate(reminderDTO);
    }

    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{reminder ? "Edit" : "New"} Reminder</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                required
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="remind-at">Remind At</Label>
              <Input
                required
                id="remind-at"
                type="datetime-local"
                value={remindAt}
                onChange={(e) => {
                  setRemindAt(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={period}
                onValueChange={(value) => setPeriod(value as typeof period)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="mt-6">
              Save
            </Button>
          </div>
        </form>
        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
