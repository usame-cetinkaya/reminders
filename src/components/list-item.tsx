import { Reminder } from "@/lib/models";
import { localDateTime } from "@/lib/notification";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Trash } from "lucide-react";

interface ListItemProps {
  reminder: Reminder;
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
      className="cursor-pointer flex items-center p-2 pl-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <span className="text-lg font-semibold">{reminder.name}</span>
      <div className="flex items-center gap-4 ml-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="size-4" />
          <span>{localDateTime(reminder.remind_at)}</span>
        </div>
        <div className="flex items-center gap-1">
          <RefreshCw className="size-4" />
          <span>{reminder.period}</span>
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
