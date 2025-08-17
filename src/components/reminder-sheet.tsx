import { useState } from "react";
import { useIsMobile } from "@/lib/hooks";
import { Reminder } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ReminderSheetProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: Reminder | null;
}
export function ReminderSheet({
  isOpen,
  onClose,
  reminder,
}: ReminderSheetProps) {
  const isMobile = useIsMobile();

  const [name, setName] = useState(reminder?.name || "");
  const [remindAt, setRemindAt] = useState(
    reminder?.remind_at
      ? new Date(reminder.remind_at).toISOString().slice(0, 16)
      : "",
  );
  const [period, setPeriod] = useState(reminder?.period || "");

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <SheetHeader></SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="remind-at">Remind At</Label>
            <Input id="remind-at" type="datetime-local" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="period">Period</Label>
            <Input
              id="period"
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
              }}
            />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
