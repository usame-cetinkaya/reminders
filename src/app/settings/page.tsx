"use client";

import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label>Theme</label>
          <Select value={theme} onValueChange={(value) => setTheme(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
