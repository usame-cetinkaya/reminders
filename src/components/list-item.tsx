import { ReminderDTO } from "@/lib/models";
import { localDateTime } from "@/lib/notification";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Trash } from "lucide-react";

interface ListItemProps {
  reminder: ReminderDTO;
  onItemClick: () => void;
  onDeleteClick: () => void;
}
export default function ListItem({
  reminder,
  onItemClick,
  onDeleteClick,
}: ListItemProps) {
  return (
    <div
      onClick={() => onItemClick()}
      className="cursor-pointer flex items-center p-2 border rounded-lg hover:bg-accent transition-colors"
    >
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold leading-none">
          {reminder.name}
        </span>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span className="leading-none">
              {localDateTime(reminder.remind_at)}
            </span>
          </div>
          {reminder.period !== "once" && (
            <div className="flex items-center gap-1">
              <RefreshCw className="size-4" />
              <span className="leading-none">{reminder.period}</span>
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Are you sure you want to delete this reminder?")) {
            onDeleteClick();
          }
        }}
        variant="secondary"
        className="ml-auto cursor-pointer"
      >
        <Trash />
      </Button>
    </div>
  );
}
